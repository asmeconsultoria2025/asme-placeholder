"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function AboutChessBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-black">
      <Canvas
        camera={{ position: [0, 2.5, 12], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#000000' }}
      >
        <Suspense fallback={null}>
          <AboutScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function AboutScene() {
  return (
    <>
      {/* Set scene background to pure black */}
      <color attach="background" args={['#000000']} />
      
      {/* Much darker ambient light */}
      <ambientLight intensity={0.08} color="#ffffff" />
      
      {/* Key light - lower intensity */}
      <directionalLight 
        intensity={0.25} 
        position={[6, 10, 8]}
        color="#f5f5f5"
      />
      
      {/* Very subtle fill light */}
      <directionalLight
        intensity={0.05}
        position={[-6, 5, -6]}
        color="#e0e0e0"
      />

      {/* Same environment as main page */}
      <Environment preset="night" />

      {/* Add fog for extra darkness */}
      <fog attach="fog" args={['#000000', 8, 25]} />

      <ChessBoardAbout />
    </>
  );
}

function ChessBoardAbout() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/chess_board.glb");

  const model = scene.clone(true);

  const SCALE = 29;
  model.scale.set(SCALE, SCALE, SCALE);

  const [cameraZ, setCameraZ] = useState(12);
  const [lookAtY, setLookAtY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = window.scrollY / max;
      
      // Slow forward drift - camera moves closer
      setCameraZ(THREE.MathUtils.lerp(2, 8, p));
      
      // Gentle upward tilt - look-at point rises
      setLookAtY(THREE.MathUtils.lerp(0, 1.5, p));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(({ camera }) => {
    if (!group.current) return;

    // Camera drifts forward (closer to board)
    camera.position.z = cameraZ;
    
    // Camera tilts upward as it moves closer
    camera.lookAt(0, lookAtY, 0);
    
    // Static board tilt
    group.current.rotation.x = -Math.PI * 0.12;
  });

  return (
    <group ref={group} position={[0, -1.8, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload("/models/chess_board.glb");