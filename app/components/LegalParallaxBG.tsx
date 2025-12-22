'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';

export default function LegalParallaxBG({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Background parallax
  const bgZoom = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], [-10, 0]);
  const bgZoomSpring = useSpring(bgZoom, { stiffness: 40, damping: 25 });
  const bgYSpring = useSpring(bgY, { stiffness: 40, damping: 50 });

  // Bishop piece parallax
  const pieceScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.3]);
  const pieceY = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const pieceX = useTransform(scrollYProgress, [0, 1], [-20, 15]);
  const pieceOpacity = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

  const pieceScaleSpring = useSpring(pieceScale, { stiffness: 50, damping: 20 });
  const pieceYSpring = useSpring(pieceY, { stiffness: 50, damping: 20 });
  const pieceXSpring = useSpring(pieceX, { stiffness: 50, damping: 20 });
  const pieceOpacitySpring = useSpring(pieceOpacity, { stiffness: 50, damping: 20 });

  // Content scroll
  const contentY = useTransform(scrollYProgress, [0, 1], ['0vh', '-35vh']);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* FIXED BACKGROUND */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -10,
          pointerEvents: 'none',
          overflow: 'hidden',
          backgroundColor: '#000000',
        }}
      >
        {/* Base gradient */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #0f172a 0%, #000000 50%, #0f0f1e 100%)',
            zIndex: 1,
          }} 
        />

        {/* Layer 1: Board - Subtle Parallax */}
        <motion.img
          src="/bishop_layers_bg/1.png"
          alt="Chess board background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            scale: bgZoomSpring,
            y: bgYSpring,
            zIndex: 2,
          }}
        />

        {/* Layer 2: Bishop - Dramatic Movement */}
        <motion.img
          src="/bishop_layers_bg/2.png"
          alt="Bishop piece"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            scale: pieceScaleSpring,
            y: pieceYSpring,
            x: pieceXSpring,
            opacity: pieceOpacitySpring,
            zIndex: 3,
          }}
        />

        {/* Top fade */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '200px',
            background: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />

        {/* Bottom fade */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '150px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%)',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* CONTENT */}
      <motion.div 
        style={{
          y: contentY,
          position: 'relative',
          zIndex: 10,
          width: '100%',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}