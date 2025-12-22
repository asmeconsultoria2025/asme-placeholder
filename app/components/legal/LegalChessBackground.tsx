"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function LegalChessBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-black">
      <Canvas
        camera={{ position: [0, 3, 6], fov: 18 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <CinematicScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function CinematicScene() {
  return (
    <>
      {/* Dark ambient light for dramatic effect */}
      <ambientLight intensity={0.15} color="#ffffff" />
      
      {/* Key light - warm and directional */}
      <directionalLight 
        intensity={0.4} 
        position={[9.8, 8.9, 10.9]}
        color="#f5f5f5"
      />
      
      {/* Fill light for shadows */}
      <directionalLight
        intensity={0.1}
        position={[-9.8, 5, -10.9]}
        color="#e0e0e0"
      />

      {/* Use a neutral environment instead of sunset */}
      <Environment preset="night" />

      <ChessBoardCinematic />
    </>
  );
}

function ChessBoardCinematic() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/chess_board.glb");

  const model = scene.clone(true);

  // Scale the model
  const SCALE = 29;
  model.scale.set(SCALE, SCALE, SCALE);

  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = window.scrollY / max;

      // zoom from 1.7 → 0.7
      setZoom(THREE.MathUtils.lerp(1.7, 0.7, p));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (!group.current) return;

    group.current.scale.set(zoom, zoom, zoom);
    group.current.rotation.x = -Math.PI * 0.14; // cinematic tilt
  });

  return (
    <group ref={group} position={[0, -1.8, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload("/models/chess_board.glb");