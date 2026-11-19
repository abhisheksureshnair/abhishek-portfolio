export interface CloudProject {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  category: 'Enterprise ERP' | 'Real-Time Sync' | 'Healthcare / WebRTC' | 'AI Systems' | 'E-Commerce';
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
  name: 'Cloud & Systems Engineering Hub',
  department: 'DISTRIBUTED SYSTEMS • CLOUD ARCHITECTURE • DEVOPS',
  title: 'CLOUD & SYSTEMS ENGINEERING HUB',
  subtitle: 'High-Availability Infrastructure, Microservices & Distributed Computing Citadel',
  overview:
    'Dedicated architectural center for high-concurrency cloud computing, container orchestration, low-latency microservices, relational and vector database systems, and end-to-end DevOps automation. Showcases production-grade engineering principles utilized across Abhishek S Nair’s real-world software platforms.',
  mission:
    'Designing fault-tolerant, horizontally scalable distributed backends that ensure sub-100ms response latencies, 99.99% uptime, zero-downtime CI/CD deployments, and bulletproof data integrity.',
  architecturalStats: {
    parcelId: 'block-2-2',
    coordinates: [40, 40],
    dimensions: [25.2, 25.2],
    storeys: 5,
    entranceDirection: 'North (facing Street Z=20 at [40, 30.5])',
    primaryStyle: 'Asymmetrical Aerodynamic Glass & Titanium Cyber-Pavilion',
  },
  infrastructureTelemetry: {
    activeNodes: 128,
    clusterHealth: '99.99% Optimal',
    avgLatencyMs: 18.4,
    uptimePercent: 99.995,
    activeDeployments: 42,
    requestsPerSecond: 14250,
  },
  zones: [
    {
      id: 'backend-architecture',
      title: 'Backend Architecture & Distributed Systems',
      subtitle: 'Microservices, Domain-Driven Design & High Concurrency',
      iconName: 'Server',
      summary:
        'Decoupled, event-driven microservices built with Node.js, Next.js Server Components, TypeScript, and Python FastAPI. Leverages clear domain boundaries, idempotent message handlers, and resilience circuit breakers.',
      keyConcepts: [
        {
          title: 'Domain-Driven Microservices',
          desc: 'Independent business services partitioned by subdomain bounded contexts with schema-enforced contracts.',
          tech: 'Node.js, Express, NestJS, FastAPI',
        },
        {
          title: 'Asynchronous Event Bus',
          desc: 'Publish/subscribe event distribution decoupling transactional writes from analytical aggregations and background tasks.',
          tech: 'Redis Pub/Sub, RabbitMQ, BullMQ',
        },
        {
          title: 'High-Concurrency Compute',
          desc: 'Non-blocking I/O event loops combined with worker threads and vectorized Python compute workers.',
          tech: 'Node.js Cluster, Python AsyncIO, Celery',
        },
      ],
      metrics: [
        { label: 'Throughput', value: '45,000 req/min' },
        { label: 'P99 Latency', value: '42 ms' },
        { label: 'Error Rate', value: '< 0.01%' },
      ],
    },
    {
      id: 'api-communication',
      title: 'API Communication & Real-Time Sync',
      subtitle: 'REST, GraphQL, WebSockets & Server-Sent Events',
      iconName: 'Network',
      summary:
        'Multi-protocol communication mesh engineered for diverse client profiles: low-overhead REST for mobile endpoints, federated GraphQL for frontend queries, and persistent WebSockets for millisecond-latency collaborative updates.',
      keyConcepts: [
        {
          title: 'Federated GraphQL Subgraphs',
          desc: 'Unified client API gateway aggregating disparate backend domain services into a single typed query graph.',
          tech: 'Apollo Federation, GraphQL Yoga, Pydantic',
        },
        {
          title: 'Full-Duplex WebSockets',
          desc: 'Bidirectional state synchronization with heartbeat reconnection, presence detection, and room isolation.',
          tech: 'Socket.IO, WS, WebRTC DataChannels',
        },
        {
          title: 'Server-Sent Events (SSE)',
          desc: 'Lightweight unidirectional streaming channels for real-time AI token streams, telemetry, and system notifications.',
          tech: 'HTTP/2 SSE, ReadableStream, FastAPI Streaming',
        },
      ],
      metrics: [
        { label: 'Concurrent WS', value: '25,000+' },
        { label: 'Message Fan-out', value: '< 8 ms' },
        { label: 'Compression', value: 'Brotli / Gzip' },
      ],
    },
    {
      id: 'cloud-infrastructure',
      title: 'Cloud Infrastructure & Containerization',
      subtitle: 'AWS Ecosystem, Docker Containers & Kubernetes Orchestration',
      iconName: 'Cloud',
      summary:
        'Containerized production deployments structured for resilience, automated horizontal pod autoscaling (HPA), zero-downtime rolling updates, and immutable infrastructure-as-code.',
      keyConcepts: [
        {
          title: 'Docker Containerization',
          desc: 'Multi-stage Docker builds optimized for minimal image sizes (<100MB), non-root execution, and security scanning.',
          tech: 'Docker, Distroless, Alpine, Docker Compose',
        },
        {
          title: 'Kubernetes Pod Orchestration',
          desc: 'Multi-replica cluster deployments with readiness/liveness probes, ConfigMaps, Secret managers, and ingress routing.',
          tech: 'Kubernetes (K8s), Helm, Ingress-NGINX',
        },
        {
          title: 'AWS Cloud Services',
          desc: 'Leverages AWS VPC multi-AZ routing, ECS Fargate serverless containers, S3 bucket versioning, CloudFront CDN, and IAM roles.',
          tech: 'AWS ECS, S3, CloudFront, Route53, IAM',
        },
      ],
      metrics: [
        { label: 'Cluster Nodes', value: 'Auto-scaled' },
        { label: 'Cold Starts', value: 'Zero (Provisioned)' },
        { label: 'Availability', value: 'Multi-AZ 99.99%' },
      ],
    },
    {
      id: 'database-storage',
      title: 'Database & High-Throughput Storage',
      subtitle: 'PostgreSQL, MongoDB Atlas, Redis & Vector Embeddings',
      iconName: 'Database',
      summary:
        'Polyglot persistence architecture aligning data models with query access patterns: ACID relational integrity for finance and inventory, document flexibility for unstructured data, in-memory caching for speed, and vector indexing for AI retrieval.',
      keyConcepts: [
        {
          title: 'PostgreSQL Relational Core',
          desc: 'Normalized schema modeling, composite B-tree indexing, foreign key constraints, connection pooling, and atomic transactions.',
          tech: 'PostgreSQL, Prisma ORM, PgBouncer, Neon',
        },
        {
          title: 'MongoDB Document Engine',
          desc: 'Horizontally sharded JSON document clusters optimized for hierarchical asset hierarchies and event logs.',
          tech: 'MongoDB Atlas, Mongoose, Aggregation Pipelines',
        },
        {
          title: 'Redis In-Memory Tier',
          desc: 'Sub-millisecond read/write caching, session persistence, distributed locks (Redlock), and sliding-window rate limiters.',
          tech: 'Redis, Upstash, Key-Value Stores',
        },
        {
          title: 'Vector Database Indexing',
          desc: 'HNSW indexing for dense 1536-dimensional embeddings enabling cosine similarity semantic searches in milliseconds.',
          tech: 'pgvector, Pinecone, ChromaDB',
        },
      ],
      metrics: [
        { label: 'Cache Hit Ratio', value: '94.2%' },
        { label: 'Query P50', value: '3.1 ms' },
        { label: 'Data Durability', value: 'Write-Ahead Log' },
      ],
    },
    {
      id: 'devops-ci-cd',
      title: 'DevOps & Automated Deployment Pipelines',
      subtitle: 'GitHub Actions, Automated Testing, Security & Observability',
      iconName: 'GitBranch',
      summary:
        'Continuous integration and deployment pipelines enforcing automated linting, unit/integration test suites, container image security vulnerability scans, and staged deployments with automated rollbacks.',
      keyConcepts: [
        {
          title: 'Automated CI/CD Pipelines',
          desc: 'GitHub Actions matrix workflows testing across Node.js and Python runtimes before building and publishing container images.',
          tech: 'GitHub Actions, Docker Buildx, Trivy',
        },
        {
          title: 'Comprehensive Test Harness',
          desc: 'Unit testing with Vitest/Jest, end-to-end user journey validation with Playwright, and load testing with k6.',
          tech: 'Vitest, Playwright, Supertest, k6',
        },
        {
          title: 'Observability & Monitoring',
          desc: 'Centralized structured JSON logging, distributed OpenTelemetry request tracing, and real-time metric dashboards.',
          tech: 'Prometheus, Grafana, Datadog, Winston, Sentry',
        },
      ],
      metrics: [
        { label: 'Build Time', value: '2.4 min avg' },
        { label: 'Test Coverage', value: '> 85%' },
        { label: 'Deploy Cadence', value: 'Continuous' },
      ],
    },
  ],
  projects: [
    {
      id: 'traqinn-erp',
      title: 'TraqInn — Asset Management & Maintenance ERP',
      subtitle: 'Enterprise-grade MERN Stack Asset Lifecycle & Preventative Maintenance Engine',
      badge: 'ENTERPRISE MERN ERP',
      category: 'Enterprise ERP',
      status: 'Live Enterprise',
      description:
        'Production asset management and preventive maintenance enterprise platform managing multi-million-dollar inventory, QR/barcode scanning, work order dispatching, and audit logging with role-based access control.',
      architectureHighlights: [
        'Multi-tenant MongoDB Atlas cluster with tenant-isolated data collections and compound indexing',
        'Express.js RESTful API engine with JWT role-based access control (RBAC) and granular permission guards',
        'Preventative maintenance cron scheduler dispatching automated work order tasks and SMS/email alerts',
        'Optimistic concurrency control and audit history trail for regulatory compliance',
        'Docker containerized deployment on cloud Linux VMs with Nginx reverse proxy and SSL auto-renewal',
      ],
      techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Docker', 'JWT', 'Nginx', 'Tailwind CSS'],
      metrics: [
        { label: 'Assets Tracked', value: '10,000+' },
        { label: 'Sync Latency', value: '< 50ms' },
        { label: 'Uptime', value: '99.98%' },
      ],
      githubUrl: 'https://github.com/Abhisheknair21',
      liveUrl: 'https://traqinn.vercel.app',
    },
    {
      id: 'flowsync-collab',
      title: 'FlowSync — Real-Time Collaborative Workspace',
      subtitle: 'Ultra-low latency collaborative document editor and state synchronization engine',
      badge: 'REAL-TIME WEBSOCKETS',
      category: 'Real-Time Sync',
      status: 'Production',
      description:
        'Modern collaborative workspace facilitating real-time multi-user document editing, cursor presence broadcasting, live chat channels, and conflict resolution using operational transformation algorithms.',
      architectureHighlights: [
        'Persistent WebSocket servers managing bi-directional message loops with heartbeat recovery',
        'Redis Pub/Sub message broker distributing live cursor and document state across distributed server instances',
        'Conflict-free operational transformation (OT) algorithm ensuring guaranteed convergence across concurrent edits',
        'In-memory document snapshot cache with periodic asynchronous writes to MongoDB for data durability',
      ],
      techStack: ['Next.js', 'WebSockets', 'Redis Pub/Sub', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
      metrics: [
        { label: 'Sync Latency', value: '< 16ms' },
        { label: 'Concurrent Users', value: '1,000+ per room' },
        { label: 'Conflict Rate', value: '0.00%' },
      ],
      githubUrl: 'https://github.com/Abhisheknair21/flowsync',
    },
    {
      id: 'telemedicine-backend',
      title: 'Telemedicine Platform — HIPAA-Compliant WebRTC',
      subtitle: 'Secure telehealth consultations with encrypted peer-to-peer video & medical records',
      badge: 'WEBRTC HEALTHCARE',
      category: 'Healthcare / WebRTC',
      status: 'Production',
      description:
        'Secure, high-reliability telehealth platform enabling encrypted doctor-patient video consultations, real-time messaging, appointment scheduling, and end-to-end encrypted medical record storage.',
      architectureHighlights: [
        'WebRTC peer-to-peer mesh with STUN/TURN server fallback for NAT traversal and encrypted media channels',
        'Signaling server built on Node.js WebSockets handling room allocation, participant state, and call negotation',
        'HIPAA-compliant document storage using AWS S3 server-side encryption with AWS KMS customer-managed keys',
        'PostgreSQL database storing patient metadata with encrypted fields and audit logging on every read access',
      ],
      techStack: ['Node.js', 'WebRTC', 'AWS S3', 'PostgreSQL', 'Express', 'Socket.IO', 'Docker', 'React'],
      metrics: [
        { label: 'Call Connection', value: '< 800ms' },
        { label: 'Encryption', value: 'AES-256 GCM' },
        { label: 'Compliance', value: 'HIPAA Ready' },
      ],
      githubUrl: 'https://github.com/Abhisheknair21',
    },
    {
      id: 'echoai-assistant',
      title: 'EchoAI — Desktop Voice Assistant & Neural Engine',
      subtitle: 'Desktop Speech-to-Text streaming and local LLM orchestration architecture',
      badge: 'DESKTOP AI ENGINE',
      category: 'AI Systems',
      status: 'Open Source',
      description:
        'High-performance desktop speech-to-text and AI copilot application orchestrating local Whisper speech models, streaming LLM completions, and vector similarity search across personal knowledge bases.',
      architectureHighlights: [
        'C++ / Python bindings for local GPU-accelerated Whisper model speech transcription with <100ms chunk latency',
        'Local SQLite + sqlite-vss vector database executing semantic search across local documents',
        'Async streaming response pipeline feeding token deltas to the frontend via IPC channels',
        'Electron desktop runtime with sandboxed multi-process architecture isolating UI from OS-level audio capture',
      ],
      techStack: ['Python', 'Electron', 'Node.js', 'Whisper', 'SQLite-VSS', 'FastAPI', 'TypeScript'],
      metrics: [
        { label: 'Transcribe Latency', value: '< 120ms' },
        { label: 'Memory Footprint', value: '< 450MB' },
        { label: 'Offline Ready', value: '100% Local' },
      ],
      githubUrl: 'https://github.com/Abhisheknair21',
    },
    {
      id: 'ecommerce-engine',
      title: 'Cloud E-Commerce Engine & Inventory Ledger',
      subtitle: 'High-volume checkout architecture with Stripe webhooks and atomic stock decrementing',
      badge: 'HIGH-CONCURRENCY COMMERCE',
      category: 'E-Commerce',
      status: 'Production',
      description:
        'Resilient full-stack e-commerce platform built to handle flash sales and high checkout concurrency without overselling, backed by distributed locks, idempotent webhooks, and Redis order queues.',
      architectureHighlights: [
        'PostgreSQL ACID transactions with pessimistic row locking ensuring atomic inventory deductions under high concurrency',
        'Stripe Webhook handler with cryptographic signature verification, idempotency key caching, and retry queues',
        'Redis distributed locking preventing race conditions during simultaneous cart checkout submissions',
        'Next.js 14 Server Components and Edge Middleware for instantaneous global product catalog caching',
      ],
      techStack: ['Next.js', 'PostgreSQL', 'Stripe API', 'Redis', 'Prisma', 'Tailwind CSS', 'Docker'],
      metrics: [
        { label: 'Checkout Success', value: '99.99%' },
        { label: 'Inventory Drift', value: '0 units' },
        { label: 'Edge TTFB', value: '28ms' },
      ],
      githubUrl: 'https://github.com/Abhisheknair21',
    },
  ],
};
