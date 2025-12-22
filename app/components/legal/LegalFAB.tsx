'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { cn } from '@/app/lib/utils';


useGLTF.preload('/models/chess_piece_knight_horse.glb');

function ChessModel() {
  const { scene } = useGLTF('/models/chess_piece_knight_horse.glb');
  const mesh = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    mesh.rotation.y += delta * 0.5;
  });

  return <primitive object={mesh} scale={0.23} position={[0, -1.2, 0]} />;
}

export function LegalFAB() {
  const pathname = usePathname();
  const isLegalSection = pathname.startsWith('/legal');

  if (isLegalSection) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/legal"
            className={cn(
              'fixed bottom-4 right-2 z-[99999] flex h-24 w-24 items-center justify-center cursor-pointer rounded-full overflow-visible transition-transform hover:scale-110 duration-300'
            )}
          >
            <Canvas
              camera={{ position: [0, 0, 6], fov: 30 }}
              style={{
                background: 'transparent',
                position: 'absolute',
                inset: 0,
                overflow: 'visible',
              }}
              dpr={[1, 2]}
              frameloop="always"
              gl={{ 
                antialias: false,
                alpha: true,
                powerPreference: 'high-performance'
              }}
            >
              <ambientLight intensity={1.2} />
              <directionalLight position={[3, 3, 3]} intensity={2} />
              <Suspense fallback={null}>
                <ChessModel />
              </Suspense>
            </Canvas>
            <span className="sr-only">Sección Legal</span>
          </Link>
        </TooltipTrigger>

        <TooltipContent side="top">
          <p>Ir a la Página Legal</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}