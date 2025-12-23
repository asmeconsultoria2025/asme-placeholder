import LegalServiceClient from '../LegalServiceClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function LitigioCivilPage() {
  const contractualesImages = await fetchLegalServiceImages('legal-civil', 'contractuales');
  const inmobiliariasImages = await fetchLegalServiceImages('legal-civil', 'inmobiliarias');
  const cobranzaImages = await fetchLegalServiceImages('legal-civil', 'cobranza');
  const societariasImages = await fetchLegalServiceImages('legal-civil', 'societarias');
  const responsabilidadImages = await fetchLegalServiceImages('legal-civil', 'responsabilidad');
  const sucesorioImages = await fetchLegalServiceImages('legal-civil', 'sucesorio');

  return (
    <LegalServiceClient
      pageTitle="Litigio Civil"
      pageDescription="Asesoría y litigio en todas las áreas del derecho civil"
      sections={[
        {
          title: "Conflictos Contractuales",
          description: "Litigio en materia de contratos, incumplimiento de obligaciones y rescisión contractual.",
          image: contractualesImages[0] || '',
        },
        {
          title: "Controversias Inmobiliarias",
          description: "Asuntos de propiedad, arrendamiento, usucapión y conflictos relacionados con bienes inmuebles.",
          image: inmobiliariasImages[0] || '',
        },
        {
          title: "Cobranza Judicial",
          description: "Recuperación de adeudos mediante juicio ejecutivo mercantil y procedimientos de cobranza.",
          image: cobranzaImages[0] || '',
        },
        {
          title: "Disputas Societarias",
          description: "Conflictos entre socios, asuntos corporativos y resolución de controversias empresariales.",
          image: societariasImages[0] || '',
        },
        {
          title: "Responsabilidad Civil",
          description: "Demandas por daños y perjuicios, responsabilidad objetiva y subjetiva.",
          image: responsabilidadImages[0] || '',
        },
        {
          title: "Derecho Sucesorio",
          description: "Juicios testamentarios e intestamentarios, herencias, legados y testamentos.",
          image: sucesorioImages[0] || '',
        },
      ]}
    />
  );
}