// components/ServicesHighlight/index.tsx (Server Component wrapper)
import ServicesHighlightClient from './ServicesHighlightClient';
import { fetchServiceImages } from '@/app/lib/fetchServiceImages';

export async function ServicesHighlight() {
  // Fetch carousel images for each service card
  const consultoriaImages = await fetchServiceImages('seguridad-y-proteccion-civil');
  const capacitacionImages = await fetchServiceImages('formacion-de-brigadas');
  const legalImages = await fetchServiceImages('asesoria-y-defensa-legal');

  // Fallbacks - FIXED: removed /public/ prefix
  const defaultConsultoria = [
    "/images/CARD1_IMAGE1.jpeg",
    "/images/CARD1_IMAGE2.jpeg",
    "/images/CARD1_IMAGE3.jpeg", 
    "/images/CARD1_IMAGE4.jpeg",
  ];

  const defaultCapacitacion = [
    "/images/servicios/capacitacion1.jpeg",  
    "/images/servicios/capacitacion3.jpeg",
    "/images/capacitacion4.jpeg", 
    "/images/capacitacion2.jpeg",
  ];

  const defaultLegal = [
    "/images/CARD3_IMAGE_1.png",
    "/images/CARD3_IMAGE_2.jpeg",
    "/images/abogados/about2.jpeg",
  ];

  const serviceImages = {
    consultoria: consultoriaImages.length > 0 ? consultoriaImages : defaultConsultoria,
    capacitacion: capacitacionImages.length > 0 ? capacitacionImages : defaultCapacitacion,
    legal: legalImages.length > 0 ? legalImages : defaultLegal,
  };

  return <ServicesHighlightClient serviceImages={serviceImages} />;
}