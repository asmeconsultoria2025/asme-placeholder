// app/legal/litigio-penal/page.tsx
import LitigioPenalClient from './LitigioPenalClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function LitigioPenalPage() {
  // Fetch from DB - NO FALLBACKS!
  const investigacionImages = await fetchLegalServiceImages('legal-penal', 'investigacion');
  const juicioImages = await fetchLegalServiceImages('legal-penal', 'juicio');
  const amparosImages = await fetchLegalServiceImages('legal-penal', 'amparos');
  const victimasImages = await fetchLegalServiceImages('legal-penal', 'victimas');

  return (
    <LitigioPenalClient
      investigacionImages={investigacionImages}
      juicioImages={juicioImages}
      amparosImages={amparosImages}
      victimasImages={victimasImages}
    />
  );
}