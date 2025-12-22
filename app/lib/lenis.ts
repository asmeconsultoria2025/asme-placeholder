'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useAnimationFrame } from 'framer-motion';

export default function useLenisSmoothScroll() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth ease
      smoothWheel: true,
    });

    // 🔁 Normal RAF loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 🧠 Bridge Lenis scroll to Framer's useScroll
    lenis.on('scroll', ({ scroll }) => {
      // Dispatch a synthetic event Framer can detect
      window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: scroll }));
    });

    // Clean up on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  // 👇 Framer's useAnimationFrame fires a fake scroll event every frame
  // ensuring scrollYProgress stays in sync during Lenis interpolation
  useAnimationFrame(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}