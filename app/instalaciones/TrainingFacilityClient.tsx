// app/instalaciones/TrainingFacilityClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { GiClick } from "react-icons/gi";

// Shuffle function (Fisher-Yates)
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface TrainingFacilityClientProps {
  galleryImages: string[];
}

export default function TrainingFacilityClient({ 
  galleryImages 
}: TrainingFacilityClientProps) {
  const [orderedImages, setOrderedImages] = useState(galleryImages);

  // Auto-shuffle every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderedImages((current) => shuffle(current));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const spring = {
    type: 'spring' as const,
    damping: 25,
    stiffness: 300,
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Subtle ASME background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950 pointer-events-none"
      />

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-20 md:pt-24 text-center z-10 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <h1 className="font-headline text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight">
              Explora Nuestras
              <span className="block text-red-500">Instalaciones</span>
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
              Espacios diseñados para transformar el conocimiento en habilidades prácticas y seguras.
            </p>
          </motion.div>

          {/* Reordering Image Grid */}
          <div className="relative max-w-6xl mx-auto">
            <motion.ul
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              <AnimatePresence mode="popLayout">
                {orderedImages.map((src) => (
                  <motion.li
                    key={src}
                    layout
                    transition={spring}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.08, zIndex: 10 }}
                    className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
                  >
                    <Image
                      src={src}
                      alt="Instalaciones de capacitación ASME"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                      priority
                    />

                    {/* Subtle dark overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20 md:py-32 bg-gradient-to-t from-gray-950 via-black to-gray-950">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight font-headline">
              Agenda tu <span className="text-red-500">Cita Hoy</span>
            </h2>
            <p className="text-xl md:text-2xl text-white leading-relaxed">
              Ven a conocer nuestras instalaciones y descubre cómo podemos fortalecer la cultura de seguridad en tu equipo.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-red-500 text-white hover:bg-red-800 font-semibold px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <a href="/contacto" className="flex items-center gap-3">
                Agendar Cita <GiClick className="h-6 w-6" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}