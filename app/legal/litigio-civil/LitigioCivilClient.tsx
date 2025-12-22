// app/legal/litigio-civil/LitigioCivilClient.tsx
// ONLY CHANGES: Add interface, accept props, use props in civilLitigation array

'use client';

import { useEffect, useRef, useState } from 'react';
import CivilChessBackground from '@/app/components/legal/CivilChessBackground';
import { Button } from 'app/components/ui/button';
import { Card, CardContent } from 'app/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Scale, FileText, Home, HandCoins, Users, Building2, ShieldCheck, Briefcase } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// ← ADD THIS
interface LitigioCivilClientProps {
  contractualesImages: string[];
  inmobiliariasImages: string[];
  cobranzaImages: string[];
  societariasImages: string[];
  responsabilidadImages: string[];
  sucesorioImages: string[];
}

// ← UPDATE THIS
export default function LitigioCivilClient({
  contractualesImages,
  inmobiliariasImages,
  cobranzaImages,
  societariasImages,
  responsabilidadImages,
  sucesorioImages,
}: LitigioCivilClientProps) {

  // ← ONLY CHANGE: Use props
  const civilLitigation = [
    {
      title: 'Conflictos Contractuales',
      description: 'Representación especializada en disputas sobre incumplimiento, interpretación y terminación de contratos civiles y mercantiles.',
      Icon: FileText,
      cases: [
        'Incumplimiento de contratos',
        'Rescisión contractual',
        'Interpretación de cláusulas',
        'Daños y perjuicios',
      ],
      images: contractualesImages, // ← Changed
    },
    {
      title: 'Controversias Inmobiliarias',
      description: 'Defensa de derechos de propiedad, arrendamiento y posesión. Litigios sobre compraventa, escrituración y desalojos.',
      Icon: Home,
      cases: [
        'Juicios reivindicatorios',
        'Desalojos y arrendamiento',
        'Usucapión (prescripción adquisitiva)',
        'Nulidad de escrituras',
      ],
      images: inmobiliariasImages, // ← Changed
    },
    {
      title: 'Cobranza Judicial',
      description: 'Recuperación efectiva de adeudos mediante juicios ejecutivos mercantiles y civiles, con estrategias de embargo y ejecución.',
      Icon: HandCoins,
      cases: [
        'Juicios ejecutivos',
        'Cobranza de pagarés',
        'Recuperación de cartera',
        'Ejecución de garantías',
      ],
      images: cobranzaImages, // ← Changed
    },
    {
      title: 'Disputas Societarias',
      description: 'Resolución de conflictos entre socios, impugnación de acuerdos corporativos y protección de derechos de accionistas.',
      Icon: Users,
      cases: [
        'Conflictos entre socios',
        'Impugnación de asambleas',
        'Disolución de sociedades',
        'Rendición de cuentas',
      ],
      images: societariasImages, // ← Changed
    },
    {
      title: 'Responsabilidad Civil',
      description: 'Reclamación y defensa en casos de daños patrimoniales y morales derivados de actos ilícitos o incumplimientos.',
      Icon: ShieldCheck,
      cases: [
        'Daño moral',
        'Accidentes de tránsito',
        'Responsabilidad profesional',
        'Actos ilícitos',
      ],
      images: responsabilidadImages, // ← Changed
    },
    {
      title: 'Derecho Sucesorio',
      description: 'Asesoría y litigio en herencias, testamentos, juicios sucesorios intestamentarios y controversias familiares patrimoniales.',
      Icon: Building2,
      cases: [
        'Sucesiones testamentarias',
        'Juicios intestados',
        'Nulidad de testamentos',
        'Partición de herencias',
      ],
      images: sucesorioImages, // ← Changed
    },
  ];

  const processSteps = [
    {
      icon: Scale,
      title: 'Análisis Estratégico',
      description: 'Evaluación detallada de su caso para determinar la mejor vía procesal y construir una estrategia sólida.',
    },
    {
      icon: FileText,
      title: 'Demanda Fundamentada',
      description: 'Elaboración de demandas con fundamentos jurídicos robustos y evidencia contundente.',
    },
    {
      icon: Briefcase,
      title: 'Litigio Profesional',
      description: 'Representación experta en todas las etapas procesales hasta obtener la resolución favorable.',
    },
  ];

  // REST OF YOUR CODE STAYS THE SAME
  function CivilCard({ area, index }: { area: typeof civilLitigation[0], index: number }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      if (!area.images || area.images.length <= 1) return;

      const interval = setInterval(() => {
        if (!isHovered) {
          setCurrentImageIndex((prev) => 
            prev === area.images.length - 1 ? 0 : prev + 1
          );
        }
      }, 3000);

      return () => clearInterval(interval);
    }, [isHovered, area.images]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -10 }}
      >
        <Card className="relative h-full border-0 bg-gradient-to-br from-gray-800/70 via-gray-900/50 to-gray-950/70 backdrop-blur-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardContent className="p-8 relative z-10">
            <div className="mb-6 inline-flex p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <area.Icon className="h-10 w-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">
              {area.title}
            </h3>

            <p className="text-gray-300 leading-relaxed mb-6">
              {area.description}
            </p>

            {area.images && area.images.length > 0 && (
              <div 
                className="mb-6 relative h-48 rounded-lg overflow-hidden bg-black/40"
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
                      src={area.images[currentImageIndex]}
                      alt={`${area.title} ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {area.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {area.images.map((_, idx) => (
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

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Casos Típicos
              </h4>
              {area.cases.map((caseType, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  <span className="text-sm">{caseType}</span>
                </motion.div>
              ))}
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
      .map((word) => `<span class="civil-word inline-block mr-2">${word}</span>`)
      .join(' ');

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.onload = () => {
      const anime = (window as any).anime;
      anime({
        targets: '.civil-word',
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
      <CivilChessBackground />

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
              Litigio Civil Estratégico
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Defendemos sus derechos patrimoniales y personales con experiencia comprobada en controversias civiles, mercantiles y sucesorias.
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
                Áreas de Litigio Civil
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Experiencia especializada en las controversias civiles más complejas ante los tribunales de Tijuana y Baja California.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {civilLitigation.map((area, index) => (
                <CivilCard key={area.title} area={area} index={index} />
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
                Nuestro Proceso
              </h2>
              <p className="text-xl text-gray-400">
                Metodología probada para resultados efectivos
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="relative h-full border-0 bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-950/60 backdrop-blur-xl p-8 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="mb-6 inline-block p-4 bg-white/10 rounded-2xl">
                        <step.icon className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {step.description}
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
                  <ShieldCheck className="h-16 w-16 text-white mx-auto mb-6" />
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    ¿Por Qué Elegir ASME en Litigio Civil?
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Experiencia Comprobada
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Años de práctica exitosa en litigio civil ante juzgados y tribunales de Baja California, con historial de sentencias favorables.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Estrategia Personalizada
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Cada caso es único. Analizamos a fondo su situación para diseñar la estrategia procesal más efectiva según sus objetivos.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Representación Integral
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Desde la demanda inicial hasta la ejecución de sentencia, estamos con usted en cada etapa del proceso judicial.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Comunicación Constante
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Mantenemos informado sobre cada desarrollo de su caso, explicando las opciones legales en términos claros.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-4 pb-32">
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
                    ¿Enfrenta un Conflicto Civil o Mercantil?
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    No permita que un litigio mal manejado afecte su patrimonio. Contacte a ASME Abogados para una evaluación profesional de su caso.
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
                      <Link href="/contacto?service=legal-civil">
                        Solicitar Asesoría Legal
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