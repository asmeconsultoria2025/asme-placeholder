// app/servicios/page.tsx
// Server component - exports metadata

import ServiciosClient from '@/app/components/ServiciosClient';

export const metadata = {
  title: 'Servicios - Capacitación RCP, PIPC & Protección Civil | ASME',
  description: 'Soluciones integrales: Capacitación RCP, Plan PIPC, protección civil empresarial y seguridad industrial. Cumplimiento normativo en Tijuana, Baja California.',
  keywords: [
    'capacitación RCP',
    'PIPC empresa',
    'protección civil',
    'servicios capacitación',
    'seguridad empresarial',
  ].join(', '),
  openGraph: {
    title: 'Servicios - Capacitación, PIPC & Protección Civil',
    description: 'Soluciones completas en capacitación y protección civil para empresas.',
    url: 'https://asmeconsultoria.com/servicios',
    type: 'website',
  },
};

export default function ServiciosPage() {
  return <ServiciosClient />;
}