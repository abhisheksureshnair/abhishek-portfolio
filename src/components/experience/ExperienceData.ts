export type ExperienceMode = "dual" | "mobile" | "fullstack";

export type ProjectClassification = "professional" | "personal";

export interface ExperienceProject {
  id: string;
  type: ProjectClassification;
  categoryTag: string; // e.g., "MOBILE / IOT", "FULL STACK / AI"
  title: string;
  role: string;
  year: string;
  deliveryContext: string;
  description: string;
  longDescription: string;
  metrics: string[];
  tags: string[];
  accentColor: string;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
}

export interface CapabilityCategory {
  title: string;
  type: "mobile" | "fullstack" | "realtime";
  subtitle: string;
  skills: { name: string; level: number; note: string }[];
}

export const EXPERIENCE_DATA = {
  hero: {
    name: "ABHISHEK S NAIR",
    shortName: "ABHISHEK",
    title: "Software Developer",
    officialRole: "Analyst — InnSpark Solutions Pvt. Ltd. (Software Development)",
    tagline: "SOFTWARE DEVELOPER • WEB • MOBILE • AI APPLICATIONS",
    subtagline: "3+ Years of Software Development Experience",
    statement: "Building modern web, mobile, desktop and AI-powered applications with a focus on practical product development, real-time systems and clean user experiences.",
    status: "Software Developer & Analyst",
    timecode: "LIVE ● 60 FPS",
    mobileSkills: [
      { name: "React Native", tag: "Mobile", color: "#61dafb" },
      { name: "Flutter", tag: "Cross-Platform", color: "#02569b" },
      { name: "Android Target", tag: "Platform", color: "#3ddc84" },
      { name: "iOS Target", tag: "Platform", color: "#ffffff" },
      { name: "Bluetooth BLE", tag: "IoT", color: "#0077ff" },
    ],
    fullstackSkills: [
      { name: "React.js", tag: "Frontend", color: "#61dafb" },
      { name: "Node.js", tag: "Runtime", color: "#68a063" },
      { name: "Express.js", tag: "Backend", color: "#ffffff" },
      { name: "MongoDB", tag: "Database", color: "#47a248" },
      { name: "Socket.IO", tag: "Real-Time", color: "#010101" },
      { name: "AI / LLM", tag: "Intelligence", color: "#ff8c00" },
    ],
  },

  stats: [
    { label: "Software Development Exp.", value: "3+", detail: "Professional Experience" },
    { label: "Production Applications", value: "Multiple", detail: "Software Systems & Builds" },
    { label: "Development Focus", value: "Web • Mobile • AI", detail: "Broad Stack Breadth" },
    { label: "Real-Time Telemetry", value: "Sub-50ms", detail: "BLE GATT & WebSockets" },
  ],

  projects: [
    // ==========================================
    // 01 — FLOWSYNC (Personal Project)
    // ==========================================
    {
      id: "flowsync-platform",
      type: "personal" as ProjectClassification,
      categoryTag: "FULL STACK • WEB • REAL-TIME",
      title: "FLOWSYNC — COLLABORATIVE SAAS & AI",
      role: "Creator & Full Stack Developer (Independent Build)",
      year: "2024",
      deliveryContext: "Independent Personal Project",
      description: "Real-time team task and collaboration platform with authentication, task management, chat, dashboards and WebSocket-based communication.",
      longDescription: "Architected FlowSync from scratch as an end-to-end full stack web application showcasing scalable SaaS patterns. Built a reactive React frontend with Vite and Motion, backed by an Express/Node.js API with MongoDB Atlas storage and JWT authentication. Engineered an intelligent AI assistant powered by NVIDIA NIM LLM APIs providing automated task breakdown, risk prediction, productivity recommendations, and ETA estimation. Features live bi-directional Socket.IO team messaging and OpenRouteService geographic routing.",
      metrics: ["React + Node.js + MongoDB + Socket.IO", "NVIDIA NIM / LLM AI Task Analytics", "Independent Full-Stack Architecture"],
      tags: ["React", "Vite", "Node.js", "Express.js", "MongoDB", "Socket.IO", "JWT", "REST APIs"],
      accentColor: "#f59e0b",
      featured: true,
      githubUrl: "https://github.com/Abhisheknair7/FlowSync",
    },

    // ==========================================
    // 02 — ECHO DESKTOP AI (Personal Project)
    // ==========================================
    {
      id: "echo-desktop-ai",
      type: "personal" as ProjectClassification,
      categoryTag: "AI • DESKTOP • LLM",
      title: "ECHO DESKTOP AI — COPILOT SUITE",
      role: "Creator & Developer (Independent Build)",
      year: "2024",
      deliveryContext: "Independent Personal Project",
      description: "AI-powered desktop application focused on conversational interaction, LLM integration and intelligent application workflows.",
      longDescription: "Engineered Echo Desktop AI as an independent personal productivity platform. Built on Electron.js, React, and Vite, the application runs a lightweight floating assistant with active window detection and multi-monitor positioning. Designed companion browser extensions for Chrome, Brave, Edge, and Firefox that extract web page context, snippets, and articles for instant AI summarization, code explanation, translation, and structured prompt pipelines with local and cloud LLM providers.",
      metrics: ["Electron.js + React Multi-Window App", "4 Browser Extensions: Chrome, Brave, Edge, Firefox", "Active Process Context Extraction"],
      tags: ["Electron.js", "React", "Vite", "Node.js", "Browser Extensions", "LLM Integration"],
      accentColor: "#ec4899",
      featured: true,
      githubUrl: "https://github.com/abhisheksureshnair/echo-desktop-ai",
    },

    // ==========================================
    // 03 — VEHICLE TRACKING SYSTEM (Professional)
    // ==========================================
    {
      id: "gps-vehicle-tracking",
      type: "professional" as ProjectClassification,
      categoryTag: "APPLICATION • GPS • REAL-TIME",
      title: "VEHICLE TRACKING SYSTEM (VTS)",
      role: "Software Development — InnSpark Solutions Pvt. Ltd.",
      year: "2023 – 2024",
      deliveryContext: "Delivered at InnSpark Solutions Pvt. Ltd.",
      description: "Vehicle tracking and monitoring application providing live location, vehicle status, route/history information and alert-oriented functionality.",
      longDescription: "Engineered and delivered a vehicle tracking mobile application at InnSpark Solutions. Migrated the core mobile codebase from React Native to Flutter for enhanced 60 FPS map rendering and route animation. Integrated Google Maps API with live WebSocket streams for location updates, multi-polygon geofencing alerts, and historical route telemetry playback across Android and iOS.",
      metrics: ["Codebase Migrated: React Native to Flutter", "Live GPS Telemetry Sync", "Historical Route Playback Engine"],
      tags: ["Flutter", "React Native", "Google Maps API", "WebSockets", "GPS", "Geofencing"],
      accentColor: "#ff4d00",
      featured: true,
    },

    // ==========================================
    // 04 — TELEMEDICINE APPLICATION (Professional)
    // ==========================================
    {
      id: "telemedicine-application",
      type: "professional" as ProjectClassification,
      categoryTag: "APPLICATION • HEALTHCARE • REAL-TIME",
      title: "TELEMEDICINE APPLICATION",
      role: "Software Development — InnSpark Solutions Pvt. Ltd.",
      year: "2023 – 2024",
      deliveryContext: "Delivered at InnSpark Solutions Pvt. Ltd.",
      description: "Telemedicine platform featuring Bluetooth BLE medical device vitals capture, real-time doctor-patient communication and health data synchronization.",
      longDescription: "Contributed to the cross-platform application for a telemedicine platform at InnSpark Solutions. Built hardware communication routines connecting Bluetooth Low Energy (BLE) medical diagnostic devices directly to the mobile application via GATT characteristics. Integrated Socket.IO and WebSockets for low-latency live doctor-patient consultations, real-time chat, and synchronized vitals telemetry without exposing private patient data.",
      metrics: ["Bluetooth BLE GATT Vitals Ingestion", "Real-Time Socket.IO Synchronization", "Zero Exposure of Private Data"],
      tags: ["React Native", "Bluetooth BLE", "Socket.IO", "WebSockets", "Healthcare IoT"],
      accentColor: "#00e5ff",
      featured: true,
    },

    // ==========================================
    // 05 — SAFENET (Professional)
    // ==========================================
    {
      id: "safenet-parental-control",
      type: "professional" as ProjectClassification,
      categoryTag: "APPLICATION • SECURITY",
      title: "SAFENET — DEVICE MANAGEMENT & SECURITY",
      role: "Software Development — InnSpark Solutions Pvt. Ltd.",
      year: "2024",
      deliveryContext: "Delivered at InnSpark Solutions Pvt. Ltd.",
      description: "Device management and parental oversight application featuring screen-time policies, app restrictions, and usage monitoring via platform APIs.",
      longDescription: "Engineered a device management application at InnSpark Solutions using React Native bridged with Android Platform APIs (Device Administration and Accessibility Services). Implemented real-time application monitoring, dynamic app blocking policies, configurable screen-time schedules, and background analytics logging to provide parents comprehensive oversight over protected devices.",
      metrics: ["Android Device Admin API Bridge", "Real-Time App Blocking & Screen Time", "Encrypted Usage Analytics"],
      tags: ["React Native", "Android Platform APIs", "Device Admin APIs", "Accessibility Services", "Security"],
      accentColor: "#10b981",
      featured: true,
    },

    // ==========================================
    // 06 — BLUETOOTH BLE DEBUGGER (Professional)
    // ==========================================
    {
      id: "bluetooth-debugger",
      type: "professional" as ProjectClassification,
      categoryTag: "DEVELOPER TOOL • BLUETOOTH • BLE",
      title: "BLUETOOTH BLE DEBUGGER",
      role: "Software Development — InnSpark Solutions Pvt. Ltd.",
      year: "2023",
      deliveryContext: "Delivered at InnSpark Solutions Pvt. Ltd.",
      description: "Diagnostic utility for scanning, connecting and inspecting GATT services and characteristics on Bluetooth Low Energy hardware peripherals.",
      longDescription: "Developed an internal engineering diagnostic utility built with React Native and react-native-ble-manager. Empowers developers and QA engineers to perform peripheral discovery, RSSI signal mapping, service discovery, MTU negotiation, and live read/write/notify operations on custom GATT characteristics during medical and logistics IoT hardware bring-up.",
      metrics: ["Live GATT Characteristic Inspection", "Raw Byte Hex/ASCII Parser", "Continuous RSSI Signal Monitor"],
      tags: ["React Native", "react-native-ble-manager", "Bluetooth BLE", "Hardware Diagnostics"],
      accentColor: "#818cf8",
      featured: true,
    },
  ],

  telemetryDemo: {
    title: "REAL-TIME TELEMETRY COMPARISON",
    subtitle: "From Raw BLE / GPS Data Stream to Production Spatial Analytics",
    description: "Drag the slider to compare raw unparsed BLE GATT byte streams and GPS NMEA strings directly with Abhishek's processed real-time telemetry dashboard, geofence polygons, and vital metrics visualization.",
    beforeLabel: "Raw Packet Telemetry (GATT / NMEA)",
    afterLabel: "Live Processed Telemetry & Geofence",
  },

  terminalCommands: [
    {
      cmd: "whoami",
      output: "Abhishek S Nair\nProfessional Title: Software Developer\nPositioning: Web • Mobile • AI Applications\nOfficial Role: Analyst — InnSpark Solutions Pvt. Ltd. (Software Development)\nExperience: 3+ Years of Software Development Experience",
    },
    {
      cmd: "skills",
      output:
        "Frontend: JavaScript (ES6+), React.js, Vite, HTML5, CSS3, Responsive UI\nBackend: Node.js, Express.js, REST APIs, WebSockets, Socket.IO, JWT\nMobile & Cross-Platform: React Native, Flutter, Android, iOS\nDatabases: MongoDB, MySQL, Firebase Realtime Database\nAI & Generative AI: LLM Integration, NVIDIA LLM API, Prompt Engineering\nAPIs & Integrations: Google Maps API, GPS, Bluetooth BLE, Firebase Authentication\nDesktop: Electron.js\nTools: Git, GitHub, VS Code, Postman",
    },
    {
      cmd: "projects",
      output:
        "PROJECT ORDER & FOCUS:\n  01. FlowSync (FULL STACK • WEB • REAL-TIME: React, Vite, Node.js, Express.js, MongoDB, Socket.IO, JWT, REST APIs)\n  02. Echo Desktop AI (AI • DESKTOP • LLM: Electron.js, React, Vite, Node.js, Browser Extensions, LLM Integration)\n  03. Vehicle Tracking System (APPLICATION • GPS • REAL-TIME: Flutter, React Native, Google Maps API, WebSockets, GPS, Geofencing)\n  04. Telemedicine Application (APPLICATION • HEALTHCARE • REAL-TIME: React Native, Bluetooth BLE, Socket.IO, WebSockets, Healthcare IoT)\n  05. SafeNet (APPLICATION • SECURITY: React Native, Android Platform APIs, Device Admin, App Blocking)\n  06. Bluetooth BLE Debugger (DEVELOPER TOOL • BLUETOOTH • BLE: React Native, react-native-ble-manager, Bluetooth BLE)",
    },
    {
      cmd: "experience",
      output:
        "OFFICIAL EMPLOYMENT:\nAnalyst — InnSpark Solutions Pvt. Ltd.\nArea: Software Development | June 2023 – Present\nContributing to software development projects involving application development, feature implementation, integrations, debugging, testing and technical problem solving.\n\nINDEPENDENT DEVELOPMENT:\nCreator of FlowSync (Full Stack SaaS) and Echo Desktop AI (Cross-platform desktop assistant).",
    },
    {
      cmd: "education",
      output:
        "Master of Computer Applications (MCA) — AI Specialization — Manipal University Jaipur (2024 – 2026)\nBachelor of Science in Computer Science (B.Sc.) — Mannam Memorial NSS College (2020 – 2023)",
    },
    {
      cmd: "contact",
      output:
        "Email: nairsabhishek@gmail.com\nLinkedIn: linkedin.com/in/abhisheksnair\nGitHub: github.com/abhisheksureshnair\nStatus: Available for software development roles & product engineering teams",
    },
  ],

  capabilities: [
    {
      title: "Full-Stack Web Development",
      type: "fullstack" as const,
      subtitle: "React.js • Node.js • Express • MongoDB • REST APIs",
      skills: [
        { name: "React.js & Component Architecture", level: 96, note: "Component patterns, custom hooks & reactive state" },
        { name: "Node.js & Express.js APIs", level: 92, note: "REST API design, middleware & request routing" },
        { name: "MongoDB & Data Modeling", level: 90, note: "Document schemas, indexing & queries" },
        { name: "JWT & Stateless Security", level: 90, note: "Authentication flows & endpoint authorization" },
      ],
    },
    {
      title: "Application Development",
      type: "mobile" as const,
      subtitle: "React Native • Flutter • Cross-Platform Applications",
      skills: [
        { name: "React Native (Android & iOS)", level: 96, note: "Cross-platform application features & platform integration" },
        { name: "Flutter Engine Development", level: 90, note: "High-performance UI rendering & responsive widgets" },
        { name: "Android Platform APIs & Security", level: 92, note: "Device Admin APIs & background services" },
        { name: "Cross-Platform Deployments", level: 90, note: "Build configurations & application lifecycle" },
      ],
    },
    {
      title: "Real-Time & AI Systems",
      type: "realtime" as const,
      subtitle: "WebSockets • Socket.IO • NVIDIA LLMs • Electron.js",
      skills: [
        { name: "Socket.IO & WebSockets", level: 94, note: "Sub-50ms live data synchronization & room messaging" },
        { name: "LLM Integration & Prompt Engineering", level: 92, note: "NVIDIA NIM APIs, context pipelines & structured JSON" },
        { name: "Electron.js Desktop Applications", level: 90, note: "Cross-platform desktop tools & IPC communication" },
        { name: "Hardware BLE & GPS Integrations", level: 95, note: "GATT characteristic reading & Google Maps tracking" },
      ],
    },
  ] as CapabilityCategory[],

  experience: [
    {
      period: "June 2023 — Present",
      role: "Analyst",
      organization: "InnSpark Solutions Pvt. Ltd. (Software Development)",
      badge: "PROFESSIONAL EMPLOYMENT",
      description:
        "Contributing to software development projects involving application development, feature implementation, integrations, debugging, testing and technical problem solving across cross-platform applications, real-time WebSocket systems, GPS telematics, and Bluetooth BLE hardware.",
    },
    {
      period: "2024 — Present",
      role: "Independent / Personal Development",
      organization: "FlowSync & Echo Desktop AI",
      badge: "INDEPENDENT BUILDS",
      description:
        "Building independent full-stack web platforms and intelligent desktop applications, demonstrating complete MERN architectures, real-time WebSocket collaboration, and generative AI LLM microservices.",
    },
    {
      period: "2024 — 2026",
      role: "Master of Computer Applications (MCA) — AI Specialization",
      organization: "Manipal University Jaipur",
      badge: "ACADEMICS",
      description:
        "Advanced graduate studies in artificial intelligence, distributed database architectures, cloud computing, and modern algorithmic systems.",
    },
    {
      period: "2020 — 2023",
      role: "B.Sc. in Computer Science",
      organization: "Mannam Memorial NSS College",
      badge: "ACADEMICS",
      description:
        "Graduated with foundational excellence in computer science, data structures, algorithms, object-oriented programming, and operating systems.",
    },
  ],

  socials: [
    { name: "GitHub", handle: "github.com/abhisheksureshnair", url: "https://github.com/abhisheksureshnair" },
    { name: "LinkedIn", handle: "linkedin.com/in/abhisheksnair", url: "https://www.linkedin.com/in/abhisheksnair" },
  ],

  contact: {
    email: "nairsabhishek@gmail.com",
    location: "Kerala, India • Available for Software Development Roles",
  },
};
