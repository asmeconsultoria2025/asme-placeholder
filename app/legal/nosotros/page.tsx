'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import AboutChessBackground from '@/app/components/legal/AboutChessBackground';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Shield, Scale, Users } from 'lucide-react';

export default function AboutUsPage() {
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    if (!headerRef.current) return;

    const text = headerRef.current.innerText.trim();
    const words = text.split(' ');

    headerRef.current.innerHTML = words
      .map((word) => `<span class="about-word inline-block mr-2">${word}</span>`)
      .join(' ');

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.onload = () => {
      const anime = (window as any).anime;
      anime({
        targets: '.about-word',
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
      {/* 3D Chess Background - forward drift with upward tilt */}
      <AboutChessBackground />

      <div ref={containerRef} className="relative">
        {/* HERO SECTION */}
        <motion.section 
          className="relative overflow-hidden pt-32 pb-24 text-center"
          style={{ opacity, scale }}
        >
          <div className="relative mx-auto max-w-5xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-block px-6 py-2 text-sm font-semibold text-white/80 border border-white/20 rounded-full backdrop-blur-sm">
                Sobre Nosotros
              </span>
            </motion.div>

            <h1
              ref={headerRef}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight mb-8"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Defendiendo sus Derechos con Estrategia y Experiencia
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              En ASME Abogados, no solo representamos casos, construimos victorias a través de estrategia legal meticulosa y dedicación inquebrantable.
            </motion.p>
          </div>
        </motion.section>

        {/* VALUES SECTION */}
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
                Nuestros Valores
              </h2>
              <p className="text-xl text-gray-400">
                Los principios que guían cada movimiento en el tablero legal
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Integridad',
                  description: 'Actuamos con transparencia y honestidad en cada caso, manteniendo los más altos estándares éticos de la profesión legal.',
                },
                {
                  icon: Scale,
                  title: 'Excelencia',
                  description: 'Cada caso recibe nuestra máxima atención y conocimiento especializado para lograr los mejores resultados posibles.',
                },
                {
                  icon: Users,
                  title: 'Compromiso',
                  description: 'Estamos dedicados a sus intereses, disponibles cuando nos necesita y comprometidos con su éxito legal.',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
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
                        <value.icon className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {value.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
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
                Nuestro Equipo Legal
              </h2>
              <p className="text-xl text-gray-400">
                Profesionales comprometidos con su éxito
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {[
                {
                  image: '/images/staff_1.jpeg',
                  name: 'Lic. Ruben Jimenez',
                  title: 'Socio Fundador',
                  description: 'Especialistas en defensa de madres contra violencia vicaria y falsas acusaciones en custodia.',
                },
                {
                  image: '/images/staff_2.jpeg',
                  name: 'Lic. Kathia Aime Hernandez León',
                  description: 'Lic. Kathia Aime Hernández Leon es licenciada en derecho por la Universidad Autónoma de Baja California, cuenta con maestría en derecho penal y se especializa en juicios de índole familiar en donde las personas vulnerables como mujeres, niños y niñas, necesitan una defensa adecuada y un acompañamiento humano, ofreciendo una defensa en la vía penal y en la vía familiar.Especialista en violencia vicaria y violencia de género.',
                },
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: index === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="relative border-0 bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-950/60 backdrop-blur-xl overflow-hidden group">
                    <div className="relative h-96 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="h-full w-full"
                      >
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                      </motion.div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {member.name}
                      </h3>
                      {member.title && (
                        <p className="text-lg text-gray-400 mb-4 font-semibold">
                          {member.title}
                        </p>
                      )}
                      <p className="text-gray-300 leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-950/60 backdrop-blur-xl p-12 md:p-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                      Experiencia que Marca la Diferencia
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed mb-8">
                      Con más de dos décadas de experiencia combinada, nuestro equipo ha manejado exitosamente cientos de casos en Tijuana y toda la región de Baja California.
                    </p>
                    <div className="space-y-6">
                      {[
                        { number: '500+', label: 'Casos Ganados' },
                        { number: '20+', label: 'Años de Experiencia' },
                        { number: '98%', label: 'Satisfacción de Clientes' },
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-baseline gap-4"
                        >
                          <span className="text-5xl font-bold text-white">
                            {stat.number}
                          </span>
                          <span className="text-xl text-gray-400">
                            {stat.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative h-96 rounded-2xl overflow-hidden"
                  >
                    <Image
                      src="/images/abogados/about3.jpeg"
                      alt="Nuestro equipo"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-12 md:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  ¿Listo para Dar el Siguiente Paso?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Permítanos poner nuestra experiencia y dedicación a trabajar para usted. Contacte a ASME Abogados hoy mismo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6"
                  >
                    <Link href="/legal/citas" className="flex items-center gap-2">
                      Agendar Consulta
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
                  >
                    <Link href="/contacto">
                      Contactar
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}