export interface JourneyStage {
  id: string;
  stageNumber: number;
  period: string;
  title: string;
  category: string;
  summary: string;
  keyTechnologies: string[];
  milestones: string[];
  themeColor: string;
}

export interface EducationExhibition {
  id: string;
  degree: string;
  field: string;
  institution: string;
  period: string;
  standing: string;
  status: 'Completed';
  summary: string;
  coursework: string[];
  accentColor: string;
}

export interface MediaWallHighlight {
  id: string;
  title: string;
  category: 'Project' | 'Specialization' | 'Philosophy' | 'Domain';
  tagline: string;
  description: string;
  tags: string[];
  accentColor: string;
}

export const ABOUT_STUDIO_METADATA = {
  id: 'about',
  title: 'ABOUT ME STUDIO',
  subtitle: 'MY STORY • EDUCATION • DEVELOPER JOURNEY',
  district: 'District 02 // Creative Exhibition Studio',
  parcelId: 'block-0-1',
  coordinates: [0.0, 0, -40.0] as [number, number, number],
  facingDirection: 'south',
  floors: 3,
  totalHeight: 14.4,

  introduction: {
    name: 'Abhishek Suresh Nair',
    role: 'Full Stack & Mobile Application Developer',
    experienceYears: '3.6 Years',
    location: 'Kochi, Kerala, India',
    profileImage: '/profile.webp',
    headline: 'Crafting high-performance digital products across mobile, web, and intelligent systems.',
    bio: 'Software Developer with 3.6 years of production experience engineering cross-platform mobile applications in Flutter and React Native, scalable full-stack web platforms in React.js and Node.js, real-time telemetry systems, and intelligent desktop software. Holds an MCA with Artificial Intelligence Specialization (72%) and a B.Sc. in Computer Science.',
    coreCompetencies: [
      'Full Stack Web Development (React.js, Node.js, Express, REST APIs)',
      'Cross-Platform Mobile Engineering (React Native, Flutter, 60 FPS UI)',
      'Hardware & IoT Communications (Bluetooth BLE GATT, Hardware Diagnostics)',
      'Real-Time Telemetry & Systems (WebSockets, Socket.IO, Google Maps API)',
      'AI & Emerging Technologies (Python, LangChain, RAG, Ollama, Vector DBs)',
      'Applied Computer Science (MCA AI Specialization - 72%, B.Sc. CS)',
    ],
  },

  journeyStages: [
    {
      id: 'beginning',
      stageNumber: 1,
      period: '2020 – 2023',
      title: 'The Beginning & Academic Foundations',
      category: 'Foundation',
      summary:
        'Ignited passion for computing, algorithmic thinking, and modern software design during undergraduate computer science studies.',
      keyTechnologies: ['C', 'Java', 'Python', 'SQL', 'Data Structures & Algorithms', 'Linux'],
      milestones: [
        'Enrolled in Bachelor of Science (B.Sc.) in Computer Science at Mannam Memorial NSS College.',
        'Mastered foundational programming principles, memory management, object-oriented design, and relational database modeling.',
        'Built initial command-line utilities and academic desktop software projects.',
        'Graduated with honors in Computer Science, solidifying core engineering principles.',
      ],
      themeColor: '#38bdf8',
    },
    {
      id: 'web-development',
      stageNumber: 2,
      period: '2022 – 2023',
      title: 'Modern Web Engineering',
      category: 'Frontend & Architecture',
      summary:
        'Transitioned into modern reactive web application development, building scalable component hierarchies and rich user interfaces.',
      keyTechnologies: ['React.js', 'JavaScript (ES6+)', 'HTML5', 'CSS3 / Tailwind', 'TypeScript', 'Next.js'],
      milestones: [
        'Mastered modern JavaScript ES6+ features, closures, promises, asynchronous event loop, and functional patterns.',
        'Architected single-page applications with React.js using hooks, context, state management, and optimized rendering.',
        'Adopted utility-first responsive styling with Tailwind CSS and Framer Motion micro-interactions.',
        'Created interactive portfolio showcases and web applications demonstrating modern UI/UX design.',
      ],
      themeColor: '#00f0ff',
    },
    {
      id: 'mobile-development',
      stageNumber: 3,
      period: '2023 – Present',
      title: 'Cross-Platform Mobile & IoT Integration',
      category: 'Mobile & Hardware',
      summary:
        'Delivered mission-critical enterprise mobile solutions at InnSpark Solutions Pvt. Ltd., integrating Bluetooth BLE hardware and GPS telemetry.',
      keyTechnologies: ['React Native', 'Flutter', 'Bluetooth BLE', 'GATT Services', 'WebSockets', 'Google Maps API'],
      milestones: [
        'Joined InnSpark Solutions Pvt. Ltd. as Software Developer in June 2023.',
        'Migrated the core Vehicle Tracking System (VTS) from React Native to Flutter for seamless 60 FPS live GPS map rendering.',
        'Engineered Telemedicine mobile platform with live Bluetooth Low Energy (BLE) GATT vitals capture from medical hardware.',
        'Built internal Bluetooth BLE Diagnostic Debugger for QA peripheral discovery, RSSI mapping, and byte-level inspection.',
        'Architected SafeNet enterprise mobile security app using React Native bridged with Android Device Admin APIs.',
      ],
      themeColor: '#f97316',
    },
    {
      id: 'fullstack-development',
      stageNumber: 4,
      period: '2023 – Present',
      title: 'Full Stack & Real-Time Backends',
      category: 'Full Stack',
      summary:
        'Engineered scalable RESTful web APIs, real-time Socket.IO synchronization layers, and complete MERN stack architectures.',
      keyTechnologies: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Socket.IO', 'JWT Auth'],
      milestones: [
        'Designed production-grade RESTful APIs with Express.js, request validation, structured error handling, and rate limiting.',
        'Implemented bi-directional real-time communication via WebSockets and Socket.IO for live logistics and tele-consultation.',
        'Modeled scalable document collections in MongoDB with optimized indexing, schema validations, and aggregation pipelines.',
        'Integrated secure JWT authentication, session handling, and encrypted payload transmission.',
      ],
      themeColor: '#10b981',
    },
    {
      id: 'current-exploration',
      stageNumber: 5,
      period: '2024 – Present',
      title: 'AI, Intelligence & Emerging Tech',
      category: 'Intelligence & Research',
      summary:
        'Expanding into applied Artificial Intelligence, Retrieval-Augmented Generation (RAG), and interactive 3D WebGL experiences.',
      keyTechnologies: ['Python', 'LangChain', 'Ollama', 'RAG', 'Three.js', 'React Three Fiber', 'Electron.js'],
      milestones: [
        'Completed Master of Computer Applications (MCA) with AI Specialization at Manipal University Jaipur (72%).',
        'Created FlowSync: collaborative SaaS platform integrating NVIDIA NIM AI LLM assistance and real-time canvas sync.',
        'Developed Echo Desktop AI: cross-platform Electron.js assistant with multi-engine LLM switching and browser integration.',
        'Architected the 3D American Metropolis interactive portfolio using Three.js, React Three Fiber, and procedural instancing.',
      ],
      themeColor: '#a855f7',
    },
  ] as JourneyStage[],

  education: [
    {
      id: 'mca-manipal',
      degree: 'Master of Computer Applications (MCA)',
      field: 'Artificial Intelligence Specialization',
      institution: 'Manipal University Jaipur',
      period: '2024 – 2026',
      standing: '72% Aggregate Score',
      status: 'Completed',
      summary:
        'Advanced postgraduate degree emphasizing artificial intelligence, distributed cloud systems, modern machine learning algorithms, and high-scale software engineering.',
      coursework: [
        'Artificial Intelligence & Machine Learning Systems',
        'Cloud Computing & Distributed Software Architecture',
        'Advanced Algorithms & Computational Complexity',
        'Enterprise Software Design Patterns & Quality Assurance',
        'Neural Networks & Natural Language Processing',
      ],
      accentColor: '#a855f7',
    },
    {
      id: 'bsc-nss',
      degree: 'Bachelor of Science (B.Sc.) in Computer Science',
      field: 'Computer Science & Software Development',
      institution: 'Mannam Memorial NSS College',
      period: '2020 – 2023',
      standing: 'Completed with Honors',
      status: 'Completed',
      summary:
        'Comprehensive undergraduate computer science foundation covering algorithms, object-oriented software engineering, relational database architecture, and computer networks.',
      coursework: [
        'Data Structures & Algorithm Design',
        'Object-Oriented Programming (Java & C++)',
        'Relational Database Management Systems (RDBMS & SQL)',
        'Operating Systems & Computer Architecture',
        'Web Technology Fundamentals (HTML5, CSS3, JavaScript)',
      ],
      accentColor: '#38bdf8',
    },
  ] as EducationExhibition[],

  mediaWallHighlights: [
    {
      id: 'profile-highlight',
      title: 'Full Stack & Mobile Craftsman',
      category: 'Philosophy',
      tagline: 'Bridging elegant user experiences with resilient engineering',
      description:
        'Dedicated to building purposeful digital solutions that solve real-world problems. Experienced across enterprise mobile development, full-stack reactive web applications, hardware IoT communications, and applied AI systems.',
      tags: ['Craftsmanship', 'Clean Code', 'Performance', 'Full Stack'],
      accentColor: '#f97316',
    },
    {
      id: 'vts-highlight',
      title: 'Vehicle Tracking System (VTS)',
      category: 'Project',
      tagline: '60 FPS Live GPS Fleet Telemetry in Flutter',
      description:
        'Engineered mission-critical fleet tracking mobile app at InnSpark Solutions. Migrated the core codebase to Flutter for fluid 60 FPS map panning, live GPS trails, and instant geofencing breach alerts.',
      tags: ['Flutter', 'Google Maps API', 'WebSockets', 'GPS'],
      accentColor: '#f59e0b',
    },
    {
      id: 'telemed-highlight',
      title: 'Telemedicine BLE Diagnostic Suite',
      category: 'Project',
      tagline: 'Direct hardware vitals synchronization via Bluetooth Low Energy',
      description:
        'Delivered cross-platform healthcare app connecting medical diagnostic devices via custom GATT characteristics, synchronizing patient vitals in real time during live doctor-patient consultations.',
      tags: ['React Native', 'Bluetooth BLE', 'Socket.IO', 'Healthcare IoT'],
      accentColor: '#00f0ff',
    },
    {
      id: 'flowsync-highlight',
      title: 'FlowSync AI Collaborative SaaS',
      category: 'Project',
      tagline: 'Full-stack collaborative workspace with NVIDIA NIM AI LLMs',
      description:
        'Architected complete SaaS productivity platform with multi-tenant collaboration, automated task breakdown via LLMs, and real-time WebSocket state synchronization.',
      tags: ['React.js', 'Node.js', 'NVIDIA NIM', 'WebSockets', 'MongoDB'],
      accentColor: '#10b981',
    },
    {
      id: 'echo-highlight',
      title: 'Echo Desktop AI Assistant',
      category: 'Project',
      tagline: 'Multi-engine intelligent desktop workspace with browser extensions',
      description:
        'Created cross-platform Electron.js desktop companion with unified LLM switching, local clipboard intelligence, and 4 dedicated browser extensions for frictionless workflow automation.',
      tags: ['Electron.js', 'React.js', 'Python / Ollama', 'AI Workflows'],
      accentColor: '#ec4899',
    },
    {
      id: 'interests-highlight',
      title: 'Continuous Innovation & Research',
      category: 'Domain',
      tagline: 'Exploring 3D graphics, local AI, and developer tools',
      description:
        'Passionate about interactive 3D WebGL simulations (Three.js / React Three Fiber), local AI model deployment (Ollama / vLLM), developer tooling, and modern software ergonomics.',
      tags: ['Three.js', 'React Three Fiber', 'RAG / LLMs', 'Developer Experience'],
      accentColor: '#a855f7',
    },
  ] as MediaWallHighlight[],
};
