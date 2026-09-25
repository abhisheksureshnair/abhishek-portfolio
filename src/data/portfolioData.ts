export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  category: string;
  type: 'professional' | 'personal';
  role: string;
  year: string;
  technologies: string[];
  stack: string[]; // alias for compatibility
  description: string;
  problem?: string;
  solution?: string;
  features: string[];
  highlights: string[]; // alias for compatibility
  githubUrl?: string;
  liveUrl?: string;
  isFlagship?: boolean;
  confidentialNotice?: string;
  migrationNote?: string;
  stats?: { label: string; value: string }[];
  caseStudy?: {
    overview: string;
    architecture: string[];
    challenges: string[];
    results: string[];
  };
}

export interface ExperienceItem {
  company: string;
  officialTitle: string;
  role: string;
  department: string;
  period: string;
  location: string;
  type: string;
  description: string;
  metrics: { label: string; value: string }[];
  responsibilities: string[];
  highlights: string[];
  achievements: string[];
  domains: string[];
  projects: {
    id: string;
    title: string;
    domain: string;
    tech: string[];
    summary: string;
    keyContributions: string[];
  }[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  year?: string;
  focus?: string;
  specialization?: string;
  status?: string;
  id: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  category: string;
  skillsCovered: string[];
  credentialId?: string;
  credentialUrl?: string;
}

export interface JourneyMilestone {
  period: string;
  title: string;
  organization: string;
  role: string;
  description: string;
  type: 'education' | 'experience' | 'milestone';
  badge?: string;
}

export interface SkillCategory {
  category: string;
  description?: string;
  skills: string[];
}

export const PERSONAL_INFO = {
  name: 'Abhishek S Nair',
  monogram: 'ASN',
  // Primary Professional Identity
  title: 'Software Developer',
  subtitle: 'Web • Mobile • AI Applications',
  headline: 'Software Developer',
  tagline: 'Building modern web, mobile, desktop and AI-powered applications with a focus on practical product development, real-time systems and clean user experiences.',
  experienceStatement: '3+ Years of Software Development Experience',
  experienceYears: '3+',
  
  // Exact Company Role (Official Designation at InnSpark Solutions)
  currentRole: 'Analyst',
  officialDesignation: 'Analyst',
  currentDepartment: 'Software Development',
  currentCompany: 'InnSpark Solutions Pvt. Ltd.',
  currentPeriod: 'June 2023 – Present',
  
  // Verified About Story
  bioHeadline: 'Software Developer focused on building modern web, mobile, desktop and AI-powered applications.',
  bioStory: "I’m Abhishek S Nair, a Software Developer focused on building modern web, mobile, desktop and AI-powered applications. My experience spans frontend development, backend APIs, real-time systems, cross-platform applications and AI/LLM integrations. I enjoy turning ideas into functional products — from full-stack platforms and real-time applications to AI-powered tools and specialized development utilities.",
  bio: "I’m Abhishek S Nair, a Software Developer focused on building modern web, mobile, desktop and AI-powered applications. My experience spans frontend development, backend APIs, real-time systems, cross-platform applications and AI/LLM integrations. I enjoy turning ideas into functional products — from full-stack platforms and real-time applications to AI-powered tools and specialized development utilities.",
  
  availability: 'Available for software development roles & product engineering teams',
  location: 'Kerala, India',
  phone: '+91 9778018037',
  email: 'nairsabhishek@gmail.com',
  github: 'https://github.com/abhisheksureshnair',
  linkedin: 'https://www.linkedin.com/in/abhisheksnair',
  resumePath: '/resume.pdf',
  stats: [
    { label: 'SOFTWARE DEVELOPMENT EXP.', value: '3+' },
    { label: 'PRODUCTION APPLICATIONS', value: 'Multiple' },
    { label: 'DEVELOPMENT FOCUS', value: 'Web • Mobile • AI' },
  ]
};

// 6 Projects: 2 Personal Projects + 4 Professional Projects (strictly separated!)
export const ALL_PROJECTS: Project[] = [
  // ==========================================
  // 01 — FLOWSYNC (Personal Project)
  // ==========================================
  {
    id: 'flowsync',
    number: '01',
    title: 'FlowSync',
    subtitle: 'Full Stack Project Management & Team Collaboration Platform',
    tagline: 'Realtime Team Collaboration & AI-Powered Project Management',
    type: 'personal',
    category: 'FULL STACK • WEB • REAL-TIME',
    role: 'Creator & Full Stack Developer (Independent Personal Project)',
    year: '2024',
    isFlagship: true,
    description: 'Real-time team task and collaboration platform with authentication, task management, chat, dashboards and WebSocket-based communication.',
    problem: 'Engineering teams struggle with manual task prioritization, fragmented communications, and delayed sprint delivery risk detection.',
    solution: 'Engineered an all-in-one workspace uniting low-latency Socket.IO collaboration rooms with an async NVIDIA NIM AI agent that evaluates task risks, computes realistic delivery ETAs, and generates prioritized workload queues.',
    technologies: [
      'React',
      'Vite',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Socket.IO',
      'JWT',
      'REST APIs'
    ],
    stack: [
      'React',
      'Vite',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Socket.IO',
      'JWT',
      'REST APIs'
    ],
    features: [
      'Authentication with secure JWT authorization',
      'Task management and collaborative sprint planning boards',
      'Team collaboration rooms and channels',
      'Dashboard analytics with productivity telemetry',
      'Real-time messaging via Socket.IO WebSockets',
      'AI task analysis powered by NVIDIA NIM / LLM APIs',
      'Recommended tasks and automated workload balancing',
      'Priority analysis and proactive sprint blocker detection',
      'Risk analysis scoring to highlight delivery bottlenecks',
      'Productivity insights with sprint velocity telemetry',
      'ETA calculation with OpenRouteService spatial routing integration',
      'AI chat assistant for context-driven sprint queries',
      'REST APIs designed with Express and MongoDB Atlas'
    ],
    highlights: [
      'Independent personal full-stack MERN demonstration',
      'NVIDIA NIM / LLM API task analysis & proactive risk scoring',
      'Low-latency Socket.IO real-time team messaging & rooms',
      'REST APIs and MongoDB database architecture'
    ],
    githubUrl: 'https://github.com/abhisheksureshnair',
    stats: [
      { label: 'Category', value: 'FULL STACK • WEB • REAL-TIME' },
      { label: 'Latency', value: '<42ms' },
      { label: 'Project Type', value: 'Personal Build' }
    ],
    caseStudy: {
      overview: 'FlowSync is an independent personal project developed to demonstrate high-performance real-time telemetry, WebSocket synchronizations, and generative AI agents working in tandem with modern UI design.',
      architecture: [
        'Frontend: High-response React SPA built with Vite, Material UI, animated using GSAP & Motion.',
        'Backend: Scalable Node.js & Express server orchestrating Socket.IO broadcast channels and JWT security.',
        'Database: MongoDB Atlas cluster with Mongoose ORM for user profiles, tasks, chats, and sprint telemetry.',
        'AI Layer: Async LLM worker pipeline utilizing NVIDIA NIM APIs for predictive task risk calculation and priority queues.',
        'Spatial Telemetry: OpenRouteService APIs calculating realistic commute and routing ETAs for field tasks.'
      ],
      challenges: [
        'Preventing state drift across multiple concurrent Socket.IO rooms during rapid task updates.',
        'Balancing AI token consumption and response latency during real-time sprint risk analyses.',
        'Designing seamless offline fallback mechanisms for task caching when network signals dip.'
      ],
      results: [
        'Achieved sub-50ms message delivery across live collaboration channels.',
        'Built automated task risk scoring providing proactive sprint blocker alerts.',
        'Demonstrated a complete MERN + AI + WebSockets architecture.'
      ]
    }
  },

  // ==========================================
  // 02 — ECHO DESKTOP AI (Personal Project)
  // ==========================================
  {
    id: 'echo-desktop-ai',
    number: '02',
    title: 'Echo Desktop AI',
    subtitle: 'AI Desktop Assistant & Browser Co-Pilot',
    tagline: 'Cross-Platform AI Desktop Assistant & Browser Co-Pilot',
    type: 'personal',
    category: 'AI • DESKTOP • LLM',
    role: 'Creator & Developer (Independent Personal Project)',
    year: '2024',
    isFlagship: true,
    description: 'AI-powered desktop application focused on conversational interaction, LLM integration and intelligent application workflows.',
    problem: 'Standard AI tools are constrained inside disconnected browser tabs, forcing developers to continuously copy-paste code snippets, documentation, and context.',
    solution: 'Designed a lightweight cross-platform desktop overlay that detects active applications, pairs with multi-browser extensions (Chrome, Brave, Edge, Firefox), and delivers contextual summarization, code extraction, and multi-model AI responses.',
    technologies: [
      'Electron.js',
      'React',
      'Vite',
      'Node.js',
      'Browser Extensions',
      'LLM Integration'
    ],
    stack: [
      'Electron.js',
      'React',
      'Vite',
      'Node.js',
      'Browser Extensions',
      'LLM Integration'
    ],
    features: [
      'Cross-platform desktop AI assistant built on Electron and React',
      'Floating assistant interface with multi-monitor support',
      'Active application detection to adapt context automatically',
      'Browser extensions for Chrome, Brave, Edge, and Firefox',
      'AI chat with streaming conversational interface',
      'Summarization of active web pages and long articles',
      'Explanation of technical concepts and system workflows',
      'Translation across multilingual developer documentation',
      'Code-snippet extraction from active browser windows',
      'AI provider/model configuration (API keys, base URL, temperature)',
      'Desktop/browser IPC communication bridge'
    ],
    highlights: [
      'Independent personal AI desktop software project',
      'Ambient floating island interface with multi-monitor support',
      'Active application detection and browser extension bridge (Chrome, Brave, Edge, Firefox)',
      'Code extraction, summarization, explanation, and model provider configuration'
    ],
    githubUrl: 'https://github.com/abhisheksureshnair/echo-desktop-ai',
    stats: [
      { label: 'Category', value: 'AI • DESKTOP • LLM' },
      { label: 'Environment', value: 'Electron Desktop' },
      { label: 'Project Type', value: 'Personal Build' }
    ]
  },

  // ==========================================
  // 03 — VEHICLE TRACKING SYSTEM (Professional)
  // ==========================================
  {
    id: 'vts-gps-tracking',
    number: '03',
    title: 'Vehicle Tracking System (VTS)',
    subtitle: 'Real-Time GPS Tracking & Fleet Monitoring',
    tagline: 'Real-Time GPS Tracking & Fleet Monitoring',
    type: 'professional',
    category: 'APPLICATION • GPS • REAL-TIME',
    role: 'Software Development — InnSpark Solutions Pvt. Ltd.',
    year: '2023 – 2024',
    description: 'Vehicle tracking and monitoring application providing live location, vehicle status, route/history information and alert-oriented functionality.',
    technologies: [
      'Flutter',
      'React Native',
      'Google Maps API',
      'WebSockets',
      'GPS',
      'Geofencing'
    ],
    stack: [
      'Flutter',
      'React Native',
      'Google Maps API',
      'WebSockets',
      'GPS',
      'Geofencing'
    ],
    migrationNote: 'The core mobile codebase was migrated from React Native to Flutter for enhanced rendering performance.',
    features: [
      'Live GPS location with real-time marker telemetry',
      'Vehicle tracking with speed, ignition, and fuel telemetry',
      'Geofencing alerts with polygon boundary breach detection',
      'Route history inspection with timestamp logs',
      'Route playback trails with interactive playback controls',
      'Vehicle status indicators (idling, moving, stopped, offline)',
      'Real-time location updates streamed over WebSockets'
    ],
    highlights: [
      'Delivered as part of professional employment at InnSpark Solutions Pvt. Ltd.',
      'Core mobile application migrated from React Native to Flutter',
      'Live GPS vehicle tracking and interactive route playback trails',
      'Polygon geofence alerts and real-time WebSocket telemetry updates'
    ],
    confidentialNotice: 'Commercial project delivered at InnSpark Solutions Pvt. Ltd. Proprietary client credentials and internal keys are protected.',
    stats: [
      { label: 'Category', value: 'APPLICATION • GPS • REAL-TIME' },
      { label: 'Engine', value: 'Flutter & Google Maps' },
      { label: 'Project Type', value: 'Professional Work' }
    ]
  },

  // ==========================================
  // 04 — TELEMEDICINE APPLICATION (Professional)
  // ==========================================
  {
    id: 'telemedicine-platform',
    number: '04',
    title: 'Telemedicine Application',
    subtitle: 'Real-Time Virtual Care & Bluetooth Medical IoT',
    tagline: 'Real-Time Virtual Care & Bluetooth Medical IoT',
    type: 'professional',
    category: 'APPLICATION • HEALTHCARE • REAL-TIME',
    role: 'Software Development — InnSpark Solutions Pvt. Ltd.',
    year: '2023 – 2024',
    description: 'Telemedicine platform featuring Bluetooth BLE medical device vitals capture, real-time doctor-patient communication and health data synchronization.',
    technologies: [
      'React Native',
      'Bluetooth BLE',
      'Socket.IO',
      'WebSockets',
      'Healthcare IoT'
    ],
    stack: [
      'React Native',
      'Bluetooth BLE',
      'Socket.IO',
      'WebSockets',
      'Healthcare IoT'
    ],
    features: [
      'BLE medical-device vitals capture directly from diagnostic hardware',
      'Real-time vitals monitoring during consultations',
      'Doctor-patient communication workflows',
      'Real-time chat with instant message synchronization',
      'Video consultation signaling and appointment management',
      'Real-time synchronization over Socket.IO and WebSockets'
    ],
    highlights: [
      'Delivered as part of professional employment at InnSpark Solutions Pvt. Ltd.',
      'Cross-platform application built with React Native for Android and iOS',
      'Hardware Bluetooth BLE medical device integration for vitals capture',
      'Low-latency WebSockets & Socket.IO signaling for virtual consultations'
    ],
    confidentialNotice: 'Commercial healthcare project delivered at InnSpark Solutions Pvt. Ltd. Patient data is confidential.',
    stats: [
      { label: 'Category', value: 'APPLICATION • HEALTHCARE • REAL-TIME' },
      { label: 'Sync', value: 'Socket.IO & BLE' },
      { label: 'Project Type', value: 'Professional Work' }
    ]
  },

  // ==========================================
  // 05 — SAFENET (Professional)
  // ==========================================
  {
    id: 'safenet-parental-control',
    number: '05',
    title: 'SafeNet',
    subtitle: 'Parental Control & Device Management',
    tagline: 'Parental Control & Device Management',
    type: 'professional',
    category: 'APPLICATION • SECURITY',
    role: 'Software Development — InnSpark Solutions Pvt. Ltd.',
    year: '2024',
    description: 'Device management and parental oversight application featuring screen-time policies, app restrictions, and usage monitoring via platform APIs.',
    technologies: [
      'React Native',
      'Android Platform APIs',
      'Device Admin APIs',
      'Accessibility Services',
      'Security'
    ],
    stack: [
      'React Native',
      'Android Platform APIs',
      'Device Admin APIs',
      'Accessibility Services',
      'Security'
    ],
    features: [
      'Parental control policies and device pairing',
      'Screen-time policies with scheduled lockouts',
      'App blocking leveraging Android administrative capabilities',
      'Usage analytics and screen-time telemetry breakdowns',
      'Device management architecture implemented via React Native'
    ],
    highlights: [
      'Delivered as part of professional employment at InnSpark Solutions Pvt. Ltd.',
      'React Native application utilizing Android platform APIs',
      'Device Admin APIs & Accessibility Services for screen-time enforcement',
      'Security architecture and app restriction rules'
    ],
    confidentialNotice: 'Commercial application delivered at InnSpark Solutions Pvt. Ltd.',
    stats: [
      { label: 'Category', value: 'APPLICATION • SECURITY' },
      { label: 'Architecture', value: 'React Native & Platform APIs' },
      { label: 'Project Type', value: 'Professional Work' }
    ]
  },

  // ==========================================
  // 06 — BLUETOOTH BLE DEBUGGER (Professional)
  // ==========================================
  {
    id: 'bluetooth-debugger',
    number: '06',
    title: 'Bluetooth Debugger',
    subtitle: 'BLE Discovery & Hardware Diagnostics',
    tagline: 'BLE Discovery & Hardware Diagnostics Tool',
    type: 'professional',
    category: 'DEVELOPER TOOL • BLUETOOTH • BLE',
    role: 'Software Development — InnSpark Solutions Pvt. Ltd.',
    year: '2023',
    description: 'Diagnostic utility for scanning, connecting and inspecting GATT services and characteristics on Bluetooth Low Energy hardware peripherals.',
    technologies: [
      'React Native',
      'react-native-ble-manager',
      'Bluetooth BLE'
    ],
    stack: [
      'React Native',
      'react-native-ble-manager',
      'Bluetooth BLE'
    ],
    features: [
      'BLE device discovery with live RSSI signal strength monitoring',
      'GATT data inspection with hierarchical service/characteristic tree',
      'Hardware diagnostics and binary data payload inspection',
      'Bluetooth debugging workflow for embedded IoT firmware engineers'
    ],
    highlights: [
      'Delivered as part of professional employment at InnSpark Solutions Pvt. Ltd.',
      'Specialized engineering tool built in React Native using react-native-ble-manager',
      'High-speed BLE discovery and GATT characteristic data inspection',
      'Custom hardware diagnostics workflow'
    ],
    confidentialNotice: 'Internal hardware tooling project delivered at InnSpark Solutions Pvt. Ltd.',
    stats: [
      { label: 'Category', value: 'DEVELOPER TOOL • BLUETOOTH • BLE' },
      { label: 'Protocol', value: 'BLE GATT Services' },
      { label: 'Project Type', value: 'Professional Work' }
    ]
  }
];

// Exact Professional Experience Information (Source of Truth)
export const PROFESSIONAL_EXPERIENCE_DATA: ExperienceItem = {
  company: 'InnSpark Solutions Pvt. Ltd.',
  officialTitle: 'Analyst',
  role: 'Analyst',
  department: 'Software Development',
  period: 'June 2023 – Present',
  location: 'Kerala, India',
  type: 'Full-Time Professional Employment',
  description: 'Contributing to software development projects involving application development, feature implementation, integrations, debugging, testing and technical problem solving.',
  metrics: [
    { label: 'Software Development Exp', value: '3+' },
    { label: 'Production Applications', value: 'Multiple' },
    { label: 'Technical Focus', value: 'Web • Mobile • AI' },
    { label: 'Real-Time Systems', value: 'WebSockets & BLE' },
  ],
  responsibilities: [
    'Contributing to software development projects involving application development, feature implementation, integrations, debugging, testing and technical problem solving.',
    'Implementing cross-platform application features using React Native and Flutter for Android and iOS deployments.',
    'Integrating real-time communication systems using Socket.IO and WebSockets for live telemetry and data synchronization.',
    'Integrating Bluetooth Low Energy (BLE) scanning, medical-device vitals capture, and custom GATT characteristic handling.',
    'Implementing live GPS tracking, route history, route playback trails, and geofencing alert functionality with Google Maps API.',
    'Integrating platform APIs for device management and administrative service functionality in mobile applications.',
    'Designing robust REST API client integrations and local caching mechanisms.',
    'Collaborating across engineering teams to diagnose, debug, and resolve complex application issues.'
  ],
  highlights: [
    'Contributing to software development projects across healthcare, logistics, and consumer security domains.',
    'Implementing cross-platform features using React Native and Flutter for Android and iOS targets.',
    'Building real-time data synchronization using Socket.IO and WebSockets.',
    'Integrating Bluetooth Low Energy (BLE) scanning and medical device vitals capture.',
    'Implementing GPS tracking, route history, and geofencing alerts with Google Maps API.'
  ],
  achievements: [
    'Contributed to multiple production software applications deployed across enterprise environments.',
    'Migrated core vehicle tracking application from React Native to Flutter for optimized map rendering and telemetry performance.',
    'Implemented real-time WebSocket communication flows for live virtual care consultations.',
    'Integrated hardware Bluetooth BLE diagnostic device communication for real-time vitals ingestion.',
    'Implemented security-oriented platform API integrations for device management and screen-time monitoring.'
  ],
  domains: [
    'Application Development',
    'Real-Time Telemetry & Systems',
    'Healthcare & IoT Integration',
    'Logistics & Fleet Tracking'
  ],
  projects: [
    {
      id: 'prof-telemedicine',
      title: 'Telemedicine Application',
      domain: 'Healthcare & Real-Time',
      tech: ['React Native', 'Bluetooth BLE', 'Socket.IO', 'WebSockets'],
      summary: 'Healthcare application enabling doctor-patient communication, real-time consultation signaling, and BLE medical-device vitals capture.',
      keyContributions: [
        'Built real-time consultation signaling using WebSockets and Socket.IO',
        'Implemented Bluetooth BLE medical-device vitals capture'
      ]
    },
    {
      id: 'prof-fleet-tracking',
      title: 'Vehicle Tracking System (VTS)',
      domain: 'GPS & Real-Time Logistics',
      tech: ['Flutter', 'React Native', 'Google Maps API', 'WebSockets', 'GPS', 'Geofencing'],
      summary: 'Fleet monitoring application providing live GPS tracking, route history, route playback trails, and geofencing alerts. Codebase migrated from React Native to Flutter.',
      keyContributions: [
        'Streamed live vehicle coordinates over WebSockets with Google Maps integration',
        'Migrated core mobile codebase from React Native to Flutter'
      ]
    },
    {
      id: 'prof-safenet',
      title: 'SafeNet Device Security',
      domain: 'Device Security & Policy',
      tech: ['React Native', 'Android Platform APIs', 'Device Admin APIs', 'Accessibility Services'],
      summary: 'Device management application providing screen-time policies, app restrictions, and usage telemetry via platform APIs.',
      keyContributions: [
        'Implemented platform API bridges in React Native for device management',
        'Built screen-time policy and app restriction logic'
      ]
    },
    {
      id: 'prof-ble-debugger',
      title: 'Bluetooth Debugger',
      domain: 'Hardware Diagnostics Tool',
      tech: ['React Native', 'react-native-ble-manager', 'Bluetooth BLE'],
      summary: 'Diagnostic utility used to discover nearby Bluetooth Low Energy peripherals, inspect GATT characteristics, and verify hardware packet transfers.',
      keyContributions: [
        'Built BLE device discovery with live RSSI signal monitoring',
        'Implemented GATT characteristic read/write inspection tree'
      ]
    }
  ]
};

// Exact Verified Skill Categories (Audit Approved - Broad Software Developer)
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'FRONTEND',
    description: 'Modern, reactive web interfaces and component systems',
    skills: ['JavaScript (ES6+)', 'React.js', 'Vite', 'HTML5', 'CSS3', 'Responsive UI Development']
  },
  {
    category: 'BACKEND',
    description: 'Server architectures, microservices, and live data contracts',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'WebSockets', 'Socket.IO', 'JWT Authentication']
  },
  {
    category: 'MOBILE & CROSS-PLATFORM',
    description: 'Cross-platform application development deployed to Android and iOS',
    skills: ['React Native', 'Flutter', 'Android', 'iOS']
  },
  {
    category: 'DATABASES',
    description: 'Document and relational data modeling and live stores',
    skills: ['MongoDB', 'MySQL', 'Firebase Realtime Database']
  },
  {
    category: 'AI & GENERATIVE AI',
    description: 'LLM orchestration, prompt pipelines, and intelligent workflows',
    skills: ['LLM Integration', 'NVIDIA LLM API', 'Prompt Engineering', 'AI Application Development', 'AI-Assisted Feature Development', 'Machine Learning Fundamentals']
  },
  {
    category: 'APIS & INTEGRATIONS',
    description: 'Third-party APIs, hardware protocols, and cloud services',
    skills: ['Google Maps API', 'GPS', 'Bluetooth BLE', 'Firebase Authentication', 'Push Notifications', 'Geofencing']
  },
  {
    category: 'DESKTOP & CROSS-PLATFORM',
    description: 'Cross-platform desktop application systems',
    skills: ['Electron.js']
  },
  {
    category: 'TOOLS',
    description: 'Engineering workflows, version control, and testing tools',
    skills: ['Git', 'GitHub', 'VS Code', 'Postman']
  },
  {
    category: 'AI DEVELOPMENT TOOLS',
    description: 'AI-assisted development environments and productivity tools',
    skills: ['ChatGPT', 'OpenAI Codex', 'NVIDIA LLMs', 'Stitch']
  }
];

