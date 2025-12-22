// app/nosotros/NosotrosClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  FaHandsHelping,
  FaAward,
  FaUsers,
  FaCheckCircle,
  FaLinkedin,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { AiOutlineAlert } from 'react-icons/ai';
import { LuBrainCircuit } from 'react-icons/lu';
import { FaEarListen } from 'react-icons/fa6';
import { MdOutlineSecurity } from 'react-icons/md';

const values = [
  {
    label: 'Compromiso',
    phrase: 'Compromiso:',
    desc: 'Cumplimos con responsabilidad y ética en cada proyecto.',
    icon: FaHandsHelping,
    iconColor: '#dc2626',
  },
  {
    label: 'Excelencia',
    phrase: 'Excelencia:',
    desc: 'Buscamos la mejora continua en todos nuestros servicios.',
    icon: FaAward,
    iconColor: '#2563eb',
  },
  {
    label: 'Prevención',
    phrase: 'Prevención:',
    desc: 'Promovemos la seguridad como una cultura.',
    icon: AiOutlineAlert,
    iconColor: '#f97316',
  },
  {
    label: 'Confianza',
    phrase: 'Confianza:',
    desc: 'Relaciones sólidas y duraderas.',
    icon: FaUsers,
    iconColor: '#16a34a',
  },
  {
    label: 'Innovación',
    phrase: 'Innovación:',
    desc: 'Evolución constante con propósito.',
    icon: LuBrainCircuit,
    iconColor: '#9333ea',
  },
  {
    label: 'Servicio',
    phrase: 'Servicio:',
    desc: 'Escuchar para proteger.',
    icon: FaEarListen,
    iconColor: '#0ea5e9',
  },
];

interface TeamMemberImage {
  id: string;
  image_url: string;
  order: number;
}

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image_url: string;
  team_member_images?: TeamMemberImage[];
  linkedin?: string;
  email?: string;
}

interface NosotrosClientProps {
  teamMembers: TeamMember[];
}

// Team Member Card with Image Carousel
function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get all images (combine primary image_url with team_member_images)
  const allImages = [
    ...(member.image_url ? [{ id: 'primary', image_url: member.image_url, order: -1 }] : []),
    ...(member.team_member_images || [])
  ];
  
  const hasMultipleImages = allImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="group bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 hover:border-red-500 transition-all duration-300"
    >
      {/* Image Carousel Container */}
      <div className="relative h-80 overflow-hidden bg-gray-800">
        {/* Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <Image
              src={allImages[currentImageIndex]?.image_url || '/placeholder-team.jpg'}
              alt={member.name}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        {/* Carousel Controls */}
        {hasMultipleImages && (
          <>
            {/* Previous Button */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <FaChevronLeft size={16} />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <FaChevronRight size={16} />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? 'w-8 bg-red-500'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Social Links */}
        {(member.linkedin || member.email) && (
          <div className="absolute bottom-4 left-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <FaLinkedin className="text-white h-5 w-5" />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <FaEnvelope className="text-white h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-red-500 transition-colors">
          {member.name}
        </h3>
        <p className="text-red-500 font-semibold mb-4 uppercase text-sm tracking-wide">
          {member.position}
        </p>
        {/* Member Description/Bio */}
        <p className="text-gray-300 leading-relaxed text-base">
          {member.bio}
        </p>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-red-500 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" />
    </motion.div>
  );
}

export default function NosotrosClient({ teamMembers }: NosotrosClientProps) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(k => k + 1);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white">

      {/* HERO + TEAM */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">

          {/* TEXT */}
          <div className="text-center mb-20">
            <h6 className="uppercase tracking-widest text-red-500 font-semibold mb-4">
              Sobre ASME
            </h6>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-8">
              Nuestra Historia y <span className="text-red-500">Compromiso</span>
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                ASME es una empresa líder con más de 27 años de experiencia en el mercado, dedicada a brindar servicios integrales de consultoría, capacitación y defensa legal en materia de seguridad y protección civil para los sectores público, privado y social.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Nuestro propósito es fomentar una cultura de seguridad en las organizaciones, ayudando a prevenir riesgos y accidentes, así como a garantizar el cumplimiento normativo en materia de protección civil. A lo largo de más de dos décadas, hemos consolidado una trayectoria de excelencia, compromiso y profesionalismo, ofreciendo soluciones personalizadas, efectivas y a precios competitivos.
              </p>
            </div>
          </div>

          {/* TEAM MEMBERS SECTION */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h6 className="uppercase tracking-widest text-red-500 font-semibold mb-4">
                Nuestro Equipo
              </h6>
              <h2 className="text-4xl md:text-5xl font-extrabold">
                Conoce a Quienes Hacen <span className="text-red-500">la Diferencia</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={member.name} member={member} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-white mb-6">
              <MdOutlineSecurity className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-5xl font-extrabold text-red-500">
              Nuestros Valores
            </h2>
          </div>

          <motion.div
            key={key}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence>
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <motion.div
                    key={value.label}
                    initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      x: [0, 6, -6, 0],
                      y: [0, -6, 6, 0],
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      ease: 'easeInOut',
                    }}
                    whileHover={{ scale: 1.06 }}
                    className="relative bg-white text-black rounded-3xl p-8 shadow-2xl"
                  >
                    <div className="flex items-start gap-5 relative z-10">
                      <div
                        className="h-14 w-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: value.iconColor }}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>

                      <div>
                        <h3 className="font-extrabold text-2xl mb-1">
                          {value.label}
                        </h3>
                        <p className="italic text-gray-600 mb-2">
                          {value.phrase}
                        </p>
                        <p className="text-gray-800 leading-relaxed">
                          {value.desc}
                        </p>
                      </div>
                    </div>

                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <FaCheckCircle className="text-white" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}