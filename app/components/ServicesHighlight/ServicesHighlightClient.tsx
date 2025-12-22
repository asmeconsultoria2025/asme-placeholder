// components/ServicesHighlight/ServicesHighlightClient.tsx
'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaVestPatches } from "react-icons/fa6";
import { SiLichess } from "react-icons/si";
import { GiClick } from "react-icons/gi";
import { IoMedicalSharp } from "react-icons/io5";

interface ServiceImages {
  consultoria: string[];
  capacitacion: string[];
  legal: string[];
}

interface ServicesHighlightClientProps {
  serviceImages: ServiceImages;
}

export default function ServicesHighlightClient({ 
  serviceImages 
}: ServicesHighlightClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 3D Tilt handlers
  const handleCardTilt = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateX = ((y - midY) / midY) * -6;
    const rotateY = ((x - midX) / midX) * 6;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const resetTilt = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative isolate overflow-hidden pt-0 pb-20 sm:pb-28 -mt-10',
        'bg-gradient-to-b from-gray-950 via-black to-gray-950'
      )}
    >
      {/* Heading */}
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Profesionales que garantizan
          <span className="block text-red-500">
            cumplimiento, prevención y confianza.
          </span>
        </h2>

        <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Consultoría, capacitación y defensa legal con un enfoque integral en seguridad y
          protección civil. Diseñadas para fortalecer a organizaciones del sector público,
          privado y social.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3 perspective-[1000px] relative z-10">

        {/* CARD 1: Consultoría */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Link href="/servicios" className="block">
            <div
              onMouseMove={handleCardTilt}
              onMouseLeave={resetTilt}
              className="relative group transition-transform duration-300 ease-out cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Card
                className="bg-gray-900/90 backdrop-blur-sm overflow-hidden rounded-2xl border border-red-900/50 shadow-2xl transition-all duration-300 group-hover:shadow-red-900/30"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div style={{ transform: "translateZ(30px)" }}>
                  <EmblaCarousel images={serviceImages.consultoria} />
                </div>

                <CardHeader
                  className="flex flex-col items-center text-center gap-5 p-8"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <div className="p-4 rounded-full bg-red-900/50">
                    <IoMedicalSharp className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-semibold text-white">
                    Consultoría
                  </CardTitle>
                </CardHeader>

                <CardContent
                  className="p-8 pt-0 text-center"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <p className="text-base text-gray-300">
                    Asesoría especializada en cumplimiento, normativas y seguridad operativa.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Link>
        </motion.div>

        {/* CARD 2: Capacitación */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Link href="/servicios" className="block">
            <div
              onMouseMove={handleCardTilt}
              onMouseLeave={resetTilt}
              className="relative group transition-transform duration-300 ease-out cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card
                className="bg-gray-900/90 backdrop-blur-sm overflow-hidden rounded-2xl border border-red-900/50 shadow-2xl transition-all duration-300 group-hover:shadow-red-900/30"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div style={{ transform: "translateZ(30px)" }}>
                  <EmblaCarousel images={serviceImages.capacitacion} />
                </div>

                <CardHeader
                  className="flex flex-col items-center text-center gap-5 p-8"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <div className="p-4 rounded-full bg-red-900/50">
                    <FaVestPatches className="h-8 w-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-semibold text-white">
                    Capacitación
                  </CardTitle>
                </CardHeader>

                <CardContent
                  className="p-8 pt-0 text-center"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <p className="text-base text-gray-300">
                    Cursos y entrenamientos diseñados para elevar la preparación y respuesta.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Link>
        </motion.div>

        {/* CARD 3: Defensa Legal */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.35,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
        >
          <Link href="/legal" className="block">
            <div
              onMouseMove={handleCardTilt}
              onMouseLeave={resetTilt}
              className="relative group transition-transform duration-300 ease-out cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Card
                className="bg-gray-900/90 backdrop-blur-sm overflow-hidden rounded-2xl border border-red-900/50 shadow-2xl transition-all duration-300 group-hover:shadow-red-900/30"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div style={{ transform: "translateZ(30px)" }}>
                  <EmblaCarousel images={serviceImages.legal} />
                </div>

                <CardHeader
                  className="flex flex-col items-center text-center gap-5 p-8"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <div className="p-4 rounded-full bg-red-900/50">
                    <SiLichess className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-semibold text-white">
                    Defensa Legal
                  </CardTitle>
                </CardHeader>

                <CardContent
                  className="p-8 pt-0 text-center"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <p className="text-base text-gray-300">
                    Acompañamiento jurídico en materia administrativa, penal y de protección civil.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center relative z-20 pointer-events-auto">
        <Button
          asChild
          size="lg"
          className="bg-red-800 text-white border-red-700 hover:bg-red-700 hover:border-red-600 shadow-xl"
        >
          <Link href="/servicios">
            Ver Todos los Servicios
            <GiClick className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Accreditation */}
      <div className="mt-20 text-center">
        <h3 className="text-2xl md:text-5xl font-bold mb-10 text-white">
          Constancias con <span className="text-red-500">validez oficial</span>
        </h3>

        <div className="flex justify-center items-center gap-6 md:gap-10">
          <img
            src="/images/testimonialslogo2.png"
            alt="Protección Civil"
            className="h-32 md:h-48 w-auto object-contain translate-y-1 transition-all duration-500 hover:scale-105 filter brightness-90"
          />

          <img
            src="/images/testimonialslogo1.png"
            alt="STPS"
            className="h-36 md:h-48 w-auto object-contain z-10 scale-110 md:scale-125 drop-shadow-2xl -translate-y-2 transition-all duration-500 hover:scale-120"
          />

        </div>
      </div>
    </section>
  );
}

/* Embla Carousel Component */
function EmblaCarousel({ images }: { images: string[] }) {
  const autoplay = Autoplay({
    delay: 3500,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  });

  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay]);

  return (
    <div className="embla overflow-hidden rounded-t-2xl" ref={emblaRef}>
      <div className="embla__container flex">
        {images.map((src, i) => (
          <div key={i} className="embla__slide flex-[0_0_100%] relative aspect-video">
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="object-cover w-full h-full brightness-75"
            />
          </div>
        ))}
      </div>
    </div>
  );
}