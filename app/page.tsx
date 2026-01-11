import { Hero } from 'app/components/home/Hero';
import { ServicesHighlight } from '@/app/components/ServicesHighlight/ServicesHighlight';
import { Testimonials } from 'app/components/home/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesHighlight />
      <Testimonials />
    </>
  );
}
