'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { cn } from "@/app/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

useGLTF.preload("/Caduceus/star of life 3d model.glb");

// Global cache
let cachedCaduceus: THREE.Group | null = null;
let loadingPromise: Promise<THREE.Group> | null = null;

function StarOfLife() {
  const { scene } = useGLTF("/Caduceus/star of life 3d model.glb");

  const cloned = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#0033cc",
          metalness: 0.2,
          roughness: 0.35,
        });
      }
    });
    const box = new THREE.Box3().setFromObject(s);
    const center = new THREE.Vector3();
    box.getCenter(center);
    s.position.sub(center);
    return s;
  }, [scene]);

  return <primitive object={cloned} position={[0.04, 0.09, 0.10]} scale={2.0} />;
}

function Caduceus() {
  const [model, setModel] = useState<THREE.Group | null>(cachedCaduceus);

  useEffect(() => {
    if (cachedCaduceus) {
      setModel(cachedCaduceus.clone());
      return;
    }

    if (!loadingPromise) {
      loadingPromise = new Promise((resolve) => {
        const loader = new OBJLoader();
        loader.load("/Caduceus/Caduceus.obj", (root) => {
          root.traverse((child: any) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: "#ffffff",
                metalness: 0.1,
                roughness: 0.3,
              });
            }
          });
          root.scale.setScalar(0.07);
          const box = new THREE.Box3().setFromObject(root);
          const center = new THREE.Vector3();
          box.getCenter(center);
          root.position.sub(center);
          root.rotation.x = THREE.MathUtils.degToRad(-91);
          root.rotation.y = THREE.MathUtils.degToRad(-3);
          root.rotation.z = THREE.MathUtils.degToRad(91);
          root.position.x += 0.15;
          root.position.y += -0.58;
          root.position.z += 0.69;
          cachedCaduceus = root;
          resolve(root);
        });
      });
    }

    loadingPromise.then((root) => {
      setModel(root.clone());
    });
  }, []);

  if (!model) return null;

  return <primitive object={model} />;
}

function EMSBadge() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={ref} scale={16} position={[2.65, -4.9, -5]}>
      <StarOfLife />
      <Caduceus />
    </group>
  );
}

export function GoHomeFAB() {
  const pathname = usePathname();
  const isLegalSection = pathname.startsWith("/legal");

  if (!isLegalSection) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/"
            aria-label="Volver al sitio principal"
            className={cn(
              "fixed bottom-[10px] left-4 z-[99999] flex items-center justify-center cursor-pointer w-[120px] h-[120px] rounded-full transition-transform hover:scale-110 duration-300"
            )}
          >
            <Canvas
              key="ems-badge-canvas"
              camera={{ position: [0, 0, 40], fov: 65 }}
              dpr={[1, 1.5]}
              frameloop="always"
              gl={{ 
                antialias: false,
                alpha: true,
                powerPreference: "high-performance",
                preserveDrawingBuffer: false
              }}
              style={{
                background: "transparent",
                width: "120px",
                height: "120px",
              }}
            >
              <ambientLight intensity={1.4} />
              <directionalLight position={[3, 3, 5]} intensity={2.4} />
              <Suspense fallback={null}>
                <EMSBadge />
              </Suspense>
            </Canvas>
            <span className="sr-only">Volver al Sitio Principal</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="z-[99999] bg-legal-background text-white border border-legal-primary/50">
          <p>Ir al Sitio Principal</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}