export interface Project {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: 'Full-Stack' | 'AI' | 'Mobile' | 'Real-Time';
  isFlagship?: boolean;
  description: string;
  problem: string;
  solution: string;
  stack: string[];
  highlights: string[];
  githubUrl: string;
  liveUrl?: string;
  stats?: { label: string; value: string }[];
  caseStudy?: {
    overview: string;
    architecture: string[];
    challenges: string[];
    results: string[];
  };
}

export interface ProfessionalProject {
  id: string;
  title: string;
  domain: string;
  tech: string[];
  summary: string;
  keyContributions: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year?: string;
  focus?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  credentialId: string;
  credentialUrl?: string;
  category: string;
  skillsCovered: string[];
}

export const PERSONAL_INFO = {
  name: 'Abhishek S Nair',
  headline: 'Full-Stack Developer',
  tagline: 'Building Web, Mobile & AI products.',
  bio: 'Full-Stack Developer with 3+ years of professional experience building real products across web, mobile, backend, and AI. Specialist in React, React Native, Flutter, Node.js, Express, MongoDB, WebSockets, REST APIs, and AI integrations.',
  location: 'India',
  availability: 'Available for full-stack engineering roles & product teams',
  email: 'nairsabhishek@gmail.com',
  phone: '+91 9778018037',
  github: 'https://github.com/abhisheksureshnair',
  linkedin: 'https://linkedin.com/in/abhisheksnair',
  resumePath: '/api/resume',
  stats: [
    { label: 'Years Experience', value: '3+', isNumeric: true },
    { label: 'Production Mobile Apps', value: '5+', isNumeric: true },
    { label: 'Full-Stack · Web · Mobile · AI', value: null, isNumeric: false },
  ]
};

