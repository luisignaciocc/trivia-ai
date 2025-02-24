import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Trivia Wars: The Oracle's Challenge";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #1e40af, #7e22ce)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            padding: "32px 48px",
            borderRadius: "24px",
            border: "1px solid rgba(250,204,21,0.2)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: "bold",
              background: "linear-gradient(to right, #facc15, #fef08a)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Trivia Wars
          </h1>
          <p
            style={{
              fontSize: 32,
              color: "#e2e8f0",
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            The Oracle's Challenge
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              color: "#facc15",
              fontSize: 24,
            }}
          >
            <span>🧙‍♂️ Knowledge</span>
            <span>⚔️ Wisdom</span>
            <span>✨ Magic</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
