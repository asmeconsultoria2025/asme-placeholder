// app/legal/amparos/page.tsx
import AmparosClient from './AmparosClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function AmparosPage() {
  // Fetch from DB (2 types)
  const directoDB = await fetchLegalServiceImages('legal-amparos', 'directo');
  const indirectoDB = await fetchLegalServiceImages('legal-amparos', 'indirecto');

  // Fallbacks (empty arrays - you can add your images here)
  const directoFallback = [];
  const indirectoFallback = [];

  // Choose
  const directoImages = directoDB.length > 0 ? directoDB : directoFallback;
  const indirectoImages = indirectoDB.length > 0 ? indirectoDB : indirectoFallback;

  return (
    <AmparosClient
      directoImages={directoImages}
      indirectoImages={indirectoImages}
    />
  );
}