export const SELECTED_PROJECTS: Project[] = [
  {
    id: 'flowsync',
    number: '01',
    title: 'FlowSync',
    tagline: 'AI-Powered Real-Time Team Collaboration & Task Intelligence Platform',
    category: 'Full-Stack',
    isFlagship: true,
    description: 'A flagship full-stack project management and real-time messaging suite powered by NVIDIA NIM/LLM AI for automated task risk analysis, priority queueing, and team productivity telemetry.',
    problem: 'Engineering teams struggle with manual task prioritization, fragmented communications, and lack of foresight regarding sprint delivery bottlenecks.',
    solution: 'Engineered a unified workspace uniting low-latency Socket.IO team rooms with an AI assistant that evaluates task complexity, predicts risk accumulation, and auto-generates priority queues.',
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'JWT', 'NVIDIA NIM', 'OpenRouteService', 'GSAP'],
    highlights: [
      'NVIDIA NIM LLM integration for automated task risk & priority scoring',
      'Real-time team rooms & messaging powered by low-latency Socket.IO WebSockets',
      'Interactive analytics dashboard with productivity insights & risk charts',
      'OpenRouteService spatial routing integration for field task optimization'
    ],
    githubUrl: 'https://github.com/abhisheksureshnair',
    stats: [
      { label: 'Latency', value: '<42ms' },
      { label: 'Architecture', value: 'MERN + AI' }
    ],
    caseStudy: {
      overview: 'FlowSync was developed as a flagship personal project to demonstrate how modern AI models (NVIDIA NIM) and real-time WebSockets transform project management into a proactive intelligence suite.',
      architecture: [
        'Frontend: Modular React SPA styled with high-contrast Tailwind CSS, animated via Motion & GSAP.',
        'Backend: Node.js & Express server managing Socket.IO rooms for low-latency state sync.',
        'Database: MongoDB Atlas with Mongoose ORM for user accounts, sprint telemetry, and message logs.',
        'AI Layer: Async pipeline with NVIDIA NIM LLM APIs performing sentiment analysis, task risk estimation, and workload balance recommendations.'
      ],
      challenges: [
        'Syncing real-time WebSocket state across team rooms without creating state drift in React.',
        'Optimizing LLM token limits and response latency during live task breakdown generation.',
        'Designing intuitive fallbacks for network dropouts and offline updates.'
      ],
      results: [
        'Automated ticket risk scoring to highlight sprint blockers before delivery deadlines.',
        'Delivered sub-50ms messaging latency across active team rooms.',
        'Built a complete end-to-end production architecture uniting web, backend, database, and generative AI.'
      ]
    }
  },
  {
    id: 'echo-desktop-ai',
    number: '02',
    title: 'Echo Desktop AI',
    tagline: 'Cross-Platform Personal AI Desktop Companion & Web Page Co-pilot',
    category: 'AI',
    isFlagship: true,
    description: 'A native desktop application built with Electron, React, and Vite that operates as a sleek floating island on your desktop and morphs into a native web page co-pilot during web browsing.',
    problem: 'Standard AI interfaces are locked inside browser tabs, breaking developer workflow and requiring constant context copy-pasting.',
    solution: 'Built a lightweight desktop overlay with customizable local and cloud AI providers (NVIDIA NIM, custom OpenAI endpoints) that seamlessly captures browser context.',
    stack: ['Electron', 'React', 'Vite', 'JavaScript', 'JWT Auth', 'NVIDIA NIM', 'Tailwind CSS'],
    highlights: [
      'Sleek floating island overlay snapped directly to desktop workspace',
      'Custom AI model onboarding (API key, base URL, temperature control)',
      'Session-secured JWT authentication & context persistence',
      'Cross-platform desktop distribution for Windows and macOS'
    ],
    githubUrl: 'https://github.com/abhisheksureshnair/echo-desktop-ai',
    stats: [
      { label: 'Platform', value: 'Electron Desktop' },
      { label: 'AI Endpoints', value: 'Custom + NIM' }
    ]
  },
  {
    id: 'livesync',
    number: '03',
    title: 'LiveSync',
    tagline: 'Monorepo Family Safety, Real-Time Location & Digital Wellbeing Suite',
    category: 'Real-Time',
    description: 'A cross-platform monorepo application (iOS, Android, Web) for secure real-time family location sharing, emergency geofence boundary alerts, and digital wellbeing management.',
    problem: 'Family locator applications are often sluggish, battery-heavy, and lack cross-platform consistency between mobile and web clients.',
    solution: 'Designed a battery-optimized background GPS telemetry engine in React Native combined with a Web dashboard, using Socket.IO for low-latency coordinate streaming.',
    stack: ['React Native 0.86', 'React Web 19.2', 'Express 4.21', 'Socket.IO', 'MongoDB', 'Geofencing'],
    highlights: [
      'Monorepo supporting iOS, Android, and Web clients seamlessly',
      'High-precision background GPS tracking with battery optimization',
      'Instant geofence zone entry/exit notifications via WebSockets'
    ],
    githubUrl: 'https://github.com/abhisheksureshnair/LiveSync',
    stats: [
      { label: 'Platforms', value: 'iOS / Android / Web' },
      { label: 'Sync Rate', value: 'Live Stream' }
    ]
  },
  {
    id: 'alphapulse-stock-ai',
    number: '04',
    title: 'AlphaPulse Stock AI',
    tagline: 'Multi-Agent AI Stock Analysis & Portfolio Management System',
    category: 'AI',
    description: 'An AI-powered stock market intelligence platform pairing a high-performance Python FastAPI backend with dual mobile frontends in Flutter and React Native.',
    problem: 'Retail investors lack access to real-time algorithmic technical analysis and hedge-fund-level multi-agent market insights.',
    solution: 'Integrated technical indicator algorithms (RSI, MACD) with multi-agent LLM insights into a unified FastAPI backend feeding mobile frontends.',
    stack: ['FastAPI', 'Python', 'Flutter', 'React Native', 'RSI / MACD Analysis', 'Multi-Agent LLMs'],
    highlights: [
      'Python FastAPI backend executing real-time technical indicators',
      'Multi-agent AI investment insights for portfolio risk assessment',
      'Dual mobile frontends in Flutter and React Native'
    ],
    githubUrl: 'https://github.com/abhisheksureshnair/AlphaPulse-Stock-AI',
    stats: [
      { label: 'Backend', value: 'FastAPI / Python' },
      { label: 'Frontends', value: 'Flutter + React Native' }
    ]
  },
  {
    id: 'neon-kinetic',
    number: '05',
    title: 'Neon Kinetic Vehicle Tracking',
    tagline: 'Fleet Telematics & Live GPS Diagnostics System',
    category: 'Mobile',
    description: 'A professional-grade real-time vehicle tracking mobile app featuring live map telemetry, historical trip playback, engine health diagnostics, and smart geofence alerts.',
    problem: 'Fleet managers need instant visibility into vehicle coordinates, fuel levels, and driver routes without cumbersome hardware tools.',
    solution: 'Built a sleek Flutter app with Google Maps integration, rendering live telemetry markers, speed stats, fuel health metrics, and trip playback trails.',
    stack: ['Flutter', 'Dart', 'Google Maps API', 'Live GPS', 'Vehicle Diagnostics', 'Geofencing'],
    highlights: [
      'High-precision live GPS location map visualizer',
      'Dynamic dashboard monitoring fuel levels, speed, and engine health',
      'Interactive trip playback with route trail visualization'
    ],
    githubUrl: 'https://github.com/abhisheksureshnair/vehicle-tracking-app-flutter',
    stats: [
      { label: 'Framework', value: 'Flutter / Dart' },
      { label: 'Domain', value: 'Fleet Telematics' }
    ]
  }
];

