import type { Metadata } from "next";
import type { ReactNode } from "react";
import { inter, plusJakartaSans, geist, playfairDisplay, spaceGrotesk } from "@/lib/fonts";
import "@/styles/globals.css";
import { GalaxyBackground } from "@/components/ui/Background";

export const metadata: Metadata = {
  title: "MemoryVerse | Preserve Your Story",
  description:
    "Save photos, videos, journals, voice notes, letters, and milestones in one private shared space. Let AI transform your memories into stories you'll relive forever.",
  metadataBase: new URL("https://memorymint.example.com"),
  openGraph: {
    title: "MemoryVerse | Preserve Your Story",
    description:
      "Save photos, videos, journals, voice notes, letters, and milestones in one private shared space.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${plusJakartaSans.variable} ${geist.variable} ${playfairDisplay.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500&family=Playfair+Display:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GalaxyBackground />
        {children}
      </body>
    </html>
  );
}
