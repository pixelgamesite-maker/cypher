import { useState } from "react";
import { Lock, Unlock, Download, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { color, font, radius } from "@/lib/theme";
import { encryptFile, decryptFile } from "@/lib/crypto";
import DropZone from "@/components/drop-zone";
import PasswordInput from "@/components/password-input";
import ProgressBar from "@/components/progress-bar";

type Mode = "encrypt" | "decrypt";
type Status = "idle" | "working" | "done" | "error";

interface Result {
  url: string;
  filename: string;
}

export default function Home() {
  const [mode, setMode]         = useState<Mode>("encrypt");
  const [file, setFile]         = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState<Status>("idle");
  const [result, setResult]     = useState<Result | null>(null);
  const [errMsg, setErrMsg]     = useState("");

  function switchMode(m: Mode) {
    if (status === "working") return;
    setMode(m);
    setFile(null);
    setPassword("");
    setProgress(0);
    setStatus("idle");
    setResult(null);
    setErrMsg("");
  }

  function handleFileChange(f: File | null) {
    setFile(f);
    setStatus("idle");
    setResult(null);
    setErrMsg("");
    setProgress(0);
  }

  async function handleSubmit() {
    if (!file)         { toast.error("Select a file first."); return; }
    if (!password)     { toast.error("Enter a password."); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 characters."); return; }

    setStatus("working");
    setProgress(0);
    setResult(null);
    setErrMsg("");

    try {
      const fn = mode === "encrypt" ? encryptFile : decryptFile;
      const { blob, filename } = await fn(file, password, setProgress);
      const url = URL.createObjectURL(blob);
      setResult({ url, filename });
      setStatus("done");
      toast.success(mode === "encrypt" ? "File encrypted!" : "File decrypted!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrMsg(msg);
      setStatus("error");
      toast.error(msg);
    }
  }

  const isWorking   = status === "working";
  const isDone      = status === "done";
  const isError     = status === "error";
  const canSubmit   = !!file && !!password && !isWorking;

  /* ── Tab button ── */
  function Tab({ m, label, Icon }: { m: Mode; label: string; Icon: typeof Lock }) {
    const active = mode === m;
    return (
      <button
        onClick={() => switchMode(m)}
        disabled={isWorking}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          gap: "8px", padding: "11px 0",
          background: active ? color.surfaceHi : "none",
          border: "none",
          borderRadius: radius.md,
          color: active ? color.ink : color.inkMuted,
          fontFamily: font.body, fontWeight: active ? 600 : 400, fontSize: "0.9rem",
          cursor: isWorking ? "not-allowed" : "pointer",
          transition: "background 0.15s, color 0.15s",
        }}
      >
        <Icon size={15} color={active ? color.teal : "currentColor"} />
        {label}
      </button>
    );
  }

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "52px 20px 80px" }}>

      {/* Hero */}
      <div className="fade-up" style={{ textAlign: "center", marginBottom: "44px" }}>
        <h1 style={{
          fontFamily: font.display, fontWeight: 700,
          fontSize: "clamp(2rem, 7vw, 2.8rem)",
          letterSpacing: "-0.04em", lineHeight: 1.1,
          margin: "0 0 14px", color: color.ink,
        }}>
          Encrypt your files.<br />
          <span style={{ color: color.teal }}>Own your privacy.</span>
        </h1>
        <p style={{ margin: 0, fontSize: "0.95rem", color: color.inkSoft, lineHeight: 1.6 }}>
          AES-256-GCM encryption — runs entirely in your browser.
          Nothing is uploaded. Nothing leaves your machine.
        </p>
      </div>

      {/* Card */}
      <div className="fade-up" style={{
        background: color.surface,
        border: `1px solid ${color.border}`,
        borderRadius: radius.xl,
        overflow: "hidden",
        animationDelay: "0.1s",
      }}>

        {/* Mode tabs */}
        <div style={{
          display: "flex", gap: "4px", padding: "8px",
          borderBottom: `1px solid ${color.border}`,
          background: color.bg,
        }}>
          <Tab m="encrypt" label="Encrypt" Icon={Lock} />
          <Tab m="decrypt" label="Decrypt" Icon={Unlock} />
        </div>

        {/* Body */}
        <div style={{ padding: "28px" }}>

          {/* Drop zone */}
          <DropZone file={file} onChange={handleFileChange} disabled={isWorking} />

          {/* Password */}
          <div style={{ marginTop: "16px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: color.inkSoft, marginBottom: "8px" }}>
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder={mode === "encrypt" ? "Set a strong password" : "Enter the password used to encrypt"}
              disabled={isWorking}
            />
            {mode === "encrypt" && (
              <p style={{ margin: "8px 0 0", fontSize: "0.75rem", color: color.inkMuted }}>
                Keep this safe — there's no recovery without it.
              </p>
            )}
          </div>

          {/* Progress */}
          {isWorking && (
            <div style={{ marginTop: "20px" }}>
              <ProgressBar value={progress} />
            </div>
          )}

          {/* Error */}
          {isError && (
            <div style={{
              marginTop: "16px", padding: "12px 14px",
              background: color.errorGlow, border: `1px solid ${color.error}30`,
              borderRadius: radius.md, display: "flex", alignItems: "center", gap: "10px",
            }}>
              <ShieldAlert size={16} color={color.error} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: "0.83rem", color: color.error }}>{errMsg}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="press"
            style={{
              marginTop: "20px", width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "13px",
              background: canSubmit ? color.teal : color.surfaceHi,
              color: canSubmit ? "#fff" : color.inkMuted,
              border: "none", borderRadius: radius.md,
              fontFamily: font.body, fontWeight: 600, fontSize: "0.95rem",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {isWorking ? (
              <>
                <Loader2 size={16} className="spin" />
                {mode === "encrypt" ? "Encrypting…" : "Decrypting…"}
              </>
            ) : (
              <>
                {mode === "encrypt" ? <Lock size={15} /> : <Unlock size={15} />}
                {mode === "encrypt" ? "Encrypt file" : "Decrypt file"}
              </>
            )}
          </button>

          {/* Result download */}
          {isDone && result && (
            <div style={{
              marginTop: "16px", padding: "14px 16px",
              background: color.successGlow, border: `1px solid ${color.success}30`,
              borderRadius: radius.md,
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <CheckCircle2 size={18} color={color.success} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 2px", fontSize: "0.82rem", color: color.success, fontWeight: 600 }}>
                  {mode === "encrypt" ? "Encrypted" : "Decrypted"} successfully
                </p>
                <p style={{
                  margin: 0, fontSize: "0.75rem", color: color.inkSoft,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  fontFamily: font.mono,
                }}>
                  {result.filename}
                </p>
              </div>
              <a
                href={result.url}
                download={result.filename}
                className="press"
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: color.success, color: "#fff",
                  border: "none", borderRadius: radius.md,
                  padding: "8px 14px", fontSize: "0.82rem", fontWeight: 600,
                  whiteSpace: "nowrap", textDecoration: "none",
                }}
              >
                <Download size={13} />
                Download
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Info pills */}
      <div className="fade-up" style={{
        marginTop: "28px", display: "flex", flexWrap: "wrap",
        gap: "10px", justifyContent: "center",
        animationDelay: "0.2s",
      }}>
        {["AES-256-GCM", "PBKDF2 · 310k rounds", "100% offline", "Open source"].map((tag) => (
          <span key={tag} style={{
            padding: "5px 12px", fontSize: "0.75rem",
            color: color.inkMuted, fontFamily: font.mono,
            background: color.surface, border: `1px solid ${color.border}`,
            borderRadius: radius.full,
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
