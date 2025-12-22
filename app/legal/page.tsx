'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { LEGAL_SERVICES } from '@/app/lib/constants';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import LegalChessBackground from '@/app/components/legal/LegalChessBackground';

export default function LegalHomePage() {
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  // Anime.js word-level split animation
  useEffect(() => {
    if (!headerRef.current) return;

    const text = headerRef.current.innerText.trim();
    const words = text.split(' ');

    headerRef.current.innerHTML = words
      .map(
        (word) =>
          `<span class="legal-word inline-block mr-2">${word}</span>`
      )
      .join(' ');

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.onload = () => {
      const anime = (window as any).anime;
      anime({
        targets: '.legal-word',
        opacity: [0, 1],
        translateY: ['1rem', '0rem'],
        easing: 'easeOutExpo',
        duration: 900,
        delay: anime.stagger(100),
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* 3D chessboard as background */}
      <LegalChessBackground />

      {/* All content above background */}
      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-24 text-center sm:pt-20 sm:pb-32">
          <div className="relative mx-auto max-w-4xl px-4">
            <motion.h1
              ref={headerRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-bold tracking-tight text-stone-300 md:text-6xl lg:text-8xl"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Jaque Mate a sus Problemas Legales
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-lg font-semibold text-stone-200 md:text-xl"
            >
              La estrategia correcta gana el juego. En ASME Abogados, combinamos
              experiencia y táctica para ofrecerle la mejor defensa y asesoría en
              Tijuana.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-black transition-all duration-300 hover:bg-black hover:text-white"
              >
                <Link href="/legal/citas">Agenda una Cita</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* PRACTICE AREAS SECTION */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-stone-300 md:text-4xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Nuestras Áreas de Práctica
              </h2>
              <p className="mt-4 text-lg font-semibold text-stone-200">
                Movimientos precisos en cada área del derecho para asegurar su
                victoria.
              </p>
            </motion.div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {LEGAL_SERVICES.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="group relative h-full border-0 bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-gray-950/80 text-gray-100 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {/* Animated accent border */}
                    <div className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-white/30 transition-all duration-500" />
                    
                    {/* Gradient shine effect */}
                    <div className="absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="rounded-full bg-gray-700/40 p-3 text-white group-hover:text-gray-100 transition-colors">
                        <service.Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-gray-100 transition-colors">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col">
                      <p className="flex-1 text-gray-300">
                        {service.description}
                      </p>
                      <Link
                        href={service.href}
                        className="mt-4 font-semibold text-gray-200 flex items-center group-hover:underline"
                      >
                        Saber más{' '}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-0 bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-gray-950/80 p-8 backdrop-blur-xl md:p-12">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <h3 className="text-3xl font-bold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    ¿Por Qué Elegir ASME Abogados?
                  </h3>
                  <p className="mt-4 text-gray-300">
                    En el complejo tablero legal, cada movimiento cuenta. Nuestro
                    equipo de abogados en Tijuana no solo conoce las reglas, las
                    domina. Le ofrecemos:
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-gray-300" />
                      <div>
                        <h4 className="font-semibold text-white">
                          Defensa Estratégica
                        </h4>
                        <p className="text-gray-300">
                          Analizamos cada caso para diseñar una defensa sólida y
                          anticiparnos a los movimientos de la contraparte.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-gray-300" />
                      <div>
                        <h4 className="font-semibold text-white">
                          Experiencia Comprobada
                        </h4>
                        <p className="text-gray-300">
                          Años de experiencia en litigios complejos y trámites
                          gubernamentales respaldan nuestros resultados.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-gray-300" />
                      <div>
                        <h4 className="font-semibold text-white">
                          Comunicación Directa
                        </h4>
                        <p className="text-gray-300">
                          Mantenemos una línea abierta y transparente, explicando
                          cada paso del proceso para que siempre esté informado.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Image circle */}
                <motion.div
                  className="relative flex h-96 w-80 flex-col items-center justify-center ml-auto text-center transition-all overflow-hidden"
                 
                >
                  <Image
                    src="/images/CARD3_IMAGE_2.JPEG"
                    alt="Nuestras Victorias"
                    fill
                    className="object-cover opacity-05"
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
}