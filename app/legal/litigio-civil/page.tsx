// app/legal/litigio-civil/page.tsx
import LitigioCivilClient from './LitigioCivilClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function LitigioCivilPage() {
  // Fetch from DB - NO FALLBACKS!
  const contractualesImages = await fetchLegalServiceImages('legal-civil', 'contractuales');
  const inmobiliariasImages = await fetchLegalServiceImages('legal-civil', 'inmobiliarias');
  const cobranzaImages = await fetchLegalServiceImages('legal-civil', 'cobranza');
  const societariasImages = await fetchLegalServiceImages('legal-civil', 'societarias');
  const responsabilidadImages = await fetchLegalServiceImages('legal-civil', 'responsabilidad');
  const sucesorioImages = await fetchLegalServiceImages('legal-civil', 'sucesorio');

  return (
    <LitigioCivilClient
      contractualesImages={contractualesImages}
      inmobiliariasImages={inmobiliariasImages}
      cobranzaImages={cobranzaImages}
      societariasImages={societariasImages}
      responsabilidadImages={responsabilidadImages}
      sucesorioImages={sucesorioImages}
    />
  );
}