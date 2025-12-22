// app/legal/litigio-penal/page.tsx
import LitigioPenalClient from './LitigioPenalClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function LitigioPenalPage() {
  // Fetch from DB
  const investigacionDB = await fetchLegalServiceImages('legal-penal', 'investigacion');
  const juicioDB = await fetchLegalServiceImages('legal-penal', 'juicio');
  const amparosDB = await fetchLegalServiceImages('legal-penal', 'amparos');
  const victimasDB = await fetchLegalServiceImages('legal-penal', 'victimas');

  // Fallbacks
  const investigacionFallback = ['/images/abogados/penal1.jpeg', '/images/abogados/penal2.jpeg', '/images/abogados/penal3.jpeg'];
  const juicioFallback = [];
  const amparosFallback = [];
  const victimasFallback = [];

  // Choose
  const investigacionImages = investigacionDB.length > 0 ? investigacionDB : investigacionFallback;
  const juicioImages = juicioDB.length > 0 ? juicioDB : juicioFallback;
  const amparosImages = amparosDB.length > 0 ? amparosDB : amparosFallback;
  const victimasImages = victimasDB.length > 0 ? victimasDB : victimasFallback;

  return (
    <LitigioPenalClient
      investigacionImages={investigacionImages}
      juicioImages={juicioImages}
      amparosImages={amparosImages}
      victimasImages={victimasImages}
    />
  );
}