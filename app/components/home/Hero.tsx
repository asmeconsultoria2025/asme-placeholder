"use client";

import { useEffect, useState } from "react";

export function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const overlayStyles: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(
        to bottom,
        rgba(0,0,0,0.42) 0%,
        rgba(0,0,0,0.28) 28%,
        rgba(0,0,0,0.12) 52%,
        rgba(0,0,0,0.06) 64%,
        rgba(0,0,0,0.00) 70%
      ),
      radial-gradient(circle at 25% 22%, rgba(37,99,235,0.15), transparent 60%),
      radial-gradient(circle at 82% 55%, rgba(249,115,22,0.08), transparent 65%),
      linear-gradient(
        to bottom,
        rgba(255,255,255,0.00) 70%,
        rgba(255,255,255,0.55) 88%,
        rgba(255,255,255,1.00) 100%
      )
    `,
    backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
    backgroundSize: "200% 200%, 200% 200%, 200% 200%, 100% 100%",
    backgroundPosition: "center, 0% 0%, 100% 100%, bottom",
  };

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full md:h-[70vh] overflow-hidden">
      {/* Desktop video */}
      <video
        src="/videos/hero_video2.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover object-center md:object-[center_40%] transition-opacity duration-700 ease-in-out ${
          isMobile ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Mobile video */}
      <video
        src="/videos/New_hero_mobile2.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover object-center md:object-[center_40%] transition-opacity duration-700 ease-in-out ${
          isMobile ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Overlay */}
      <div className="absolute inset-0" style={overlayStyles} />
    </section>
  );
}
