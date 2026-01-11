import { Hero } from 'app/components/home/Hero';
import { ServicesHighlight } from '@/app/components/ServicesHighlight/ServicesHighlight';
import { Testimonials } from 'app/components/home/Testimonials';
import { AuthHashHandler } from '@/app/components/auth/AuthHashHandler';

export default function Home() {
  return (
    <>
      <AuthHashHandler />
      <Hero />
      <ServicesHighlight />
      <Testimonials />
    </>
  );
}
