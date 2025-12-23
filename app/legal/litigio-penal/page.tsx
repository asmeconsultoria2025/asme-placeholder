import LegalServiceClient from '../LegalServiceClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function LitigioPenalPage() {
  const investigacionImages = await fetchLegalServiceImages('legal-penal', 'investigacion');
  const juicioImages = await fetchLegalServiceImages('legal-penal', 'juicio');
  const amparosImages = await fetchLegalServiceImages('legal-penal', 'amparos');
  const victimasImages = await fetchLegalServiceImages('legal-penal', 'victimas');

  return (
    <LegalServiceClient
      pageTitle="Litigio Penal"
      pageDescription="Defensa penal especializada en todas las etapas del proceso"
      sections={[
        {
          title: "Etapa de Investigación",
          description: "Defensa durante la investigación inicial y complementaria, audiencias de control y protección de derechos del imputado.",
          image: investigacionImages[0] || '',
        },
        {
          title: "Juicio Oral",
          description: "Representación en juicio oral, preparación de teoría del caso, interrogatorios y alegatos finales.",
          image: juicioImages[0] || '',
        },
        {
          title: "Amparos en Materia Penal",
          description: "Amparos contra actos de autoridad en materia penal, protección de garantías y derechos fundamentales.",
          image: amparosImages[0] || '',
        },
        {
          title: "Asesoría a Víctimas",
          description: "Acompañamiento legal a víctimas y ofendidos del delito, asesoría en reparación del daño.",
          image: victimasImages[0] || '',
        },
      ]}
    />
  );
}