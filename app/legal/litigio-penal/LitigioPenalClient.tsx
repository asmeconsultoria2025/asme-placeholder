// app/legal/litigio-penal/LitigioPenalClient.tsx
// ONLY CHANGES: Add interface, accept props, use props in services array

'use client';

import PenalChessBackground from '@/app/components/legal/PenalChessBackground';
import { Button } from 'app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'app/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { GiHandcuffed, GiPublicSpeaker, GiPrisoner, GiInjustice } from "react-icons/gi";
import { FaUserSecret } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';

// ← ADD THIS
interface LitigioPenalClientProps {
  investigacionImages: string[];
  juicioImages: string[];
  amparosImages: string[];
  victimasImages: string[];
}

// ← UPDATE THIS
export default function LitigioPenalClient({
  investigacionImages,
  juicioImages,
  amparosImages,
  victimasImages,
}: LitigioPenalClientProps) {

  // ← ONLY CHANGE: Use props instead of hardcoded
  const services = [
    {
      title: 'Defensa en Etapa de Investigación',
      description: 'Asistencia legal desde el primer momento. Protegemos sus derechos y construimos una defensa sólida desde el inicio.',
      Icon: FaUserSecret,
      images: investigacionImages, // ← Changed
    },
    {
      title: 'Representación en Juicio Oral',
      description: 'Litigación experta ante los tribunales, con argumentación persuasiva y manejo estratégico de la prueba.',
      Icon: GiPublicSpeaker,
      images: juicioImages, // ← Changed
    },
    {
      title: 'Amparos en Materia Penal',
      description: 'Interposición de juicios de amparo contra actos de autoridad que vulneren sus garantías fundamentales.',
      Icon: GiPrisoner,
      images: amparosImages, // ← Changed
    },
    {
      title: 'Asesoría a Víctimas y Ofendidos',
      description: 'Representamos a víctimas para asegurar la reparación del daño y que se haga justicia.',
      Icon: GiInjustice,
      images: victimasImages, // ← Changed
    },
  ];

  // REST OF YOUR CODE STAYS THE SAME
  function ServiceCard({ service, index }: { service: typeof services[0], index: number }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      if (!service.images || service.images.length <= 1) return;

      const interval = setInterval(() => {
        if (!isHovered) {
          setCurrentImageIndex((prev) => 
            prev === service.images.length - 1 ? 0 : prev + 1
          );
        }
      }, 3000);

      return () => clearInterval(interval);
    }, [isHovered, service.images]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        whileHover={{ y: -8, scale: 1.02 }}
      >
        <Card className="group relative h-full border-0 bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-gray-950/80 text-gray-100 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-white/30 transition-all duration-500" />
          <div className="absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <CardHeader className="flex flex-row items-center gap-4">
            <div className="relative flex items-center justify-center">
              <span className="absolute h-12 w-12 rounded-full bg-white opacity-25 blur-md" />
              <div className="relative z-[1] rounded-full bg-gray-700/40 p-3 text-white flex items-center justify-center group-hover:text-gray-100 transition-colors">
                <service.Icon className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-xl text-white group-hover:text-gray-100 transition-colors">
              {service.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col">
            <p className="flex-1 text-gray-300">{service.description}</p>

            {service.images && service.images.length > 0 && (
              <div 
                className="mt-6 relative h-64 rounded-lg overflow-hidden bg-black/40"
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
                      src={service.images[currentImageIndex]}
                      alt={`${service.title} ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {service.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {service.images.map((_, idx) => (
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
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <PenalChessBackground />

      <motion.div
        className="py-16 sm:py-24 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          duration: 0.8,
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <GiHandcuffed className="mx-auto h-16 w-16 text-gray-300" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-4 text-4xl font-bold tracking-tight text-white md:text-8xl"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Defensa Penal: Su Mejor Movimiento
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-4 text-lg text-gray-300"
            >
              Frente al sistema de justicia penal, cada acción cuenta. Le ofrecemos una defensa técnica, estratégica e implacable para proteger su libertad.
            </motion.p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <motion.p
              className="text-7xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              ¿Acusado de un delito? No espere más.
            </motion.p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
            >
              <Button
                asChild
                size="lg"
                className="mt-4 bg-white text-black transition-all duration-300 hover:bg-gray-200"
              >
                <Link href="/contacto?service=legal-penal">
                  Consulta Urgente 24/7
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}