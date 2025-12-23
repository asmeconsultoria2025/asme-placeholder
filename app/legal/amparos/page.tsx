import LegalServiceClient from '../LegalServiceClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function AmparosPage() {
  const directoImages = await fetchLegalServiceImages('legal-amparos', 'directo');
  const indirectoImages = await fetchLegalServiceImages('legal-amparos', 'indirecto');

  return (
    <LegalServiceClient
      pageTitle="Amparos"
      pageDescription="Juicio de amparo en todas sus modalidades"
      sections={[
        {
          title: "Amparo Directo",
          description: "Amparo directo ante tribunales colegiados para impugnar sentencias definitivas, laudos y resoluciones que pongan fin al juicio.",
          image: directoImages[0] || '',
        },
        {
          title: "Amparo Indirecto",
          description: "Amparo indirecto ante juzgados de distrito contra actos de autoridad que violen garantías individuales.",
          image: indirectoImages[0] || '',
        },
      ]}
    />
  );
}