export const theme = {
  default: "light",
  dark: "dark",
  light: "light",
} as const;

export type Theme = (typeof theme)[keyof typeof theme];
