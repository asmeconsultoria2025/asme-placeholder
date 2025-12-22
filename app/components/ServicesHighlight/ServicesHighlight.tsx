// components/ServicesHighlight/index.tsx (Server Component wrapper)
import ServicesHighlightClient from './ServicesHighlightClient';
import { fetchServiceImages } from '@/app/lib/fetchServiceImages';

export async function ServicesHighlight() {
  // Fetch carousel images for each service card
  const consultoriaImages = await fetchServiceImages('seguridad-y-proteccion-civil');
  const capacitacionImages = await fetchServiceImages('formacion-de-brigadas');
  const legalImages = await fetchServiceImages('asesoria-y-defensa-legal');

  // Fallbacks
  const defaultConsultoria = [
    "/public/images/CARD1_IMAGE1.jpeg",
    "/public/images/CARD1_IMAGE2.jpeg",
    "/public/images/CARD1_IMAGE3.jpeg", 
    "/public/images/CARD1_IMAGE4.jpeg",
  ];

  const defaultCapacitacion = [
    "/public/images/servicios/capacitacion1.jpeg",  
    "/public/images/servicios/capacitacion3.jpeg",
    "/public/images/capacitacion4.jpeg", 
    "/public/images/capacitacion2.jpeg",
  ];

  const defaultLegal = [
    "/public/images/CARD3_IMAGE_1.png",
    "/public/images/CARD3_IMAGE_2.jpeg",
    "/public/images/CARD3_IMAGE_3.PNG",
  ];

  const serviceImages = {
    consultoria: consultoriaImages.length > 0 ? consultoriaImages : defaultConsultoria,
    capacitacion: capacitacionImages.length > 0 ? capacitacionImages : defaultCapacitacion,
    legal: legalImages.length > 0 ? legalImages : defaultLegal,
  };

  return <ServicesHighlightClient serviceImages={serviceImages} />;
}