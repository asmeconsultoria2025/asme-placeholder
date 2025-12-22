// app/legal/litigio-familiar/page.tsx
// SAME PATTERN as instalaciones and nosotros pages

import LitigioFamiliarClient from './LitigioFamiliarClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function LitigioFamiliarPage() {
  // Fetch from DB for each service
  const divorciosDB = await fetchLegalServiceImages('legal-familiar', 'divorcios');
  const pensionDB = await fetchLegalServiceImages('legal-familiar', 'pension');
  const custodiaDB = await fetchLegalServiceImages('legal-familiar', 'custodia');
  const vicariaDB = await fetchLegalServiceImages('legal-familiar', 'vicaria');

  // Fallbacks (your hardcoded images)
  const divorciosFallback = [
    '/images/abogados/divorcios1.jpeg',
    '/images/abogados/divorcios2.jpeg',
    '/images/abogados/divorcios3.jpeg'
  ];
  const pensionFallback = [
    '/images/abogados/pension1.jpeg',
    '/images/abogados/pension2.jpeg',
    '/images/abogados/pension3.jpeg'
  ];
  const custodiaFallback = [
    '/images/abogados/custodia1.jpeg',
    '/images/abogados/custodia2.jpeg',
    '/images/abogados/custodia3.jpeg'
  ];
  const vicariaFallback = [
    '/images/abogados/familiar.jpeg',
    '/images/abogados/familiar2.jpeg',
    '/images/abogados/familiar3.jpeg',
    '/images/abogados/familiar1.jpeg'
  ];

  // Use DB if available, otherwise use fallback
  const divorciosImages = divorciosDB.length > 0 ? divorciosDB : divorciosFallback;
  const pensionImages = pensionDB.length > 0 ? pensionDB : pensionFallback;
  const custodiaImages = custodiaDB.length > 0 ? custodiaDB : custodiaFallback;
  const vicariaImages = vicariaDB.length > 0 ? vicariaDB : vicariaFallback;

  return (
    <LitigioFamiliarClient
      divorciosImages={divorciosImages}
      pensionImages={pensionImages}
      custodiaImages={custodiaImages}
      vicariaImages={vicariaImages}
    />
  );
}