import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { color, font, loadFonts } from "@/lib/theme";
import GlobalStyle from "@/components/global-style";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => { loadFonts(); }, []);

  return (
    <div style={{ background: color.bg, minHeight: "100vh", fontFamily: font.body, color: color.ink }}>
      <GlobalStyle />

      {/* Nav */}
      <header style={{
        borderBottom: `1px solid ${color.border}`,
        background: `${color.surface}cc`,
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          padding: "0 24px", height: "56px",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <ShieldCheck size={20} color={color.teal} strokeWidth={2} />
          <span style={{
            fontFamily: font.display,
            fontWeight: 700, fontSize: "1rem",
            letterSpacing: "-0.02em", color: color.ink,
          }}>
            Cloud iCrypter
          </span>
          <span style={{
            marginLeft: "auto", fontSize: "0.75rem",
            color: color.inkMuted, fontFamily: font.mono,
          }}>
            AES-256-GCM
          </span>
        </div>
      </header>

      <main>{children}</main>

      <footer style={{ borderTop: `1px solid ${color.border}`, marginTop: "80px" }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          padding: "28px 24px",
          display: "flex", flexWrap: "wrap", gap: "12px",
          justifyContent: "space-between", alignItems: "center",
        }}>
          <p style={{ margin: 0, fontSize: "0.8rem", color: color.inkMuted }}>
            All encryption happens in your browser. No files leave your machine.
          </p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: color.inkMuted, fontFamily: font.mono }}>
            PBKDF2 · 310k iterations · AES-256-GCM
          </p>
        </div>
      </footer>
    </div>
  );
}
