import { color, font } from "@/lib/theme";

export default function GlobalStyle() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
      body {
        margin: 0;
        background: ${color.bg};
        color: ${color.ink};
        font-family: ${font.body};
        -webkit-font-smoothing: antialiased;
        font-feature-settings: "tnum" 1;
      }
      a { color: inherit; text-decoration: none; }
      button { font: inherit; cursor: pointer; }
      img { max-width: 100%; }

      ::selection { background: ${color.teal}; color: #fff; }

      :focus-visible {
        outline: 2px solid ${color.teal};
        outline-offset: 3px;
        border-radius: 8px;
      }

      .press {
        transition: transform 0.15s cubic-bezier(0.2,0,0,1),
                    opacity 0.15s;
      }
      .press:hover  { transform: translateY(-1px); }
      .press:active { transform: translateY(0); opacity: 0.85; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .fade-up { animation: fadeUp 0.6s cubic-bezier(0.2,0.7,0.1,1) both; }

      @keyframes shimmer {
        0%   { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .spin { animation: spin 0.8s linear infinite; }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}
