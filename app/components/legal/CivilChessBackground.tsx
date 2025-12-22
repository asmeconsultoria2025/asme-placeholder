"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function CivilChessBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-black">
      <Canvas
        camera={{ position: [-6, 4, 18], fov: 28 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#000000' }}
      >
        <Suspense fallback={null}>
          <CivilScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function CivilScene() {
  return (
    <>
      {/* Set scene background to pure black */}
      <color attach="background" args={['#000000']} />
      
      {/* Much darker ambient light */}
      <ambientLight intensity={0.08} color="#ffffff" />
      
      {/* Key light - lower intensity */}
      <directionalLight 
        intensity={0.25} 
        position={[8, 10, 6]}
        color="#f5f5f5"
      />
      
      {/* Very subtle fill light */}
      <directionalLight
        intensity={0.05}
        position={[-5, 5, -8]}
        color="#e0e0e0"
      />

      {/* Same environment as main page */}
      <Environment preset="night" />

      {/* Add fog for extra darkness */}
      <fog attach="fog" args={['#000000', 8, 25]} />

      <ChessBoardCivil />
    </>
  );
}

function ChessBoardCivil() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/chess_board.glb");

  const model = scene.clone(true);

  const SCALE = 29;
  model.scale.set(SCALE, SCALE, SCALE);

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = window.scrollY / max;
      setScrollProgress(p);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(({ camera }) => {
    if (!group.current) return;

    // Diagonal arc sweep - camera moves in an arc from corner to corner
    const angle = THREE.MathUtils.lerp(-Math.PI * 0.65, Math.PI * 0.25, scrollProgress);
    const radius = 18;
    
    camera.position.x = Math.cos(angle) * radius;
    camera.position.z = Math.sin(angle) * radius + 8;
    camera.position.y = THREE.MathUtils.lerp(4, 5, scrollProgress);
    camera.lookAt(0, 0, 0);
    
    // Slight board tilt
    group.current.rotation.x = -Math.PI * 0.02;
  });

  return (
    <group ref={group} position={[0, -1.8, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload("/models/chess_board.glb");