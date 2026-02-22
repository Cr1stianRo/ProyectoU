import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config/diseno";

// Default admin colors (always used outside Home)
const ADMIN_DEFAULTS = {
  "--cafe": "#8C6A4A",
  "--cafe-oscuro": "#5b4636",
  "--arena": "#E8D8C8",
  "--bs-primary": "#8C6A4A",
  "--bs-primary-rgb": "140,106,74",
  "--bs-body-bg": "#ffffff",
  "--text-base": "#5b4636",
  "--section-bg": "#f8f5f1",
  "--glass-radius": "22px",
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function darkenHex(hex, amount = 20) {
  let r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  let g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  let b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function ThemeProvider({ children }) {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/Home";
  const [theme, setTheme] = useState(null);

  // Reload theme from DB every time we enter Home
  useEffect(() => {
    if (isHome) {
      axios
        .get(API_URL)
        .then((res) => setTheme(res.data))
        .catch(() => {});
    }
  }, [isHome, location.pathname]);

  // Apply or reset depending on route AND theme data
  useEffect(() => {
    const root = document.documentElement;

    if (isHome && theme && theme.primaryColor) {
      root.style.setProperty("--cafe", theme.primaryColor);
      root.style.setProperty("--cafe-oscuro", theme.darkColor);
      root.style.setProperty("--arena", theme.accentColor);
      root.style.setProperty("--bs-primary", theme.primaryColor);
      root.style.setProperty("--bs-primary-rgb", hexToRgb(theme.primaryColor));
      root.style.setProperty("--bs-body-bg", theme.bgColor);
      root.style.setProperty("--text-base", theme.darkColor);
      root.style.setProperty("--section-bg", theme.sectionBg);
      root.style.setProperty("--bs-btn-hover-bg", darkenHex(theme.primaryColor));
      root.style.setProperty("--bs-btn-hover-border-color", darkenHex(theme.primaryColor));
      root.style.setProperty("--glass-radius", `${theme.borderRadius || 22}px`);
      if (theme.font) {
        root.style.setProperty("font-family", `"${theme.font}", system-ui, sans-serif`);
      }
    } else {
      // Reset to admin defaults
      Object.entries(ADMIN_DEFAULTS).forEach(([k, v]) => root.style.setProperty(k, v));
      root.style.setProperty("font-family", '"Poppins", system-ui, sans-serif');
      root.style.setProperty("--bs-btn-hover-bg", "#7a573b");
      root.style.setProperty("--bs-btn-hover-border-color", "#7a573b");
    }
  }, [isHome, theme]);

  return children;
}
