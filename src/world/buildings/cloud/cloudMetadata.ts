export interface CloudProject {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  category: 'Enterprise Backend' | 'Real-Time Sync' | 'Healthcare IoT' | 'Full-Stack Web' | 'Cloud Infrastructure';
  status: 'Production' | 'Live Enterprise' | 'Open Source';
  description: string;
  architectureHighlights: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  githubUrl: string;
  liveUrl?: string;
}

export interface CloudExhibitionZone {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  summary: string;
  pipelineStage: string;
  keyConcepts: { title: string; desc: string; tech: string }[];
  diagramCode?: string;
  metrics: { label: string; value: string }[];
}

export interface CloudHubMetadata {
  id: string;
  name: string;
  department: string;
  title: string;
  subtitle: string;
  overview: string;
  mission: string;
  architecturalStats: {
    parcelId: string;
    coordinates: [number, number];
    dimensions: [number, number];
    storeys: number;
    entranceDirection: string;
    primaryStyle: string;
  };
  zones: CloudExhibitionZone[];
  projects: CloudProject[];
  infrastructureTelemetry: {
    activeNodes: number;
    clusterHealth: string;
    avgLatencyMs: number;
    uptimePercent: number;
    activeDeployments: number;
    requestsPerSecond: number;
  };
}

export const CLOUD_HUB_METADATA: CloudHubMetadata = {
  id: 'cloud-nexus',
  name: 'Cloud Ecosystem Hub',
  department: 'BACKEND • CLOUD • APIs • INFRASTRUCTURE',
  title: 'CLOUD ECOSYSTEM HUB',
  subtitle: 'CONNECT • BUILD • DEPLOY',
  overview:
    'Dedicated architectural center showcasing Abhishek S Nair’s real-world expertise in scalable backend architectures, Node.js REST APIs, Firebase cloud integrations, database systems, React & React Native application connectivity, and modern CI/CD deployment pipelines.',
  mission:
    'Architecting resilient full-stack cloud ecosystems that bridge client interfaces with high-performance server runtimes, authenticated data streams, and robust infrastructure.',
  architecturalStats: {
    parcelId: 'block-2-2',
    coordinates: [40, 40],
    dimensions: [25.2, 25.2],
    storeys: 6,
    entranceDirection: 'North (facing Street Z=20 at [40, 30.5])',
    primaryStyle: 'Sweeping Parabolic Glass Curtain Wall with Elevated Viaduct Skybridge',
  },
  infrastructureTelemetry: {
    activeNodes: 64,
    clusterHealth: '100% Operational',
    avgLatencyMs: 14.2,
    uptimePercent: 99.99,
    activeDeployments: 38,
    requestsPerSecond: 12400,
  },
  zones: [
    {
      id: 'frontend-apps',
      title: 'Frontend Applications & Client Layer',
      subtitle: 'React, Next.js, React Native & State Synchronization',
      iconName: 'Smartphone',
      pipelineStage: 'STAGE 1: CLIENT LAYER',
      summary:
        'Client-side application interfaces built with React, Next.js, and React Native. Manages optimistic UI updates, client-side caching, secure token storage, and responsive multi-platform presentation.',
      keyConcepts: [
        {
          title: 'Cross-Platform React & React Native',
          desc: 'Unified state management and API client abstractions shared between responsive web applications and iOS/Android mobile clients.',
          tech: 'React 19, React Native, Next.js, TypeScript',
        },
        {
          title: 'Resilient HTTP & WebSocket Clients',
          desc: 'Axios and native fetch interceptors handling JWT rotation, automatic exponential backoff retry logic, and real-time socket connections.',
          tech: 'Axios Interceptors, WebSocket API, React Query',
        },
        {
          title: 'Client State & Cache Optimization',
          desc: 'Normalized local caching reducing redundant network requests while preserving sub-millisecond UI interaction responsiveness.',
          tech: 'Zustand, React Hooks, Redux Toolkit',
        },
      ],
      metrics: [
        { label: 'Client Bundle Size', value: '< 180 KB' },
        { label: 'Time to Interactive', value: '0.8s' },
        { label: 'Platform Coverage', value: 'Web + Mobile' },
      ],
    },
    {
      id: 'api-layer',
      title: 'API Layer & Gateway Services',
      subtitle: 'RESTful Endpoints, Rate Limiting & Auth Middleware',
      iconName: 'Network',
      pipelineStage: 'STAGE 2: API GATEWAY',
      summary:
        'High-performance API endpoints and routing gateways built on Express and Next.js Route Handlers. Enforces schema validation, CORS security, rate limiting, and authenticated session verification.',
      keyConcepts: [
        {
          title: 'RESTful API Architecture',
          desc: 'Resource-oriented endpoint design with semantic HTTP verbs, predictable JSON payloads, and standardized pagination/filtering queries.',
          tech: 'REST Standards, Express Router, Next.js Route Handlers',
        },
        {
          title: 'Authentication & Session Guards',
          desc: 'Bearer token verification, role-based access control (RBAC), and cryptographic signature validation securing private endpoints.',
          tech: 'JWT, Bearer Tokens, Bcrypt, Middleware Guards',
        },
        {
          title: 'Schema Validation & Sanitization',
          desc: 'Strict type validation on all incoming request bodies and parameters preventing injection and malformed state.',
          tech: 'Zod, Joi, TypeScript typeguards',
        },
      ],
      metrics: [
        { label: 'API P95 Latency', value: '< 24 ms' },
        { label: 'Error Rate', value: '< 0.01%' },
        { label: 'Security Score', value: 'A+' },
      ],
    },
    {
      id: 'backend-services',
      title: 'Backend Development & Server Logic',
      subtitle: 'Node.js, Asynchronous Workflows & Microservices',
      iconName: 'Server',
      pipelineStage: 'STAGE 3: BACKEND SERVICES',
      summary:
        'Robust server-side application logic implemented with Node.js and TypeScript. Features non-blocking I/O event loops, worker threads, asynchronous task dispatching, and external third-party integrations.',
      keyConcepts: [
        {
          title: 'Node.js Non-Blocking Event Loop',
          desc: 'High-throughput asynchronous processing capable of sustaining thousands of concurrent network connections with minimal memory overhead.',
          tech: 'Node.js Runtime, libuv, Async/Await',
        },
        {
          title: 'Decoupled Service Architecture',
          desc: 'Modular service layer segregating business logic, payment handling, notification dispatch, and telemetry ingestion.',
          tech: 'Service Layer Pattern, Dependency Injection',
        },
        {
          title: 'Background Job Queues & Automation',
          desc: 'Offloading compute-intensive tasks, PDF generation, bulk email dispatch, and data transformations away from the primary request thread.',
          tech: 'BullMQ, Redis Queues, Node Cluster',
        },
      ],
      metrics: [
        { label: 'Concurrency', value: '10K+ Req/sec' },
        { label: 'Memory Per Worker', value: '< 65 MB' },
        { label: 'CPU Utilization', value: 'Sub-40%' },
      ],
    },
    {
      id: 'database-firebase',
      title: 'Database Systems & Firebase Integration',
      subtitle: 'Firebase Auth, Firestore, Relational DBs & Realtime Data',
      iconName: 'Database',
      pipelineStage: 'STAGE 4: DATA PERSISTENCE',
      summary:
        'Comprehensive database design and Firebase cloud services. Incorporates Firebase Authentication, Firestore document collections, Realtime Database syncing, Cloud Messaging (FCM), and relational SQL architectures.',
      keyConcepts: [
        {
          title: 'Firebase Suite Integration',
          desc: 'Production implementation of Firebase Auth (OAuth & email/password), Firestore NoSQL document models, and Firebase Cloud Messaging for push notifications.',
          tech: 'Firebase Auth, Firestore, FCM, Firebase Admin SDK',
        },
        {
          title: 'Relational Database Design',
          desc: 'Normalized relational schemas with foreign key constraints, composite indexing, transactions, and migration management.',
          tech: 'PostgreSQL, MySQL, Prisma ORM, Sequelize',
        },
        {
          title: 'Real-Time Data Streams & Sync',
          desc: 'Live listener subscriptions and WebSocket broadcasts instantly propagating state changes to all connected client applications.',
          tech: 'Firestore onSnapshot, Socket.io, Redis Pub/Sub',
        },
      ],
      metrics: [
        { label: 'Query P95 Latency', value: '< 8 ms' },
        { label: 'Data Replication', value: 'Multi-AZ' },
        { label: 'Cache Hit Rate', value: '92.4%' },
      ],
    },
    {
      id: 'deployment-infra',
      title: 'Deployment Architecture & Infrastructure',
      subtitle: 'CI/CD Pipelines, Cloud Hosting & Container Automation',
      iconName: 'GitBranch',
      pipelineStage: 'STAGE 5: DEPLOYMENT INFRASTRUCTURE',
      summary:
        'Automated software delivery pipelines and cloud hosting infrastructure. Leverages GitHub Actions for automated testing and linting, Vercel edge deployment networks, Docker containerization, and DNS/SSL configuration.',
      keyConcepts: [
        {
          title: 'CI/CD Automated Pipelines',
          desc: 'Continuous integration running TypeScript verification, unit testing, and automated zero-downtime production deployment on git push.',
          tech: 'GitHub Actions, Vercel Git Integration, Bash Scripts',
        },
        {
          title: 'Edge Distribution & Global CDN',
          desc: 'Static asset caching and serverless function execution distributed close to global users for immediate page delivery.',
          tech: 'Vercel Edge Network, Cloudflare CDN, AWS S3/CloudFront',
        },
        {
          title: 'Environment & Secrets Management',
          desc: 'Encrypted runtime environment variables, key rotation, and isolated staging/production configurations.',
          tech: 'Vercel Secrets, .env Encryption, IAM Roles',
        },
      ],
      metrics: [
        { label: 'Deploy Duration', value: '< 90 sec' },
        { label: 'Downtime During Deploy', value: '0.0 sec' },
        { label: 'Edge TTFB', value: '< 35 ms' },
      ],
    },
  ],
  projects: [
    {
      id: 'vts-fleet-iot',
      title: 'Vehicle Tracking System (VTS) Fleet Cloud',
      subtitle: 'Real-Time Telematics & IoT Tracking Platform',
      badge: 'Production IoT Cloud',
      category: 'Real-Time Sync',
      status: 'Production',
      description:
        'High-concurrency vehicle telematics platform processing high-frequency GPS coordinate streams from hardware trackers, geofence breaches, and ignition state events via Node.js backend services and WebSocket pipelines.',
      architectureHighlights: [
        'Node.js asynchronous TCP/UDP socket ingestion server handling telemetry streams',
        'Redis spatial index for real-time fleet bounding-box and proximity queries',
        'Firebase Cloud Messaging (FCM) dispatching instant speeding and geofence alerts',
        'React and Leaflet mapping client rendering sub-second vehicle telemetry',
      ],
      techStack: ['Node.js', 'Express', 'Redis', 'WebSockets', 'Firebase FCM', 'PostgreSQL', 'React'],
      metrics: [
        { label: 'Packet Throughput', value: '1.2M/day' },
        { label: 'Stream Latency', value: '< 150 ms' },
        { label: 'Active Devices', value: '500+ Hardware Units' },
      ],
      githubUrl: 'https://github.com/abhisheksureshnair',
    },
    {
      id: 'telemed-portal',
      title: 'Telemedicine Clinical Cloud Platform',
      subtitle: 'HIPAA-Compliant WebRTC Consultation Hub',
      badge: 'Healthcare Cloud',
      category: 'Healthcare IoT',
      status: 'Production',
      description:
        'Secure healthcare platform providing encrypted video consultations, electronic health record (EHR) synchronization, doctor schedule management, and instant digital prescription generation.',
      architectureHighlights: [
        'WebRTC peer connection signaling server built on Node.js and Socket.io',
        'Firebase Authentication with multi-factor verification for doctor and patient access',
        'Encrypted document storage with time-limited signed download URLs',
        'Automated SMS and push notification reminders via Firebase Cloud Messaging',
      ],
      techStack: ['React', 'Next.js', 'Node.js', 'WebRTC', 'Firebase Auth', 'Firestore', 'TailwindCSS'],
      metrics: [
        { label: 'Consultations', value: '10K+ Sessions' },
        { label: 'Uptime SLA', value: '99.98%' },
        { label: 'Media Latency', value: '< 80 ms' },
      ],
      githubUrl: 'https://github.com/abhisheksureshnair',
    },
    {
      id: 'traqinn-erp',
      title: 'TraqInn Enterprise Cloud ERP',
      subtitle: 'Multi-Tenant Commercial Logistics & Workflow System',
      badge: 'Enterprise Platform',
      category: 'Enterprise Backend',
      status: 'Live Enterprise',
      description:
        'Modular commercial enterprise resource planning suite powering inventory forecasting, automated invoicing, purchase order pipelines, and role-based staff access controls.',
      architectureHighlights: [
        'Domain-driven RESTful API endpoints secured by JWT token rotation and role guards',
        'Relational database architecture with complex audit-trail logging and ACID transactions',
        'Automated background invoice PDF generation and financial reporting queues',
        'CI/CD pipeline with automated testing, linting, and staged production releases',
      ],
      techStack: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Prisma', 'React', 'Docker'],
      metrics: [
        { label: 'Daily Transactions', value: '$250K+' },
        { label: 'Query Performance', value: '< 12 ms P95' },
        { label: 'Tenants', value: 'Multi-Enterprise' },
      ],
      githubUrl: 'https://github.com/abhisheksureshnair',
    },
    {
      id: 'cloud-portfolio-infra',
      title: 'Next.js 3D WebGL Cloud Portfolio',
      subtitle: 'Edge-Rendered Interactive Portfolio Application',
      badge: 'Cloud WebGL App',
      category: 'Cloud Infrastructure',
      status: 'Production',
      description:
        'High-performance Next.js 16 WebGL 3D coastal metropolis application featuring full-stack route handlers, procedural geometry generation, client-side Three.js rendering, and automated Vercel edge deployment.',
      architectureHighlights: [
        'Next.js 16 App Router with React Three Fiber and WebGL canvas orchestration',
        'Automated CI/CD deployment via GitHub Actions and Vercel edge network',
        'Adaptive performance and dynamic GPU level-of-detail (LOD) management maintaining 60 FPS',
        'Edge-cached static assets and compressed GLTF binary geometry delivery',
      ],
      techStack: ['Next.js 16', 'React 19', 'Three.js', 'React Three Fiber', 'TypeScript', 'Vercel CDN', 'TailwindCSS'],
      metrics: [
        { label: 'Build Time', value: '10.5 sec' },
        { label: 'Target Frame Rate', value: '60+ FPS' },
        { label: 'CDN Availability', value: '100%' },
      ],
      githubUrl: 'https://github.com/abhisheksureshnair',
      liveUrl: 'https://abhisheknair.dev',
    },
  ],
};
