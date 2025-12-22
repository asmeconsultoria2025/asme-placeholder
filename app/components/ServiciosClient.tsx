'use client';

import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { SERVICES } from '@/app/lib/constants';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/* ================== CARD VARIANTS ================== */

const cardVariants: Variants = {
  offscreen: { y: 300, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.35,
      duration: 0.8,
    },
  },
};

/* ================== LAYOUT ================== */

const container: React.CSSProperties = {
  margin: '100px auto',
  maxWidth: 1200,
  paddingBottom: 260,
  width: '100%',
  position: 'relative',
};

const rowStyle = (isEven: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: isEven ? 'flex-start' : 'flex-end',
  marginBottom: -120,
  padding: '0 40px',
  minHeight: '600px',
  position: 'relative',
});

const cardContainer: React.CSSProperties = {
  position: 'relative',
  width: '500px',
  height: '520px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/* ================== SPLASH ================== */

const splash: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: `
    linear-gradient(306deg, hsl(0,55%,14%), hsl(0,45%,7%)),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")
  `,
  clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450  0 441.046 0 430 Z")`,
};

/* ================== CARD ================== */

const card: React.CSSProperties = {
  width: '90%',
  maxWidth: 460,
  height: 480,
  borderRadius: 28,
  background: '#ffffff',
  boxShadow: '0 30px 70px rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 40,
  zIndex: 10,
};

/* ================== TEXT ================== */

const textBlock = (isEven: boolean): React.CSSProperties => ({
  width: 500,
  padding: 40,
  position: 'absolute',
  [isEven ? 'left' : 'right']: '100px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 20,
  textAlign: isEven ? 'right' : 'left',
});

/* ================== MAIN ================== */

export default function ServiciosClient() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  /* ---------- TYPEWRITER CTA ---------- */
  const fullText = 'Listo para cumplir normativas y evitar multas?';
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 85);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ================= SERVICES ================= */}
      <section className="relative py-48 bg-black">
        <div className="hidden md:block" style={container}>
          {SERVICES.map((service, i) => {
            const isEven = i % 2 === 0;
            const iconColor = service.color ?? '#dc2626';

            return (
              <div key={service.slug} style={rowStyle(isEven)}>
                <motion.div
                  style={textBlock(isEven)}
                  initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ amount: 0.5 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div
                    className="flex items-center gap-4 mb-6"
                    style={{ justifyContent: isEven ? 'flex-end' : 'flex-start' }}
                  >
                    <div className="h-16 w-16 rounded-full bg-black border border-red-500/40 shadow-xl flex items-center justify-center">
                      <service.Icon className="h-9 w-9" style={{ color: iconColor }} />
                    </div>
                    <h3 className="text-4xl font-bold text-white">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-md">
                    {service.description}
                  </p>

                  <button
                    onClick={() => setExpandedCard(service.slug)}
                    className="flex items-center gap-3 text-red-500 font-bold text-xl hover:gap-6 transition-all duration-300"
                    style={{ [isEven ? 'marginLeft' : 'marginRight']: 'auto' }}
                  >
                    Más detalles
                    <ArrowRight className="h-7 w-7" />
                  </button>
                </motion.div>

                <motion.div
                  style={cardContainer}
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ amount: 0.8 }}
                >
                  <div style={splash} />
                  <motion.div style={card} variants={cardVariants}>
                    {service.images?.[0] && (
                      <Image
                        src={service.images[0]}
                        alt={service.title}
                        width={420}
                        height={420}
                        className="rounded-2xl object-cover shadow-2xl"
                      />
                    )}
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-black py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center md:text-left">
            {typedText}
            <span className="animate-pulse">|</span>
          </h2>

          <div className="flex gap-4">
            <a
              href="tel:+526642016011"
              className="px-6 py-3 rounded-lg font-semibold text-white text-center bg-red-800 hover:bg-red-700"
            >
              Llamar ahora
            </a>

            <Link
              href="/contacto"
              className="px-6 py-3 rounded-lg font-semibold text-center text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition"
            >
              Solicitar cotización
            </Link>
          </div>
        </div>
      </section>

      {expandedCard && (
        <ExpandedCardModal
          slug={expandedCard}
          onClose={() => setExpandedCard(null)}
        />
      )}
    </>
  );
}

/* ================== MODAL ================== */

function ExpandedCardModal({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  const service = SERVICES.find(s => s.slug === slug);

  if (!service) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl"
        initial={{ y: 400 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>

          <h2 className="text-4xl font-bold text-center mb-6">
            {service.title}
          </h2>

          <p className="text-center text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {service.modalContent}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