export const AI_SKILLS = [
  {
    title: 'LLM Integration & Orchestration',
    description: 'Connecting full-stack web, mobile, and desktop applications to modern LLM endpoints with structured JSON schemas and streaming outputs.'
  },
  {
    title: 'NVIDIA NIM / LLM APIs',
    description: 'Utilizing NVIDIA NIM accelerated model microservices for high-throughput task intelligence and automated risk scoring in FlowSync.'
  },
  {
    title: 'Prompt Engineering',
    description: 'Designing robust system personas, defensive formatting, token optimization, and deterministic structured outputs.'
  },
  {
    title: 'AI Application Development',
    description: 'Building end-to-end intelligent software such as Echo Desktop AI and FlowSync with context-aware workflows.'
  },
  {
    title: 'AI Assistants & Browser Co-Pilots',
    description: 'Engineering ambient desktop overlays (Echo Desktop AI) that capture active application context and multi-browser selections.'
  },
  {
    title: 'Machine Learning Fundamentals',
    description: 'Foundational concepts in algorithms, regression models, classification workflows, and model evaluation techniques.'
  }
];

export const JOURNEY_TIMELINE: JourneyMilestone[] = [
  {
    period: '2020 – 2023',
    title: 'BSc Computer Science',
    organization: 'Mannam Memorial NSS College',
    role: 'Undergraduate Student',
    description: 'Graduated with strong foundations in computer science, data structures, algorithms, object-oriented programming, and relational database systems.',
    type: 'education',
    badge: 'Core CS Degree'
  },
  {
    period: 'June 2023 – Present',
    title: 'Analyst — Software Development',
    organization: 'InnSpark Solutions Pvt. Ltd.',
    role: 'Analyst (Software Development)',
    description: 'Contributing to software development projects involving application development, feature implementation, integrations, debugging, testing and technical problem solving.',
    type: 'experience',
    badge: 'Official Employment'
  },
  {
    period: '2024 – 2026',
    title: 'Master of Computer Applications (MCA) — AI Specialization',
    organization: 'Manipal University Jaipur',
    role: 'Graduate Student (Pursuing)',
    description: 'Pursuing MCA with a specialization in Artificial Intelligence, distributed computing architectures, and machine learning algorithms.',
    type: 'education',
    badge: 'MCA — AI Specialization'
  },
  {
    period: '2024 – Present',
    title: 'Independent / Personal Development',
    organization: 'FlowSync & Echo Desktop AI',
    role: 'Independent Development',
    description: 'Independent software builds demonstrating full-stack web platforms, real-time WebSocket collaboration, and generative AI LLM integrations.',
    type: 'milestone',
    badge: 'Independent Projects'
  }
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    id: 'mca-manipal',
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Manipal University Jaipur',
    period: '2024 – 2026',
    year: '2024 – 2026',
    focus: 'Artificial Intelligence, Deep Learning, Distributed Computing',
    specialization: 'Artificial Intelligence Specialization',
    status: 'Pursuing'
  },
  {
    id: 'bsc-mannam',
    degree: 'Bachelor of Science (BSc) in Computer Science',
    institution: 'Mannam Memorial NSS College',
    period: '2020 – 2023',
    year: '2020 – 2023',
    focus: 'Computer Science, Data Structures & Algorithms, DBMS',
    specialization: 'Computer Science, Data Structures & Algorithms',
    status: 'Graduated'
  }
];

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    id: 'cert-packt-react',
    title: 'React Basics and Initial Projects',
    issuer: 'Packt',
    issued: '2024',
    category: 'Frontend Engineering',
    skillsCovered: ['React.js', 'Component Architecture', 'Hooks', 'State Management', 'Vite'],
    credentialUrl: 'https://www.udemy.com/certificate/UC-packt-react'
  },
  {
    id: 'cert-ibm-python-ai',
    title: 'Python for Data Science, AI & Development',
    issuer: 'IBM',
    issued: '2024',
    category: 'AI & Data Science',
    skillsCovered: ['Python', 'NumPy', 'Pandas', 'Data Analysis', 'REST APIs', 'AI Development'],
    credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/ibm-python'
  },
  {
    id: 'cert-microsoft-ai-capstone',
    title: 'Advanced AI and Machine Learning Techniques and Capstone',
    issuer: 'Microsoft',
    issued: '2025',
    category: 'Artificial Intelligence',
    skillsCovered: ['Machine Learning', 'Deep Learning Concepts', 'Model Evaluation', 'AI Architecture'],
    credentialUrl: 'https://learn.microsoft.com/api/credentials/share/certificate'
  },
  {
    id: 'cert-ibm-ml-capstone',
    title: 'Machine Learning Capstone',
    issuer: 'IBM',
    issued: '2025',
    category: 'Machine Learning',
    skillsCovered: ['Supervised Learning', 'Unsupervised Clustering', 'Model Tuning', 'Applied ML'],
    credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/ibm-ml'
  }
];

