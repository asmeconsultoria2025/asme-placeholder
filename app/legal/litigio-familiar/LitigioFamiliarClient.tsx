// app/legal/litigio-familiar/LitigioFamiliarClient.tsx
// MINIMAL CHANGES - Just accept images as props

'use client';

import FamilyChessBackground from '@/app/components/legal/FamilyChessBackground';
import { Button } from 'app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'app/components/ui/card';
import { TfiUnlink } from "react-icons/tfi";
import Link from 'next/link';
import Image from 'next/image';
import { FaChildren } from "react-icons/fa6";
import { MdDiversity1, MdFamilyRestroom } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GiInjustice } from 'react-icons/gi';

// ← ADD THIS INTERFACE
interface LitigioFamiliarClientProps {
  divorciosImages: string[];
  pensionImages: string[];
  custodiaImages: string[];
  vicariaImages: string[];
}

// ← UPDATE FUNCTION SIGNATURE TO ACCEPT PROPS
export default function LitigioFamiliarClient({
  divorciosImages,
  pensionImages,
  custodiaImages,
  vicariaImages,
}: LitigioFamiliarClientProps) {

  // ← ONLY CHANGE: Remove hardcoded images, use props instead
  const services = [
    {
      title: 'Divorcios',
      description: 'El divorcio es el procedimiento legal mediante el cual se disuelve el vínculo matrimonial entre dos personas. En Baja California, este proceso regula derechos y obligaciones relacionadas con patrimonio, pensión y responsabilidades familiares. Su finalidad es dar certeza jurídica a ambas partes, permitiendo reorganizar la vida personal y familiar de manera ordenada. Los juzgados privilegian soluciones que reduzcan el conflicto, protejan a los hijos y garanticen acuerdos justos, claros y conforme a la ley vigente en la entidad federativa.',
      Icon: TfiUnlink,
      images: divorciosImages // ← Use prop instead of hardcoded array
    },
    {
      title: 'Pensión Alimenticia',
      description: 'La pensión alimenticia es la obligación legal destinada a garantizar la subsistencia y el desarrollo de niñas, niños y adolescentes. En Baja California, comprende alimentos, educación, salud, vestido y vivienda, de acuerdo con las necesidades del menor y las posibilidades del obligado. Su objetivo es proteger el interés superior de la niñez y asegurar condiciones dignas. Esta obligación se establece mediante resolución judicial o convenio, y su incumplimiento puede generar responsabilidades legales para las personas responsables de su cumplimiento.',
      Icon: MdFamilyRestroom,
      images: pensionImages // ← Use prop
    },
    {
      title: 'Guarda y Custodia',
      description: 'La guarda y custodia es la figura jurídica que determina con quién vivirán niñas, niños y adolescentes, así como quién asumirá su cuidado cotidiano. En Baja California, esta decisión se adopta atendiendo al interés superior de la niñez, evaluando estabilidad emocional, entorno familiar y condiciones reales de crianza. El proceso busca proteger a las infancias por encima de conflictos entre adultos, privilegiando su bienestar, desarrollo integral y derecho a crecer en un ambiente seguro, digno y libre de violencia',
      Icon: FaChildren,
      images: custodiaImages // ← Use prop
    },
    {
      title: 'Violencia Vicaria',
      description: 'La violencia vicaria ocurre cuando una persona busca dañar a otra ejerciendo violencia sobre un tercero. En muchos de estos casos, las hijas e hijos son utilizados como instrumentos de agresión para causar daño a las mujeres. Así lo señala el Informe Contextual sobre Violencia Vicaria: Análisis de la legislación estatal desde el enfoque civil y penal versus leyes locales en materia de acceso de las mujeres a una vida libre de violencia, elaborado por la Secretaría de Gobernación.',
      Icon: GiInjustice,
      images: vicariaImages // ← Use prop
    },
  ];

  // ===================================================
  // REST OF YOUR CODE STAYS EXACTLY THE SAME
  // ===================================================

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
            <div className="rounded-full bg-gray-700/40 p-3 text-white group-hover:text-gray-100 transition-colors">
              <service.Icon className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl text-Stone-100 group-hover:text-gray-100 transition-colors">
              {service.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-1 flex-col">
            <p className="flex-1 text-gray-300">
              {service.description}
            </p>

            {service.images && service.images.length > 0 && (
              <div 
                className="mt-6 relative h-72 rounded-lg overflow-hidden bg-black/40"
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
                    className="relative w-full h-full "
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
      <FamilyChessBackground />

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
              <MdDiversity1 className="mx-auto h-16 w-16 text-rose-600" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-4 text-4xl font-bold tracking-tight text-stone-300 md:text-8xl"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Litigio Familiar con Empatía y Firmeza
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-4 text-lg text-stone-200"
            >
              Ya sea que atravieses un divorcio, estés en una batalla por la custodia de tus hijos o tengas que resolver una herencia, necesitas un equipo legal con verdadera experiencia a tu lado. Profesionales que sepan defenderte, guiarte y trabajar contigo para alcanzar el mejor resultado posible.
            </motion.p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-7xl font-bold text-stone-300">¿Necesita un aliado legal para su familia?</p>

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
                <Link href="/contacto?service=legal-familiar">Contacte a un Experto</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}