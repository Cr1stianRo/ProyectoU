import { useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config/diseno";

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function darkenHex(hex, amount = 20) {
  let r = parseInt(hex.slice(1, 3), 16) - amount;
  let g = parseInt(hex.slice(3, 5), 16) - amount;
  let b = parseInt(hex.slice(5, 7), 16) - amount;
  r = Math.max(0, r); g = Math.max(0, g); b = Math.max(0, b);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function ThemeProvider({ children }) {
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        const t = res.data;
        if (!t || !t.primaryColor) return;
        const root = document.documentElement;
        root.style.setProperty("--cafe", t.primaryColor);
        root.style.setProperty("--cafe-oscuro", t.darkColor);
        root.style.setProperty("--arena", t.accentColor);
        root.style.setProperty("--bs-primary", t.primaryColor);
        root.style.setProperty("--bs-primary-rgb", hexToRgb(t.primaryColor));
        root.style.setProperty("--bs-body-bg", t.bgColor);
        root.style.setProperty("--text-base", t.darkColor);
        root.style.setProperty("--section-bg", t.sectionBg);
        root.style.setProperty("--bs-btn-hover-bg", darkenHex(t.primaryColor));
        root.style.setProperty("--bs-btn-hover-border-color", darkenHex(t.primaryColor));
        root.style.setProperty("--glass-radius", `${t.borderRadius}px`);
        if (t.font) {
          root.style.setProperty("font-family", `"${t.font}", system-ui, sans-serif`);
        }
      })
      .catch(() => {});
  }, []);

  return children;
}