export const PROFESSIONAL_EXPERIENCE = {
  company: 'InnSpark Solutions Pvt. Ltd.',
  role: 'Analyst — Software Development',
  period: 'Jun 2023 – Present',
  type: 'Full-Time Professional Role',
  description: 'Serving as a core software developer responsible for designing, building, and deploying 5+ production mobile and web software applications across telemedicine, fleet telematics, consumer safety, and Bluetooth IoT systems.',
  achievements: [
    'Engineered and deployed 5+ production mobile applications to the Google Play Store and Apple App Store using React Native and Flutter.',
    'Architected low-latency real-time communication systems using Socket.IO and WebSockets for live video/audio signaling, location streaming, and telemetry updates.',
    'Implemented hardware-level Bluetooth Low Energy (BLE) peripheral scanning, RSSI signal mapping, and custom GATT service characteristic parsers.',
    'Built resilient offline-first data caching systems and location tracking services optimized for minimal background battery consumption.',
    'Collaborated closely with cross-functional teams to translate complex business requirements into scalable frontend architectures and REST API contracts.'
  ],
  projects: [
    {
      id: 'prof-telemedicine',
      title: 'Telemedicine & Virtual Care Platform',
      domain: 'Healthcare & Telemedicine',
      tech: ['React Native', 'WebSockets', 'Node.js', 'Express'],
      summary: 'A production mobile healthcare application facilitating secure doctor-patient video/audio consultation signaling, appointment scheduling, and electronic medical record sync.',
      keyContributions: [
        'Built real-time consultation signaling using WebSockets',
        'Designed HIPAA-compliant mobile user flows and patient profile management'
      ]
    },
    {
      id: 'prof-fleet-tracking',
      title: 'Enterprise GPS Vehicle Tracking System',
      domain: 'Logistics & Telematics',
      tech: ['Flutter', 'Google Maps API', 'Socket.IO', 'Geofencing'],
      summary: 'A commercial fleet telematics application providing real-time vehicle map tracking, trip route playback, geofence boundary violation alerts, and driver behavior insights.',
      keyContributions: [
        'Streamed live vehicle coordinates over Socket.IO with dynamic map markers',
        'Implemented custom route history playback with speed and stop indicators'
      ]
    },
    {
      id: 'prof-safenet',
      title: 'SafeNet Security & Parental Control Suite',
      domain: 'Parental Control & Security',
      tech: ['React Native', 'Background Services', 'Geofencing', 'Firebase'],
      summary: 'A cross-platform mobile security application providing real-time location monitoring, app usage restriction rules, geofenced safe zone notifications, and emergency SOS alerts.',
      keyContributions: [
        'Implemented background location tracking with low power consumption',
        'Developed safe zone geofence entry/exit detection logic'
      ]
    },
    {
      id: 'prof-ble-debugger',
      title: 'Bluetooth BLE Diagnostic & IoT Manager',
      domain: 'Bluetooth / Hardware IoT',
      tech: ['React Native BLE Manager', 'Custom GATT Parser', 'Android/iOS Native Bridge'],
      summary: 'A hardware diagnostic tool used to scan nearby Bluetooth Low Energy peripherals, map RSSI signal attenuation, read/write custom GATT characteristics, and inspect binary payload buffers.',
      keyContributions: [
        'Wrote custom binary packet parser for IoT sensor data streams',
        'Visualized live RSSI signal strength to evaluate device proximity'
      ]
    }
  ]
};

export const WHAT_I_BUILD = [
  {
    number: '01',
    title: 'WEB APPLICATIONS',
    summary: 'Building responsive, high-performance web applications and dynamic dashboards.',
    details: 'Expertise in React, JavaScript (ES6+), Vite, Tailwind CSS, state management, and REST API integrations.',
    tech: ['React', 'JavaScript (ES6+)', 'Vite', 'Tailwind CSS']
  },
  {
    number: '02',
    title: 'MOBILE APPLICATIONS',
    summary: 'Cross-platform mobile applications for Android and iOS.',
    details: 'Production deployments using React Native and Flutter, with offline-first caching and app store management.',
    tech: ['React Native', 'Flutter & Dart', 'iOS & Android', 'GetX']
  },
  {
    number: '03',
    title: 'BACKEND & REAL-TIME',
    summary: 'Scalable APIs, authentication, databases, and real-time telemetry systems.',
    details: 'Architecting Node.js/Express servers, Python FastAPI endpoints, MongoDB data models, and low-latency Socket.IO rooms.',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'FastAPI', 'JWT']
  },
  {
    number: '04',
    title: 'AI APPLICATIONS',
    summary: 'LLM-powered applications, multi-agent reasoning, and intelligent workflows.',
    details: 'Integrating NVIDIA NIM APIs, OpenAI endpoints, prompt engineering, and desktop AI assistants.',
    tech: ['NVIDIA NIM', 'OpenAI API', 'Multi-Agent LLMs', 'Prompt Engineering']
  },
  {
    number: '05',
    title: 'CONNECTED SYSTEMS',
    summary: 'BLE, GPS, geofencing, maps, and device hardware integrations.',
    details: 'Hardware-level Bluetooth Low Energy peripheral communication, background GPS location streaming, and desktop Electron apps.',
    tech: ['Bluetooth BLE', 'GPS Telemetry', 'Geofencing Engine', 'Google Maps API', 'Electron']
  }
];

