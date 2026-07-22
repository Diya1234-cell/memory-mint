import { Inter, Plus_Jakarta_Sans, Playfair_Display, Space_Grotesk, Geist } from "next/font/google";

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

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
