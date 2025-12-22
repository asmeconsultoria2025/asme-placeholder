"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function CitasChessBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-black">
      <Canvas
        camera={{ position: [0, 5, 9], fov: 24 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#000000' }}
      >
        <Suspense fallback={null}>
          <CitasScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function CitasScene() {
  return (
    <>
      {/* Set scene background to pure black */}
      <color attach="background" args={['#000000']} />
      
      {/* Much darker ambient light */}
      <ambientLight intensity={0.08} color="#ffffff" />
      
      {/* Key light - lower intensity */}
      <directionalLight 
        intensity={0.25} 
        position={[7, 12, 5]}
        color="#f5f5f5"
      />
      
      {/* Very subtle fill light */}
      <directionalLight
        intensity={0.05}
        position={[-7, 6, -4]}
        color="#e0e0e0"
      />

      {/* Same environment as main page */}
      <Environment preset="night" />

      {/* Add fog for extra darkness */}
      <fog attach="fog" args={['#000000', 8, 25]} />

      <ChessBoardCitas />
    </>
  );
}

function ChessBoardCitas() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/chess_board.glb");

  const model = scene.clone(true);

  const SCALE = 29;
  model.scale.set(SCALE, SCALE, SCALE);

  const [rotationY, setRotationY] = useState(0);
  const [cameraZ, setCameraZ] = useState(9);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = window.scrollY / max;
      
      // Board rotates on Y-axis
      setRotationY(p * Math.PI * 0.8);
      
      // Camera pans in (gets closer)
      setCameraZ(THREE.MathUtils.lerp(9, 6, p));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(({ camera }) => {
    if (!group.current) return;

    // Board rotates slowly
    group.current.rotation.y = rotationY;
    group.current.rotation.x = -Math.PI * 0.1;
    
    // Camera pans in and out
    camera.position.z = cameraZ;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group} position={[0, -1.5, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload("/models/chess_board.glb");