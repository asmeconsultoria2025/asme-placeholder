// app/legal/litigio-familiar/page.tsx
import LitigioFamiliarClient from './LitigioFamiliarClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function LitigioFamiliarPage() {
  // Fetch from DB - NO FALLBACKS!
  const divorciosImages = await fetchLegalServiceImages('legal-familiar', 'divorcios');
  const pensionImages = await fetchLegalServiceImages('legal-familiar', 'pension');
  const custodiaImages = await fetchLegalServiceImages('legal-familiar', 'custodia');
  const vicariaImages = await fetchLegalServiceImages('legal-familiar', 'vicaria');

  return (
    <LitigioFamiliarClient
      divorciosImages={divorciosImages}
      pensionImages={pensionImages}
      custodiaImages={custodiaImages}
      vicariaImages={vicariaImages}
    />
  );
}