import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "ViberQC";
  const description =
    searchParams.get("desc") ||
    "AI-Powered 360° Quality Control for Viber Apps";
  const score = searchParams.get("score");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0F0B2E 0%, #1a1145 50%, #2D1B69 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Logo area */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "#6C63FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: 700,
            color: "white",
          }}
        >
          V
        </div>
        <span style={{ fontSize: "28px", fontWeight: 700, color: "white" }}>
          ViberQC
        </span>
      </div>

      {/* Score (if provided) */}
      {score && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            borderRadius: "60px",
            border: "4px solid #6C63FF",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "48px", fontWeight: 700, color: "#6C63FF" }}>
            {score}
          </span>
        </div>
      )}

      {/* Title */}
      <div
        style={{
          fontSize: "40px",
          fontWeight: 700,
          color: "white",
          textAlign: "center",
          maxWidth: "800px",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: "20px",
          color: "rgba(255,255,255,0.6)",
          marginTop: "12px",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        {description}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
