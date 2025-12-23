// app/legal/amparos/page.tsx
import AmparosClient from './AmparosClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function AmparosPage() {
  // Fetch from DB - NO FALLBACKS!
  const directoImages = await fetchLegalServiceImages('legal-amparos', 'directo');
  const indirectoImages = await fetchLegalServiceImages('legal-amparos', 'indirecto');

  return (
    <AmparosClient
      directoImages={directoImages}
      indirectoImages={indirectoImages}
    />
  );
}