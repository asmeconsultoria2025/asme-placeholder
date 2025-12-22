// app/legal/amparos/AmparosClient.tsx
// ONLY CHANGES: Add interface, accept props, use props in amparoTypes array

'use client';

import { useEffect, useRef, useState } from 'react';
import AmparosChessBackground from '@/app/components/legal/AmparosChessBackground';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Scale, Shield, FileCheck, Clock, Building2, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// ← ADD THIS
interface AmparosClientProps {
  directoImages: string[];
  indirectoImages: string[];
}

// ← UPDATE THIS
export default function AmparosClient({
  directoImages,
  indirectoImages,
}: AmparosClientProps) {

  // ← ONLY CHANGE: Use props
  const amparoTypes = [
    {
      title: 'Amparo Directo',
      subtitle: 'Una Instancia Definitiva',
      description: 'Recurso legal para impugnar sentencias definitivas, laudos y resoluciones que pongan fin a un juicio. Se tramita directamente ante Tribunales Colegiados de Circuito.',
      Icon: Scale,
      features: [
        'Contra sentencias definitivas',
        'Tribunales Colegiados de Circuito',
        'Proceso de una sola instancia',
        'Resolución rápida y definitiva',
      ],
      proceedsAgainst: [
        'Sentencias que concluyen un juicio',
        'Laudos laborales definitivos',
        'Resoluciones de tribunales administrativos',
        'Decisiones judiciales finales',
      ],
      images: directoImages, // ← Changed
    },
    {
      title: 'Amparo Indirecto',
      subtitle: 'Protección Bi-Instancial',
      description: 'Medio de defensa contra actos de autoridad que no son sentencias definitivas pero que vulneran derechos fundamentales. Se presenta ante Juzgados de Distrito con posibilidad de revisión.',
      Icon: Shield,
      features: [
        'Contra actos de autoridad',
        'Juzgados de Distrito',
        'Doble instancia de revisión',
        'Protección preventiva',
      ],
      proceedsAgainst: [
        'Leyes que causan perjuicio',
        'Detenciones arbitrarias',
        'Actos de imposible reparación',
        'Órdenes sin fundamento legal',
      ],
      images: indirectoImages, // ← Changed
    },
  ];

  const advantages = [
    {
      icon: FileCheck,
      title: 'Estrategia Especializada',
      description: 'Análisis profundo del caso para determinar la vía correcta de amparo y maximizar las posibilidades de éxito.',
    },
    {
      icon: Clock,
      title: 'Gestión Eficiente',
      description: 'Manejo ágil de plazos y procedimientos para presentar su amparo en tiempo y forma.',
    },
    {
      icon: Building2,
      title: 'Experiencia Comprobada',
      description: 'Años de experiencia defendiendo derechos ante Juzgados de Distrito y Tribunales Colegiados.',
    },
  ];

  // REST OF YOUR CODE STAYS THE SAME
  function AmparoCard({ amparo, index }: { amparo: typeof amparoTypes[0], index: number }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      if (!amparo.images || amparo.images.length <= 1) return;

      const interval = setInterval(() => {
        if (!isHovered) {
          setCurrentImageIndex((prev) => 
            prev === amparo.images.length - 1 ? 0 : prev + 1
          );
        }
      }, 3000);

      return () => clearInterval(interval);
    }, [isHovered, amparo.images]);

    return (
      <motion.div
        initial={{ opacity: 0, x: index === 0 ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Card className="relative h-full border-0 bg-gradient-to-br from-gray-800/70 via-gray-900/50 to-gray-950/70 backdrop-blur-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <CardContent className="p-8 md:p-10 relative z-10">
            <div className="mb-6 inline-flex p-5 bg-white/10 rounded-2xl backdrop-blur-sm">
              <amparo.Icon className="h-12 w-12 text-white" />
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {amparo.title}
            </h3>
            <p className="text-lg text-gray-400 font-semibold mb-6">
              {amparo.subtitle}
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              {amparo.description}
            </p>

            {amparo.images && amparo.images.length > 0 && (
              <div 
                className="mb-8 relative h-48 rounded-lg overflow-hidden bg-black/40"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={amparo.images[currentImageIndex]}
                      alt={`${amparo.title} ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {amparo.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {amparo.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentImageIndex 
                            ? 'w-8 bg-white' 
                            : 'w-2 bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">
                Características Principales
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {amparo.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="h-2 w-2 rounded-full bg-white/60" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-white mb-4">
                Procede Contra
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {amparo.proceedsAgainst.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <Shield className="h-4 w-4 text-white/60 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    if (!headerRef.current) return;

    const text = headerRef.current.innerText.trim();
    const words = text.split(' ');

    headerRef.current.innerHTML = words
      .map((word) => `<span class="amparo-word inline-block mr-2">${word}</span>`)
      .join(' ');

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.onload = () => {
      const anime = (window as any).anime;
      anime({
        targets: '.amparo-word',
        opacity: [0, 1],
        translateY: ['2rem', '0rem'],
        easing: 'easeOutExpo',
        duration: 1000,
        delay: anime.stagger(80),
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="relative min-h-screen">
      <AmparosChessBackground />

      <div ref={containerRef} className="relative">
        <motion.section 
          className="relative overflow-hidden pt-32 pb-24 text-center"
          style={{ opacity, scale }}
        >
          <div className="relative mx-auto max-w-5xl px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-8 inline-block"
            >
              <Scale className="h-20 w-20 text-white/90 mx-auto" />
            </motion.div>

            <h1
              ref={headerRef}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight mb-8"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Juicio de Amparo: Su Escudo Constitucional
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Protegemos sus derechos fundamentales ante actos de autoridad mediante estrategia legal especializada en amparo directo e indirecto.
            </motion.p>
          </div>
        </motion.section>

        <section className="py-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Tipos de Amparo
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Cada situación requiere una estrategia específica. Conozca las diferencias entre amparo directo e indirecto para proteger sus derechos efectivamente.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {amparoTypes.map((amparo, index) => (
                <AmparoCard key={amparo.title} amparo={amparo} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                ¿Por Qué Confiar en Nosotros?
              </h2>
              <p className="text-xl text-gray-400">
                Experiencia y dedicación en cada movimiento legal
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={advantage.title}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="relative h-full border-0 bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-950/60 backdrop-blur-xl p-8 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="mb-6 inline-block p-4 bg-white/10 rounded-2xl">
                        <advantage.icon className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-950/60 backdrop-blur-xl p-12 md:p-16">
                <div className="text-center mb-12">
                  <Users className="h-16 w-16 text-white mx-auto mb-6" />
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    La Diferencia es Fundamental
                  </h2>
                  <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                    Elegir el tipo de amparo correcto es crucial: usar el amparo incorrecto puede significar perder la oportunidad de defenderse legalmente. En ASME Abogados analizamos su caso para determinar la vía procesal óptima.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Scale className="h-8 w-8" />
                      Cuándo Presentar Amparo Directo
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      El amparo directo procede contra sentencias definitivas, laudos y resoluciones que pongan fin a un juicio. Es la última defensa una vez agotados los recursos ordinarios en su proceso legal.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Shield className="h-8 w-8" />
                      Cuándo Presentar Amparo Indirecto
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      El amparo indirecto se utiliza para frenar o revisar actos que no concluyen un proceso legal, pero que pueden afectar derechos fundamentales, como detenciones arbitrarias u órdenes sin fundamento.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-12 md:p-16 text-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    ¿Sus Derechos Han Sido Vulnerados?
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    No espere más. El tiempo es crucial en materia de amparo. Contáctenos hoy para una evaluación de su caso sin compromiso.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100 text-lg px-10 py-7 font-bold"
                    >
                      <Link href="/legal/citas">
                        Solicitar Asesoría en Amparo
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}