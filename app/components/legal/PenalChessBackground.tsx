"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function PenalChessBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-black">
      <Canvas
        camera={{ position: [6, 1.5, 6], fov: 27 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#000000' }}
      >
        <Suspense fallback={null}>
          <PenalScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function PenalScene() {
  return (
    <>
      {/* Set scene background to pure black */}
      <color attach="background" args={['#000000']} />
      
      {/* Much darker ambient light */}
      <ambientLight intensity={0.08} color="#ffffff" />
      
      {/* Key light from side - much lower intensity */}
      <directionalLight 
        intensity={0.25} 
        position={[12, 6, 8]}
        color="#f5f5f5"
      />
      
      {/* Very subtle fill light */}
      <directionalLight
        intensity={0.05}
        position={[-8, 4, -6]}
        color="#e0e0e0"
      />

      {/* Same environment as main page */}
      <Environment preset="night" />

      {/* Add fog for extra darkness */}
      <fog attach="fog" args={['#000000', 8, 25]} />

      <ChessBoardPenal />
    </>
  );
}

function ChessBoardPenal() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/chess_board.glb");

  const model = scene.clone(true);

  const SCALE = 29;
  model.scale.set(SCALE, SCALE, SCALE);

  const [cameraY, setCameraY] = useState(1.5);
  const [cameraAngle, setCameraAngle] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = window.scrollY / max;
      
      // Camera rises from low (1.5) to high (5)
      setCameraY(THREE.MathUtils.lerp(1.5, 5, p));
      
      // Camera rotates around the board as it rises
      setCameraAngle(p * Math.PI * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(({ camera }) => {
    if (!group.current) return;

    // Camera rises up AND rotates around
    const radius = 6;
    camera.position.x = Math.cos(cameraAngle) * radius;
    camera.position.y = cameraY;
    camera.position.z = Math.sin(cameraAngle) * radius;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload("/models/chess_board.glb");