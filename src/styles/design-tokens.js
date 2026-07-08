/**
 * Kiddle Bookshop - Design Tokens
 * Centralized design system for consistent UI across all pages
 */

export const colors = {
  // Primary palette
  primary: {
    50: "#faf6ef",
    100: "#f5f0e8",
    200: "#ede0cc",
    300: "#e0cba8",
    400: "#cba882",
    500: "#a0693a", // Main brand color
    600: "#8a5830",
    700: "#7a4e22",
    800: "#5c3520",
    900: "#3d2010",
  },

  // Accent
  accent: {
    warm: "#D97706",
    amber: "#FCD34D",
    green: "#2d7a45",
    red: "#b43c1e",
  },

  // Text
  text: {
    primary: "#3d2010",
    secondary: "#5c3d1e",
    muted: "#9a7a5a",
    subtle: "#b09070",
  },

  // Backgrounds
  background: {
    default: "#faf7f2",
    paper: "#f5f0e8",
    white: "#ffffff",
    overlay: "rgba(20, 10, 2, 0.40)",
  },

  // Borders
  border: {
    light: "rgba(200, 170, 130, 0.20)",
    DEFAULT: "rgba(180, 140, 90, 0.28)",
    dark: "rgba(160, 105, 58, 0.35)",
  },
};

export const typography = {
  fontFamily: {
    sans: "'DM Sans', sans-serif",
    serif: "'Playfair Display', serif",
  },

  fontSize: {
    xs: "10px",
    sm: "11px",
    base: "12.5px",
    md: "13px",
    lg: "14px",
    xl: "15px",
    "2xl": "18px",
    "3xl": "20px",
    "4xl": "28px",
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  lineHeight: {
    tight: "1.2",
    normal: "1.5",
    relaxed: "1.75",
  },
};

export const spacing = {
  0: "0",
  1: "2px",
  2: "4px",
  3: "6px",
  4: "8px",
  5: "10px",
  6: "12px",
  8: "16px",
  10: "20px",
  12: "24px",
  16: "32px",
  20: "40px",
  24: "48px",
};

export const borderRadius = {
  none: "0",
  sm: "6px",
  DEFAULT: "10px",
  md: "14px",
  lg: "18px",
  xl: "22px",
  "2xl": "28px",
  "3xl": "36px",
  full: "9999px",
};

export const shadows = {
  sm: "0 2px 8px rgba(100, 60, 20, 0.06)",
  DEFAULT: "0 4px 16px rgba(100, 60, 20, 0.10)",
  md: "0 6px 24px rgba(100, 60, 20, 0.12)",
  lg: "0 12px 40px rgba(100, 60, 20, 0.15)",
  xl: "0 20px 64px rgba(100, 60, 20, 0.20)",
};

export const transitions = {
  fast: "150ms",
  DEFAULT: "200ms",
  slow: "300ms",
  slower: "400ms",
};

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

export const zIndices = {
  dropdown: 1000,
  modal: 2000,
  drawer: 3000,
  navbar: 9000,
  overlay: 8990,
  toast: 10000,
};
