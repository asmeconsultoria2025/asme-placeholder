// app/legal/LegalServiceClient.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface LegalServiceClientProps {
  heroImages: string[];
  title: string;
  subtitle: string;
  description: string;
  children?: React.ReactNode;
}

export default function LegalServiceClient({
  heroImages,
  title,
  subtitle,
  description,
  children
}: LegalServiceClientProps) {
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-rotate images every 5 seconds
  useState(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      {/* Hero Section with Dynamic Images */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImage === index ? 0.3 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={src}
                alt={`${title} background ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>
          ))}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </motion.div>

          {/* Image Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 rounded-full transition-all ${
                  currentImage === index 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="text-gray-300 leading-relaxed space-y-6">
              {description.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* Additional Content */}
          {children}
        </div>
      </section>
    </main>
  );
}