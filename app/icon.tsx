import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 24% 22%, rgba(245, 158, 11, 0.28), transparent 30%), linear-gradient(180deg, #07080c 0%, #0d1118 48%, #090b10 100%)",
          color: "#f7f4ec",
          fontFamily: "Georgia, serif",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 40,
            borderRadius: 56,
            border: "2px solid rgba(247, 244, 236, 0.12)",
            background: "rgba(20, 23, 32, 0.82)"
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 246,
            height: 246,
            borderRadius: 48,
            background: "linear-gradient(180deg, rgba(224, 122, 63, 0.95), rgba(157, 77, 37, 0.96))",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)"
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              fontSize: 190,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.08em",
              marginTop: -8
            }}
          >
            K
          </div>
          <div
            style={{
              marginTop: -18,
              fontSize: 34,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontFamily: "Arial"
            }}
          >
            KAGE
          </div>
        </div>
      </div>
    ),
    size
  );
}