// Compatibility aliases
export const SELECTED_PROJECTS = ALL_PROJECTS;
export const PROFESSIONAL_EXPERIENCE = PROFESSIONAL_EXPERIENCE_DATA;
export const EDUCATION = EDUCATION_DATA;
export const CERTIFICATIONS = CERTIFICATIONS_DATA;
export const TECHNOLOGY_UNIVERSE = SKILL_CATEGORIES;
export const TECHNICAL_TOOLBOX = SKILL_CATEGORIES;

export const WHAT_I_BUILD = [
  {
    number: '01',
    title: 'Full-Stack Web Development',
    summary: 'React.js • Node.js • Express • MongoDB • REST APIs',
    details: 'Independent full-stack product development using React, Vite, Node.js, Express.js, MongoDB, and REST APIs.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Vite']
  },
  {
    number: '02',
    title: 'Application Development',
    summary: 'React Native • Flutter • Cross-Platform Applications',
    details: 'Cross-platform mobile and multi-target applications built using React Native and Flutter for Android and iOS.',
    tech: ['React Native', 'Flutter', 'Android', 'iOS', 'Cross-Platform']
  },
  {
    number: '03',
    title: 'Real-Time Systems',
    summary: 'WebSockets • Socket.IO • Live Data • Notifications',
    details: 'Low-latency telemetry streaming, event-driven WebSocket communication, and live collaborative data synchronization.',
    tech: ['WebSockets', 'Socket.IO', 'Live Data', 'Notifications']
  },
  {
    number: '04',
    title: 'AI & LLM Integration',
    summary: 'NVIDIA LLM APIs • LLM Integration • Prompt Engineering',
    details: 'Connecting web, desktop, and mobile applications to modern LLMs, NVIDIA NIM accelerated microservices, and prompt pipelines.',
    tech: ['NVIDIA LLM APIs', 'LLM Integration', 'Prompt Engineering', 'AI Applications']
  },
  {
    number: '05',
    title: 'API & Cloud Integrations',
    summary: 'REST APIs • Firebase • Google Maps • Authentication',
    details: 'Third-party API architecture, OAuth/JWT secure authentication, Firebase real-time stores, and mapping services.',
    tech: ['REST APIs', 'Firebase', 'Google Maps', 'Authentication', 'JWT']
  },
  {
    number: '06',
    title: 'Developer Tools & Specialized Systems',
    summary: 'BLE • GPS • Desktop Applications • Technical Utilities',
    details: 'Bluetooth Low Energy GATT packet inspection, live GPS fleet telematics, and cross-platform desktop applications.',
    tech: ['BLE', 'GPS', 'Desktop Applications', 'Electron.js', 'Technical Utilities']
  }
];
