// ============================================================
// /api/monitoring — Uptime Monitoring
// GET: List monitors
// POST: Create monitor
// No credits needed (continuous monitoring)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";
import {
  createUptimeMonitor,
  listUptimeMonitors,
  type UptimeApiName,
} from "@/lib/integrations/uptime/orchestrator";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const provider = (request.nextUrl.searchParams.get("provider") ??
      "uptimerobot") as UptimeApiName;

    const result = await listUptimeMonitors(user.id, provider);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("[monitoring] GET Error:", error);
    return NextResponse.json(
      { error: "Failed to list monitors" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const {
      name,
      url,
      provider = "uptimerobot",
      checkIntervalSeconds,
    } = body as {
      name: string;
      url: string;
      provider?: UptimeApiName;
      checkIntervalSeconds?: number;
    };

    if (!name || !url) {
      return NextResponse.json(
        { error: "name and url are required" },
        { status: 400 },
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const result = await createUptimeMonitor(
      name,
      url,
      user.id,
      provider,
      checkIntervalSeconds,
    );

    return NextResponse.json({ result });
  } catch (error) {
    console.error("[monitoring] POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create monitor" },
      { status: 500 },
    );
  }
}
