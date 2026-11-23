import { Suspense } from 'react';
import { Metadata } from 'next';
import { WorldScene } from '@/world/WorldScene';
import { WorldLoadingFallback } from '@/world/loading/WorldLoadingScreen';

export const metadata: Metadata = {
  title: 'Abhishek // Developer Universe (3D World Simulation)',
  description:
    'Explore the futuristic 3D interactive developer universe of Abhishek S Nair. 9 districts including the GitHub Code Nexus Citadel, FlowSync HQ, and Echo AI Lab.',
  openGraph: {
    title: 'Abhishek // Developer Universe (3D World Simulation)',
    description:
      'Explore the futuristic 3D interactive developer universe of Abhishek S Nair.',
    images: ['/profile.webp'],
  },
};

export default function WorldPage() {
  return (
    <Suspense fallback={<WorldLoadingFallback />}>
      <WorldScene />
    </Suspense>
  );
}
