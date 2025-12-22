// app/legal/layout.tsx

import * as React from "react";
import type { Metadata, Viewport } from "next";

import { cn } from "@/app/lib/utils";
import { LegalFooter } from "@/app/components/legal/LegalFooter";
import { GoHomeFAB } from "@/app/components/common/GoHomeFAB";
import WhatsAppFAB from "@/app/components/common/WhatsAppFAB";
import { Toaster } from "@/app/components/ui/toaster";

// ============================================================
// METADATA (UNCHANGED)
// ============================================================

const businessName = "ASME Abogados";
const businessPhone = "+52 664 201 6011";
const businessAddress =
  "Carretera Tijuana-Rosarito, Fraccionamiento Francisco Zarco 9650, 22260 Tijuana, B.C., México";
const businessCity = "Tijuana";
const businessState = "Baja California";
const businessCountry = "Mexico";
const businessEmail = "info@asmeabogados.com";
const businessURL = "https://asmeabogados.com";
const businessLogo = "https://asmeabogados.com/white_logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(businessURL),
  title:
    "ASME Abogados Tijuana | Violencia Vicaria & Custodia | Expertos en Defensa Familiar",
  description:
    "Abogados especializados en violencia vicaria y falsas acusaciones en custodia. Defensa experta para madres en Tijuana y Baja California. +52 664 201 6011",
  keywords: [
    "violencia vicaria abogado Tijuana",
    "abogado custodia falsas acusaciones",
    "abogado familia Tijuana",
    "litigio familiar Baja California",
    "defensa madre acusaciones fabricadas",
    "criminalización madre custodia",
    "abogado especializado violencia vicaria",
  ].join(", "),
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: businessURL,
    siteName: businessName,
    title: "ASME Abogados Tijuana | Violencia Vicaria & Custodia",
    description:
      "Defensa especializada en violencia vicaria y falsas acusaciones en custodia. Protegemos los derechos de madres en Tijuana, Baja California.",
    images: [
      {
        url: `${businessURL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "ASME Abogados - Especialistas en Violencia Vicaria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASME Abogados Tijuana | Violencia Vicaria & Custodia",
    description:
      "Abogados especializados en defensa de madres contra falsas acusaciones y violencia vicaria en Baja California.",
    images: [`${businessURL}/og-image.jpg`],
    creator: "@asmeabogados",
  },
  authors: [{ name: "ASME Abogados" }],
  creator: "ASME Abogados",
  publisher: "ASME Abogados",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: businessURL,
  },
  verification: {
    google: "tcWpunmVnzrDgTdH0Ho5stupxhrGW7CwVlVYvJ7Tg8Q",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ============================================================
// LAYOUT
// ============================================================

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "legal-font-scope min-h-screen bg-transparent antialiased"
      )}
    >
      <main>{children}</main>
      <LegalFooter />
      <Toaster />
      <GoHomeFAB />
      <WhatsAppFAB />
    </div>
  );
}
