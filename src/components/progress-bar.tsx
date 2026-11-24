import { color, radius } from "@/lib/theme";

interface Props {
  value: number; // 0–100
}

export default function ProgressBar({ value }: Props) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{
        height: "4px", background: color.surfaceHi,
        borderRadius: radius.full, overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color.tealDim}, ${color.teal})`,
          borderRadius: radius.full,
          transition: "width 0.25s ease",
          boxShadow: `0 0 8px ${color.teal}60`,
        }} />
      </div>
      <p style={{ margin: "8px 0 0", fontSize: "0.78rem", color: color.inkMuted, textAlign: "right" }}>
        {value}%
      </p>
    </div>
  );
}
