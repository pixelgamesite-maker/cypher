import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileArchive, X } from "lucide-react";
import { color, font, radius } from "@/lib/theme";
import { formatBytes } from "@/lib/utils";

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function DropZone({ file, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange(dropped);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (picked) onChange(picked);
    e.target.value = "";
  }

  const borderColor = dragging
    ? color.teal
    : file
    ? color.tealBorder
    : color.border;

  const bgColor = dragging
    ? color.tealGlow
    : file
    ? `${color.tealGlow}`
    : color.surface;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && !file && inputRef.current?.click()}
      style={{
        border: `2px dashed ${borderColor}`,
        borderRadius: radius.lg,
        background: bgColor,
        padding: "48px 24px",
        textAlign: "center",
        cursor: disabled ? "not-allowed" : file ? "default" : "pointer",
        transition: "border-color 0.2s, background 0.2s",
        position: "relative",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleChange}
        disabled={disabled}
      />

      {file ? (
        /* File selected state */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: radius.md,
            background: color.tealGlow, border: `1px solid ${color.tealBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FileArchive size={24} color={color.teal} />
          </div>
          <div>
            <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "0.95rem", color: color.ink, fontFamily: font.mono }}>
              {file.name}
            </p>
            <p style={{ margin: 0, fontSize: "0.8rem", color: color.inkSoft }}>
              {formatBytes(file.size)}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            disabled={disabled}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "none", border: `1px solid ${color.border}`,
              borderRadius: radius.full, padding: "5px 12px",
              color: color.inkSoft, fontSize: "0.78rem",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = color.error;
              (e.currentTarget as HTMLButtonElement).style.color = color.error;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = color.border;
              (e.currentTarget as HTMLButtonElement).style.color = color.inkSoft;
            }}
          >
            <X size={12} />
            Remove
          </button>
        </div>
      ) : (
        /* Empty state */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: radius.md,
            background: color.surfaceHi, border: `1px solid ${color.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
          }}>
            <UploadCloud size={26} color={dragging ? color.teal : color.inkMuted} />
          </div>
          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: "0.95rem", color: color.ink }}>
              {dragging ? "Drop it here" : "Drop your file here"}
            </p>
            <p style={{ margin: 0, fontSize: "0.82rem", color: color.inkSoft }}>
              or{" "}
              <span style={{ color: color.teal, fontWeight: 500, cursor: "pointer" }}>
                click to browse
              </span>
              {" "}— zip, rar, 7z, any format
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
