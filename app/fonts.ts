// app/fonts.ts
import { Playfair_Display_SC, Lora } from "next/font/google";

export const legalHeadingFont = Playfair_Display_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-legal-heading",
});

export const legalBodyFont = Lora({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-legal-body",
});
