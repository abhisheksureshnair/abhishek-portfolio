/**
 * Contact & Collaboration Hub Metadata (Phase 2.6)
 * Authoritative portfolio communication, verified channels, and collaboration offerings.
 */

export interface ContactChannel {
  id: string;
  name: string;
  handle: string;
  url: string;
  badge: string;
  description: string;
  icon: 'github' | 'linkedin' | 'portfolio' | 'email';
}

export interface CollaborationOffering {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  deliverables: string[];
  tag: string;
}

export interface ContactHubMetadata {
  id: 'contact';
  name: string;
  subtitle: string;
  parcelId: string;
  center: [number, number];
  dimensions: [number, number];
  totalFloors: number;
  height: number;
  facing: 'north';
  identity: {
    name: string;
    role: string;
    experience: string;
    email: string;
    location: string;
    availability: string;
    resumeUrl: string;
  };
  channels: ContactChannel[];
  offerings: CollaborationOffering[];
  inquiryTypes: string[];
}

export const CONTACT_HUB_METADATA: ContactHubMetadata = {
  id: 'contact',
  name: 'Contact & Collaboration Hub',
  subtitle: "Let's Connect • Build • Innovate",
  parcelId: 'block-2-0',
  center: [-40.0, 40.0],
  dimensions: [23.6, 23.6],
  totalFloors: 6,
  height: 24.0,
  facing: 'north',
  identity: {
    name: 'Abhishek S Nair',
    role: 'Full Stack & Mobile Engineer',
    experience: '3.6+ Years Verified Experience',
    email: 'nairsabhishek@gmail.com',
    location: 'Kerala, India',
    availability: 'Open for Roles & Product Engineering Teams',
    resumeUrl: '/resume.pdf',
  },
  channels: [
    {
      id: 'github',
      name: 'GitHub',
      handle: 'abhisheksureshnair',
      url: 'https://github.com/abhisheksureshnair',
      badge: 'Code Repositories',
      description: 'Explore full-stack open source repositories, architecture samples, and production-tested systems.',
      icon: 'github',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'abhisheksnair',
      url: 'https://www.linkedin.com/in/abhisheksnair',
      badge: 'Professional Network',
      description: 'Connect professionally, view verified endorsements, employment recommendations, and network updates.',
      icon: 'linkedin',
    },
    {
      id: 'portfolio',
      name: 'Portfolio Web',
      handle: 'abhisheksnair.vercel.app',
      url: 'https://abhisheksnair.vercel.app',
      badge: '3D Interactive',
      description: 'Interactive 3D American coastal metropolis portfolio powered by Next.js, Three.js, and React Three Fiber.',
      icon: 'portfolio',
    },
    {
      id: 'email',
      name: 'Direct Inquiries',
      handle: 'nairsabhishek@gmail.com',
      url: 'mailto:nairsabhishek@gmail.com',
      badge: 'Instant Dispatch',
      description: 'Direct priority inbox for contract proposals, technical architecture consultations, and engineering roles.',
      icon: 'email',
    },
  ],
  offerings: [
    {
      id: 'react-web',
      title: 'React.js Web Engineering',
      subtitle: 'High-performance Single Page Applications & Next.js Systems',
      description: 'Design and engineering of scalable client-side web architectures, SSR/SSG pipelines, interactive Canvas/3D integrations, and micro-frontend state layers.',
      technologies: ['React 18/19', 'Next.js App Router', 'TypeScript', 'Tailwind CSS', 'Zustand / Redux'],
      deliverables: ['Production SPA/SSR Apps', 'Design System Architecture', 'Performance Optimization Audits'],
      tag: 'Frontend Web',
    },
    {
      id: 'react-native',
      title: 'React Native Mobile Applications',
      subtitle: 'Cross-platform iOS & Android Enterprise Client Architectures',
      description: 'Engineering responsive, native-feeling mobile solutions with offline-first synchronization, secure local storage, native bridge modules, and store automation.',
      technologies: ['React Native', 'Expo Application Services', 'TypeScript', 'Redux Toolkit', 'Reanimated 3'],
      deliverables: ['iOS & Android Builds', 'Offline Sync Storage Engines', 'App Store & Play Store Submissions'],
      tag: 'Cross-Platform Mobile',
    },
    {
      id: 'flutter-apps',
      title: 'Flutter Multiplatform Development',
      subtitle: 'Expressive High-Fidelity UI & Cross-Platform Engines',
      description: 'Crafting fluid 60/120 FPS cross-platform mobile experiences with reactive state architecture, hardware API bindings, and custom render trees.',
      technologies: ['Flutter SDK', 'Dart', 'BLoC / Provider', 'Firebase', 'REST / WebSockets'],
      deliverables: ['Custom Widget Libraries', 'Reactive BLoC State Systems', 'Cross-Platform Production Deployments'],
      tag: 'Mobile UI/UX',
    },
    {
      id: 'fullstack-systems',
      title: 'Full-Stack Web Systems',
      subtitle: 'End-to-End Enterprise Backends & Distributed APIs',
      description: 'Building robust Node.js, Express, and PostgreSQL microservices with JWT authentication, relational database modeling, containerization, and RESTful contract guarantees.',
      technologies: ['Node.js', 'Express', 'PostgreSQL', 'Prisma / TypeORM', 'Docker', 'Redis'],
      deliverables: ['Secured REST & GraphQL APIs', 'Relational Schema Migrations', 'CI/CD Automated Deployments'],
      tag: 'Backend & Cloud',
    },
    {
      id: 'mobile-iot',
      title: 'Mobile & IoT Systems Integration',
      subtitle: 'Hardware Telemetry, Bluetooth LE & Real-time Tracking',
      description: 'Proven production track record deploying connected vehicle tracking systems (VTS), telemetry packet decoding, Bluetooth sensor streaming, and alert engines.',
      technologies: ['BLE 5.0', 'MQTT', 'WebSockets', 'Geofencing', 'Background Workers'],
      deliverables: ['Real-time Telemetry Dashboards', 'Hardware Protocol Parsers', 'Push Notification Pipeline'],
      tag: 'IoT & Telemetry',
    },
    {
      id: 'engineering-collaboration',
      title: 'Software Engineering Collaboration',
      subtitle: 'Agile Team Leadership, Code Reviews & Systems Architecture',
      description: 'Collaborative technical leadership for cross-functional product squads: defining technical roadmaps, conducting rigorous code reviews, and optimizing delivery velocity.',
      technologies: ['Agile / Scrum', 'Git & GitHub Workflows', 'CI/CD Pipelines', 'Clean Architecture'],
      deliverables: ['System Architecture Blueprints', 'Developer Documentation', 'Velocity & Quality Improvements'],
      tag: 'Engineering Leadership',
    },
  ],
  inquiryTypes: [
    'Full-Time Engineering Role',
    'Contract / Freelance Product Build',
    'Technical Architecture Consultation',
    'Open Source & Collaboration',
    'General Inquiry',
  ],
};