export const TECHNICAL_TOOLBOX = [
  {
    category: 'FRONTEND',
    skills: ['React', 'JavaScript (ES6+)', 'Vite', 'React Router', 'Material UI', 'Tailwind CSS', 'HTML5 / CSS3']
  },
  {
    category: 'MOBILE',
    skills: ['React Native', 'Flutter', 'Dart', 'Android (Gradle)', 'iOS (Xcode)', 'GetX', 'App Store / Play Store']
  },
  {
    category: 'BACKEND',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'WebSockets', 'Socket.IO', 'FastAPI (Python)', 'JWT Security']
  },
  {
    category: 'DATABASE',
    skills: ['MongoDB', 'Mongoose ORM', 'Firebase Firestore', 'Redis Basics']
  },
  {
    category: 'AI & ML',
    skills: ['LLM Integration', 'NVIDIA NIM APIs', 'OpenAI API', 'Prompt Engineering', 'Multi-Agent Workflows']
  },
  {
    category: 'INTEGRATIONS',
    skills: ['Google Maps API', 'OpenRouteService API', 'Bluetooth BLE', 'GPS Telemetry', 'Geofencing Engine', 'Push Notifications']
  },
  {
    category: 'DESKTOP',
    skills: ['Electron', 'Browser Extensions', 'IPC Native Bridge']
  },
  {
    category: 'TOOLS & DEVOPS',
    skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'Docker Basics', 'npm / pnpm']
  }
];

export const EDUCATION: Education[] = [
  {
    id: 'edu-mca',
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Indira Gandhi National Open University (IGNOU)',
    year: 'Pursuing',
    focus: 'Advanced Computing, Software Engineering, Distributed Systems'
  },
  {
    id: 'edu-bsc',
    degree: 'Bachelor of Science — Computer Science',
    institution: 'University of Kerala',
    year: '2022',
    focus: 'Core CS Fundamentals, Algorithms, Database Management'
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-packt-react',
    title: 'React — The Complete Guide (incl. React Router & Redux)',
    issuer: 'Packt',
    issued: 'Jun 2024',
    credentialId: 'UC-PACKT-REACT-2024',
    credentialUrl: 'https://www.udemy.com/certificate/UC-packt-react',
    category: 'Frontend Engineering',
    skillsCovered: ['React', 'React Router', 'Redux', 'Hooks', 'State Management']
  },
  {
    id: 'cert-ibm-gen-ai',
    title: 'Generative AI: Introduction and Applications',
    issuer: 'IBM',
    issued: 'Aug 2024',
    credentialId: 'IBM-GENAI-INTRO-2024',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/ibm-genai',
    category: 'AI & Machine Learning',
    skillsCovered: ['Generative AI', 'Foundation Models', 'Prompt Engineering', 'LLMs']
  },
  {
    id: 'cert-ibm-python-ai',
    title: 'Python for Data Science, AI & Development',
    issuer: 'IBM',
    issued: 'Mar 2024',
    credentialId: 'IBM-PYTHON-DS-2024',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/ibm-python',
    category: 'AI & Machine Learning',
    skillsCovered: ['Python', 'NumPy', 'Pandas', 'Data Analysis', 'AI Development']
  },
  {
    id: 'cert-microsoft-azure',
    title: 'Microsoft Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    issued: 'Jan 2024',
    credentialId: 'AZ900-MSFT-2024',
    credentialUrl: 'https://learn.microsoft.com/api/credentials/share/certificate',
    category: 'Cloud Computing',
    skillsCovered: ['Azure Services', 'Cloud Concepts', 'Security & Compliance', 'Pricing']
  },
  {
    id: 'cert-qmul-cs',
    title: 'Introduction to Computer Science and Programming',
    issuer: 'Queen Mary University of London',
    issued: 'Dec 2023',
    credentialId: 'QMUL-CS-INTRO-2023',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/qmul-cs',
    category: 'Computer Science',
    skillsCovered: ['Algorithms', 'Data Structures', 'Software Design Patterns', 'Python']
  }
];
