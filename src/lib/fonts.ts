import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Geist is available on Google Fonts but some next/font versions
// may not resolve it. Use a Google Fonts CSS link as fallback
// and define a local CSS variable.
export const geist = Inter({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
