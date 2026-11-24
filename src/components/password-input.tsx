import { useState, ChangeEvent } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { color, font, radius } from "@/lib/theme";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function PasswordInput({ value, onChange, placeholder = "Enter password", disabled }: Props) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      background: color.surface,
      border: `1px solid ${focused ? color.tealBorder : color.border}`,
      borderRadius: radius.md,
      padding: "0 14px",
      transition: "border-color 0.15s",
    }}>
      <KeyRound size={16} color={focused ? color.teal : color.inkMuted} style={{ flexShrink: 0, transition: "color 0.15s" }} />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, background: "none", border: "none", outline: "none",
          color: color.ink, fontFamily: show ? font.mono : font.body,
          fontSize: "0.9rem", padding: "13px 0",
          letterSpacing: show ? "0.04em" : "inherit",
        }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        disabled={disabled}
        tabIndex={-1}
        style={{
          background: "none", border: "none", padding: "4px",
          color: color.inkMuted, cursor: "pointer", lineHeight: 0,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = color.teal)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = color.inkMuted)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
