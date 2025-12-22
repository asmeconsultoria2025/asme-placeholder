// app/legal/litigio-civil/page.tsx
import LitigioCivilClient from './LitigioCivilClient';
import { fetchLegalServiceImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60;

export default async function LitigioCivilPage() {
  // Fetch from DB (6 areas)
  const contractualesDB = await fetchLegalServiceImages('legal-civil', 'contractuales');
  const inmobiliariasDB = await fetchLegalServiceImages('legal-civil', 'inmobiliarias');
  const cobranzaDB = await fetchLegalServiceImages('legal-civil', 'cobranza');
  const societariasDB = await fetchLegalServiceImages('legal-civil', 'societarias');
  const responsabilidadDB = await fetchLegalServiceImages('legal-civil', 'responsabilidad');
  const sucesorioDB = await fetchLegalServiceImages('legal-civil', 'sucesorio');

  // Fallbacks (empty arrays - you can add your images here)
  const contractualesFallback = [];
  const inmobiliariasFallback = [];
  const cobranzaFallback = [];
  const societariasFallback = [];
  const responsabilidadFallback = [];
  const sucesorioFallback = [];

  // Choose
  const contractualesImages = contractualesDB.length > 0 ? contractualesDB : contractualesFallback;
  const inmobiliariasImages = inmobiliariasDB.length > 0 ? inmobiliariasDB : inmobiliariasFallback;
  const cobranzaImages = cobranzaDB.length > 0 ? cobranzaDB : cobranzaFallback;
  const societariasImages = societariasDB.length > 0 ? societariasDB : societariasFallback;
  const responsabilidadImages = responsabilidadDB.length > 0 ? responsabilidadDB : responsabilidadFallback;
  const sucesorioImages = sucesorioDB.length > 0 ? sucesorioDB : sucesorioFallback;

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