import type { Metadata, Viewport } from 'next';
import './globals.css';
import "react-day-picker/dist/style.css";
import { cn } from '@/app/lib/utils';
import { Navbar } from '@/app/components/common/Navbar';
import { LayoutClientWrapper } from '@/app/components/common/LayoutClientWrapper';
import { SEOSchemaMarkupMainASME } from '@/app/components/SEOSchemaMarkup-MainASME'

const businessName = 'ASME';
const businessPhone = '+52 664 201 6011';
const businessAddress = 'Carretera Tijuana-Rosarito, Fraccionamiento Francisco Zarco 9650, 22260 Tijuana, B.C., México';
const businessCity = 'Tijuana';
const businessState = 'Baja California';
const businessCountry = 'Mexico';
const businessEmail = 'info@asme.com.mx'; // Update with your email
const businessURL = 'https://asme.com.mx'; // Update with your domain
const businessLogo = 'https://asme.com.mx/logo.png'; // Update with your logo

export const metadata: Metadata = {
  metadataBase: new URL(businessURL),
  
  // Main homepage
  title: 'ASME - Capacitación, Protección Civil & Servicios Legales | Tijuana',
  description: 'Soluciones integrales: Capacitación RCP, plan PIPC, protección civil empresarial y servicios legales. Expertos en seguridad industrial y defensa legal en Tijuana, Baja California y México.',
  
  keywords: [
    'capacitación RCP Tijuana',
    'plan interno protección civil',
    'PIPC empresa',
    'cursos primeros auxilios',
    'protección civil Baja California',
    'consultoría seguridad industrial',
    'servicios legales empresariales',
    'litigio empresarial Tijuana',
    'defensa legal Baja California',
  ].join(', '),

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: businessURL,
    siteName: businessName,
    title: 'ASME - Capacitación, Protección Civil & Servicios Legales',
    description: 'Protección integral para empresas: Capacitación, PIPC y asesoría legal. Expertos en Tijuana, Baja California.',
    images: [
      {
        url: `${businessURL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'ASME - Consultoría, Capacitación y Servicios Legales',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'ASME - Capacitación, Protección Civil & Servicios Legales',
    description: 'Protección integral: Capacitación RCP, PIPC empresarial y servicios legales en Tijuana.',
    images: [`${businessURL}/og-image.jpg`],
    creator: '@asmeoficial', // Update with your Twitter handle
  },

  // Additional meta tags
  authors: [{ name: 'ASME' }],
  creator: 'ASME',
  publisher: 'ASME',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // Canonical
  alternates: {
    canonical: businessURL,
  },

  // Google verification
  verification: {
    google: 'tcWpunmVnzrDgTdH0Ho5stupxhrGW7CwVlVYvJ7Tg8Q', // Add your code
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ============================================================
// SERVICE PAGE METADATA FUNCTIONS
// ============================================================

/**
 * Capacitación / Training Services
 */
export function generateCapacitacionMeta(): Metadata {
  return {
    title: 'Capacitación RCP & Primeros Auxilios - Certificado | ASME Tijuana',
    description: 'Cursos certificados de RCP, primeros auxilios y seguridad ocupacional. Capacitación para brigadas empresariales. +52 664 201 6011',
    keywords: 'capacitación RCP, curso primeros auxilios, capacitación seguridad, entrenamiento empresa',
    openGraph: {
      title: 'Capacitación RCP & Primeros Auxilios - Certificado',
      description: 'Cursos profesionales certificados para empresas en Tijuana y Baja California.',
      url: `${businessURL}/capacitacion`,
      type: 'article',
    },
  };
}

/**
 * Protección Civil / PIPC Services
 */
export function generateProteccionCivilMeta(): Metadata {
  return {
    title: 'Plan Interno Protección Civil (PIPC) - Consultoría | ASME',
    description: 'Diseño e implementación de PIPC, evaluación de riesgos y consultoría en protección civil. Cumplimiento normativo en Tijuana, Baja California.',
    keywords: 'PIPC, plan protección civil, evaluación riesgos, protección civil empresa, consultoría seguridad',
    openGraph: {
      title: 'Plan Interno Protección Civil (PIPC)',
      description: 'Consultoría integral en protección civil y prevención de riesgos empresariales.',
      url: `${businessURL}/proteccion-civil`,
      type: 'article',
    },
  };
}

/**
 * Legal Services
 */
export function generateServiciosLegalesMeta(): Metadata {
  return {
    title: 'Servicios Legales Empresariales - Defensa Legal | ASME Tijuana',
    description: 'Litigio empresarial, asesoría legal y defensa de empresas. Abogados especializados en Tijuana, Baja California.',
    keywords: 'servicios legales, litigio empresarial, asesoría legal, abogado empresa',
    openGraph: {
      title: 'Servicios Legales Empresariales',
      description: 'Defensa legal integral para empresas: litigio, asesoría y cumplimiento normativo.',
      url: `${businessURL}/servicios-legales`,
      type: 'article',
    },
  };
}

/**
 * Courses / Detailed Training
 */
export function generateRCPMeta(): Metadata {
  return {
    title: 'Curso RCP Certificado - Reanimación Cardiopulmonar | ASME',
    description: 'Curso de RCP certificado internacionalmente. Presencial y en línea. Capacitación para empresas en Tijuana.',
    keywords: 'curso RCP, reanimación cardiopulmonar, certificación RCP, capacitación RCP',
    openGraph: {
      title: 'Curso RCP Certificado',
      description: 'Capacitación profesional en reanimación cardiopulmonar.',
      url: `${businessURL}/capacitacion/rcp`,
      type: 'article',
    },
  };
}

export function generatePrimerosAuxiliosMeta(): Metadata {
  return {
    title: 'Curso Primeros Auxilios - Capacitación Empresarial | ASME',
    description: 'Capacitación en primeros auxilios para brigadas y personal empresarial. Certificado reconocido en Baja California.',
    keywords: 'primeros auxilios, curso primeros auxilios, brigada emergencia, capacitación primeros auxilios',
    openGraph: {
      title: 'Curso Primeros Auxilios',
      description: 'Capacitación completa en primeros auxilios para empresas.',
      url: `${businessURL}/capacitacion/primeros-auxilios`,
      type: 'article',
    },
  };
}

/**
 * About / Who We Are
 */
export function generateAcercaDeMeta(): Metadata {
  return {
    title: 'Quiénes Somos - ASME | Expertos en Seguridad y Derecho',
    description: 'ASME: Más de 15 años ofreciendo capacitación, protección civil y servicios legales integrales en Tijuana, Baja California.',
    keywords: 'ASME, quiénes somos, empresa capacitación, experiencia legal',
    openGraph: {
      title: 'Quiénes Somos - ASME',
      description: 'Conoce la trayectoria y experiencia de ASME en capacitación y servicios legales.',
      url: `${businessURL}/acerca-de`,
      type: 'article',
    },
  };
}

/**
 * Case Studies / Success Stories
 */
export function generateCasosDeExitoMeta(): Metadata {
  return {
    title: 'Casos de Éxito - Empresas Protegidas | ASME',
    description: 'Casos reales de empresas que implementaron PIPC, capacitación y defensa legal con ASME. Resultados comprobados.',
    keywords: 'casos éxito, empresas protegidas, implementación PIPC, defensa legal exitosa',
    openGraph: {
      title: 'Casos de Éxito - ASME',
      description: 'Descubre cómo ASME ha ayudado a empresas a protegerse integralmente.',
      url: `${businessURL}/casos-exito`,
      type: 'article',
    },
  };
}

/**
 * Blog / Resources
 */
export function generateBlogMeta(): Metadata {
  return {
    title: 'Blog - Capacitación, Protección Civil y Legal | ASME',
    description: 'Artículos, guías y consejos sobre protección civil, capacitación empresarial y servicios legales.',
    keywords: 'blog, artículos protección civil, guías capacitación, asesoría legal',
    openGraph: {
      title: 'Blog - ASME',
      description: 'Recursos y artículos sobre seguridad empresarial y servicios legales.',
      url: `${businessURL}/blog`,
      type: 'article',
    },
  };
}

/**
 * Contact / Get in Touch
 */
export function generateContactoMeta(): Metadata {
  return {
    title: 'Contacto - ASME | Solicita una Consulta',
    description: 'Contáctanos para capacitación, PIPC o asesoría legal. Teléfono: +52 664 201 6011. Tijuana, Baja California.',
    keywords: 'contacto ASME, solicitar consulta, agendar capacitación',
    openGraph: {
      title: 'Contacto - ASME',
      description: 'Ponte en contacto con nuestros expertos en capacitación y servicios legales.',
      url: `${businessURL}/contacto`,
      type: 'article',
    },
  };
}

/**
 * Pricing / Cotizaciones
 */
export function generateCotizacionesMeta(): Metadata {
  return {
    title: 'Cotizaciones y Precios - Capacitación y PIPC | ASME',
    description: 'Solicita una cotización para capacitación RCP, PIPC o servicios legales. Presupuestos personalizados sin compromiso.',
    keywords: 'precios capacitación, costo PIPC, cotización, presupuesto ASME',
    openGraph: {
      title: 'Cotizaciones - ASME',
      description: 'Obtén presupuestos personalizados para nuestros servicios.',
      url: `${businessURL}/cotizaciones`,
      type: 'article',
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <Navbar />
        {/* ✅ Client-side logic wrapper controls what renders below */}
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}
