"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function FamilyChessBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-black">
      <Canvas
        camera={{ position: [0, 8, 3], fov: 35 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#000000' }}
      >
        <Suspense fallback={null}>
          <FamilyScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function FamilyScene() {
  return (
    <>
      {/* Set scene background to pure black */}
      <color attach="background" args={['#000000']} />
      
      {/* Dark ambient light for dramatic effect - same as main page */}
      <ambientLight intensity={0.15} color="#ffffff" />
      
      {/* Key light - matching main page intensity */}
      <directionalLight 
        intensity={0.4} 
        position={[0, 12, 5]}
        color="#f5f5f5"
      />
      
      {/* Fill light for shadows */}
      <directionalLight
        intensity={0.1}
        position={[8, 6, -3]}
        color="#e0e0e0"
      />

      {/* Same environment as main page */}
      <Environment preset="night" />

      <ChessBoardFamily />
    </>
  );
}

function ChessBoardFamily() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/chess_board.glb");

  const model = scene.clone(true);

  const SCALE = 29;
  model.scale.set(SCALE, SCALE, SCALE);

  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = window.scrollY / max;

      // Gentle Y-axis rotation as you scroll
      setRotation(p * Math.PI * 0.3);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (!group.current) return;

    group.current.rotation.y = rotation;
    group.current.rotation.x = -Math.PI * 0.25; // More overhead angle
  });

  return (
    <group ref={group} position={[0, -2.5, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload("/models/chess_board.glb");