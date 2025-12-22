'use client';

import dynamic from 'next/dynamic';

const GoHomeFAB = dynamic(() => import('./GoHomeFAB').then(mod => ({ default: mod.GoHomeFAB })), {
  ssr: false,
  loading: () => null
});

export function GoHomeFABWrapper() {
  return <GoHomeFAB />;
}