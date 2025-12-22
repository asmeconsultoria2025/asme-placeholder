'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const logos = [
  '/images/logos/logo1.png',
  '/images/logos/logo2.png',
  '/images/logos/logo3.png',
  '/images/logos/logo4.png',
  '/images/logos/logo5.png',
  '/images/logos/logo6.png',
  '/images/logos/logo7.png',
  '/images/logos/logo8.png',
  '/images/logos/logo9.png',
  '/images/logos/logo10.png',
  '/images/logos/logo11.png',
  '/images/logos/logo12.png',
  '/images/logos/logo13.png',
  '/images/logos/logo14.png',
  '/images/logos/logo15.png',
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const logoWidth = 288 + 16; // 72 * 4 (w-72) + space-x-4
    const totalLogos = logos.length * 2;

    let frame: number;
    const scroll = () => {
      el.scrollLeft += 1.2;
      if (el.scrollLeft >= (logoWidth * logos.length)) {
        el.scrollLeft = 0;
      }

      // Calculate which logo is centered
      const containerCenter = el.offsetWidth / 2;
      const scrollLeft = el.scrollLeft;
      const centerPosition = scrollLeft + containerCenter;
      const logoIndex = Math.floor(centerPosition / logoWidth) % totalLogos;
      
      setCenterIndex(logoIndex);
      frame = requestAnimationFrame(scroll);
    };

    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative isolate overflow-hidden pt-8 pb-24 sm:pt-12 sm:pb-32 bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center mb-14">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Empresas que han confiado en
            <span className="block text-red-600">nuestros servicios</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed">
            Más de 27 años colaborando con instituciones públicas, privadas y sociales
            comprometidas con la seguridad y el cumplimiento normativo.
          </p>
        </div>

        {/* Infinite logo carousel */}
        <div className="relative">
          {/* Radial spotlight overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'radial-gradient(circle 250px at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)'
            }}
          />
          
          <div
            ref={scrollRef}
            className="overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          >
            <div className="flex min-w-max space-x-4">
              {logos.concat(logos).map((src, i) => (
                <div
                  key={i}
                  className={`relative h-52 w-72 flex items-center justify-center transition-all duration-500 ${
                    centerIndex === i
                      ? 'opacity-100 scale-125'
                      : 'opacity-50 scale-100'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Logo cliente ${i + 1}`}
                    fill
                    sizes="300px"
                    className={`object-contain p-1 transition-all duration-500 ${
                      centerIndex === i
                        ? 'brightness-130 contrast-105'
                        : 'brightness-65 contrast-90'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}