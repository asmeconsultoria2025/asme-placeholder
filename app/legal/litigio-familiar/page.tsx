import LegalServiceClient from '../LegalServiceClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function LitigioFamiliarPage() {
  const divorciosImages = await fetchLegalServiceImages('legal-familiar', 'divorcios');
  const pensionImages = await fetchLegalServiceImages('legal-familiar', 'pension');
  const custodiaImages = await fetchLegalServiceImages('legal-familiar', 'custodia');
  const vicariaImages = await fetchLegalServiceImages('legal-familiar', 'vicaria');

  return (
    <LegalServiceClient
      pageTitle="Litigio Familiar"
      pageDescription="Servicios especializados en derecho familiar"
      sections={[
        {
          title: "Divorcios",
          description: "Asesoría integral en procesos de divorcio voluntario y contencioso, división de bienes y liquidación de sociedad conyugal.",
          image: divorciosImages[0] || '',
        },
        {
          title: "Pensión Alimenticia",
          description: "Trámites de pensión alimenticia, modificación de pensión y cumplimiento de obligaciones familiares.",
          image: pensionImages[0] || '',
        },
        {
          title: "Guarda y Custodia",
          description: "Procesos de custodia de menores, régimen de convivencias y protección de derechos de los niños.",
          image: custodiaImages[0] || '',
        },
        {
          title: "Violencia Vicaria",
          description: "Defensa especializada en casos de violencia vicaria y protección de víctimas de violencia familiar.",
          image: vicariaImages[0] || '',
        },
      ]}
    />
  );
}