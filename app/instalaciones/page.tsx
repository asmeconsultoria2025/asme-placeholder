// app/instalaciones/page.tsx
import TrainingFacilityClient from './TrainingFacilityClient';
import { fetchGalleryImages } from '@/app/lib/fetchServiceImages';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function TrainingFacilityPage() {
  // Fetch gallery images from database
  const dbImages = await fetchGalleryImages('instalaciones', 'main');
  
  // Fallback to hardcoded images if database is empty
  const fallbackImages = [
    '/images/facility/facility2.jpeg',
    '/images/facility/facility3.jpeg',
    '/images/facility/facility4.jpeg',
    '/images/facility/facility6.jpeg',
    '/images/facility/facility7.jpeg',
    '/images/facility/facility8.jpeg',
    '/images/facility/facility9.jpeg',
    '/images/facility/facility10.jpeg',
    '/images/facility/facility11.jpeg',
    '/images/facility/facility12.jpeg',
    '/images/facility/facility13.jpeg',
    '/images/facility/facility14.jpeg',
  ];

  const galleryImages = dbImages.length > 0 ? dbImages : fallbackImages;

  return <TrainingFacilityClient galleryImages={galleryImages} />;
}