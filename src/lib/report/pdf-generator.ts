// ============================================================
// ViberQC — PDF Report Generator (Puppeteer)
// ============================================================

import puppeteer from "puppeteer";
import { db } from "@/lib/db";
import { scans, scanIssues } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateReportHtml, type ReportData } from "./template";
import type { ScanScores, ScanIssue } from "@/types";

export interface PdfGenerateOptions {
  scanId: string;
  branding?: {
    logo?: string;
    companyName?: string;
    primaryColor?: string;
  };
}

// -----------------------------------------------------------
// Generate PDF from scan data
// -----------------------------------------------------------
export async function generatePdfReport(
  options: PdfGenerateOptions,
): Promise<Buffer> {
  // 1. Fetch scan data
  const scan = await db
    .select()
    .from(scans)
    .where(eq(scans.id, options.scanId))
    .limit(1);

  if (scan.length === 0) {
    throw new Error(`Scan not found: ${options.scanId}`);
  }

  const scanData = scan[0];

  if (!scanData.scores || scanData.status !== "completed") {
    throw new Error(`Scan is not completed: ${options.scanId}`);
  }

  // 2. Fetch issues
  const issues = await db
    .select()
    .from(scanIssues)
    .where(eq(scanIssues.scanId, options.scanId));

  // 3. Build report data
  const reportData: ReportData = {
    url: scanData.url,
    scores: scanData.scores as ScanScores,
    issues: issues.map((issue) => ({
      id: issue.id,
      phase: issue.phase as ScanIssue["phase"],
      severity: issue.severity as ScanIssue["severity"],
      title: issue.title,
      description: issue.description,
      recommendation: issue.recommendation ?? "",
      filePath: issue.filePath,
      lineNumber: issue.lineNumber,
    })),
    durationMs: scanData.durationMs ?? 0,
    scannedAt: (scanData.completedAt ?? scanData.createdAt).toISOString(),
    branding: options.branding,
  };

  // 4. Generate HTML
  const html = generateReportHtml(reportData);

  // 5. Render to PDF via Puppeteer
  const pdfBuffer = await renderHtmlToPdf(html);

  return pdfBuffer;
}

// -----------------------------------------------------------
// Generate PDF from raw data (without DB lookup)
// -----------------------------------------------------------
export async function generatePdfFromData(data: ReportData): Promise<Buffer> {
  const html = generateReportHtml(data);
  return renderHtmlToPdf(html);
}

// -----------------------------------------------------------
// Puppeteer HTML → PDF
// -----------------------------------------------------------
async function renderHtmlToPdf(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30_000,
    });

    // Wait for chart images to load
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }),
          ),
      );
    });

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        bottom: "15mm",
        left: "12mm",
        right: "12mm",
      },
    });

    return Buffer.from(pdfUint8);
  } finally {
    await browser.close();
  }
}
