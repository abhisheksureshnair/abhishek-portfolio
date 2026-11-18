export interface SkillFloorData {
  floorNumber: number | 'G' | 'R';
  floorIndex: number; // 0 for Ground, 1-8 for Floors 1-8, 9 for Roof
  floorName: string;
  department: string;
  category: string;
  themeColor: string;
  badge: string;
  summary: string;
  technologies: string[];
  skills: {
    name: string;
    description: string;
    level: string;
    projects: string[];
    link?: string;
  }[];
}

export interface SkillsTowerMetadata {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  category: string;
  blockId: string;
  center: [number, number];
  dimensions: [number, number];
  height: number;
  totalFloors: number;
  entrancePosition: [number, number];
  facingDirection: 'east';
  floors: SkillFloorData[];
}

export const SKILLS_TOWER_METADATA: SkillsTowerMetadata = {
  id: 'skills',
  name: 'Skills & Technology Tower',
  title: 'SKILLS & TECHNOLOGY TOWER',
  subtitle: 'FULL STACK • MOBILE • CLOUD • AI',
  category: 'District 04 // Technology Tower',
  blockId: 'block-1-0',
  center: [-40.0, 0.0],
  dimensions: [23.6, 23.6],
  height: 44.0, // 10 storeys (~4.0m per floor + architectural crown)
  totalFloors: 10,
  entrancePosition: [-27.6, 0.0], // East entrance facing Central Avenue & HQ
  facingDirection: 'east',
  floors: [
    {
      floorNumber: 'G',
      floorIndex: 0,
      floorName: 'Ground Floor — Welcome & Profile',
      department: 'Welcome & Profile',
      category: 'PROFILE',
      themeColor: '#38bdf8',
      badge: 'DEVELOPER OVERVIEW',
      summary: 'Welcome lobby and executive overview of Abhishek S Nair, Full Stack & Mobile Engineer.',
      technologies: ['Full Stack Architecture', 'System Design', 'Application Engineering'],
      skills: [
        {
          name: 'Developer Profile & Background',
          description: 'Passionate software engineer building end-to-end web applications, cross-platform mobile apps, and scalable cloud solutions.',
          level: 'Full Stack',
          projects: ['Portfolio Universe', 'FlowSync Platform', 'TraqInn Fleet VTS'],
          link: 'https://github.com/Abhisheknair7',
        },
        {
          name: 'Core Engineering Philosophy',
          description: 'Focusing on clean modular code, responsive interfaces, 60+ FPS interactive graphics, and deterministic backend systems.',
          level: 'Architecture',
          projects: ['EchoAI Assistant', 'Telemedicine Portal'],
        },
      ],
    },
    {
      floorNumber: 1,
      floorIndex: 1,
      floorName: 'Floor 1 — Frontend Development',
      department: 'Frontend Development',
      category: 'FRONTEND',
      themeColor: '#00f0ff',
      badge: 'CORE WEB & UI',
      summary: 'Modern, reactive, accessible user interfaces built with React.js, modern JavaScript, semantic HTML5, and responsive CSS.',
      technologies: ['React.js', 'JavaScript (ES6+)', 'HTML5', 'CSS3 / Tailwind'],
      skills: [
        {
          name: 'React.js',
          description: 'Component architecture, custom hooks, virtual DOM reconciliation, state management, and Server Components.',
          level: 'Advanced',
          projects: ['FlowSync Platform', 'Portfolio Universe', 'Telemedicine Web App'],
          link: 'https://github.com/Abhisheknair7',
        },
        {
          name: 'JavaScript (ES6+)',
          description: 'Asynchronous event loops, closures, promises, async/await, modern modules, and functional programming.',
          level: 'Advanced',
          projects: ['FlowSync', 'TraqInn VTS', 'Classic Portfolio'],
        },
        {
          name: 'HTML5 & Semantic Web',
          description: 'Semantic markup, accessible DOM hierarchies (ARIA), web performance, and HTML5 Canvas graphics.',
          level: 'Expert',
          projects: ['FlowSync', 'Portfolio 3D'],
        },
        {
          name: 'CSS3 & Tailwind CSS',
          description: 'Responsive flexbox & grid design, custom CSS variables, theme switching, and fluid typography.',
          level: 'Advanced',
          projects: ['FlowSync Platform', 'Portfolio Universe'],
        },
      ],
    },
    {
      floorNumber: 2,
      floorIndex: 2,
      floorName: 'Floor 2 — Mobile Development',
      department: 'Mobile Development',
      category: 'MOBILE',
      themeColor: '#10b981',
      badge: 'CROSS-PLATFORM APPS',
      summary: 'Production-ready mobile applications for iOS and Android using React Native and Flutter frameworks.',
      technologies: ['React Native', 'Flutter', 'Cross-Platform Mobile'],
      skills: [
        {
          name: 'React Native',
          description: 'Cross-platform native iOS & Android applications, native modules, device hardware APIs, and smooth UI animations.',
          level: 'Advanced',
          projects: ['TraqInn School Bus Tracking App', 'Telemedicine Patient App'],
          link: 'https://github.com/Abhisheknair7',
        },
        {
          name: 'Flutter',
          description: 'Compiled multi-platform UI applications with Dart, state management, and real-time GPS telemetry mapping.',
          level: 'Intermediate',
          projects: ['TraqInn Driver Fleet App'],
        },
      ],
    },
    {
      floorNumber: 3,
      floorIndex: 3,
      floorName: 'Floor 3 — Backend Development',
      department: 'Backend Development',
      category: 'BACKEND',
      themeColor: '#6366f1',
      badge: 'SERVER ARCHITECTURE',
      summary: 'Scalable server-side systems, RESTful API design, authentication pipelines, and distributed event architectures.',
      technologies: ['Node.js', 'REST APIs', 'Express.js', 'JWT Auth'],
      skills: [
        {
          name: 'Node.js & Express',
          description: 'High-throughput asynchronous servers, middleware pipelines, rate-limiting, and microservice orchestration.',
          level: 'Advanced',
          projects: ['FlowSync Backend Engine', 'TraqInn Fleet Telemetry API'],
          link: 'https://github.com/Abhisheknair7',
        },
        {
          name: 'REST API Design',
          description: 'Stateless RESTful APIs, OpenAPI/Swagger documentation, payload validation, and HTTP caching strategies.',
          level: 'Advanced',
          projects: ['TraqInn VTS', 'Telemedicine Platform'],
        },
      ],
    },
    {
      floorNumber: 4,
      floorIndex: 4,
      floorName: 'Floor 4 — Full Stack Development',
      department: 'Full Stack Development',
      category: 'FULL STACK',
      themeColor: '#a855f7',
      badge: 'MERN ARCHITECTURE',
      summary: 'End-to-end cohesive application stacks integrating MongoDB, Express, React, and Node.js with automated builds.',
      technologies: ['MERN Stack', 'Full Stack Lifecycle', 'Full Lifecycle Integration'],
      skills: [
        {
          name: 'MERN Stack Development',
          description: 'Complete full stack development tying together React frontends with Node/Express APIs and MongoDB document data.',
          level: 'Advanced',
          projects: ['FlowSync Platform', 'Telemedicine Clinic Suite'],
          link: 'https://github.com/Abhisheknair7',
        },
        {
          name: 'Full Stack Lifecycle',
          description: 'From initial database schema modeling to API contract design, frontend state management, and cloud deployment.',
          level: 'Advanced',
          projects: ['FlowSync', 'TraqInn VTS'],
        },
      ],
    },
    {
      floorNumber: 5,
      floorIndex: 5,
      floorName: 'Floor 5 — Programming Languages',
      department: 'Programming',
      category: 'LANGUAGES',
      themeColor: '#f59e0b',
      badge: 'PYTHON & JS',
      summary: 'Foundational and advanced computer science programming across Python and JavaScript ecosystems.',
      technologies: ['Python', 'JavaScript', 'Algorithms & Data Structures'],
      skills: [
        {
          name: 'Python',
          description: 'Data parsing, automation scripting, machine learning workflows, FastAPI web services, and agentic workflows.',
          level: 'Advanced',
          projects: ['EchoAI Assistant', 'AI Document Processing'],
          link: 'https://github.com/Abhisheknair7',
        },
        {
          name: 'JavaScript & TypeScript',
          description: 'Type-safe programming, complex data structures, AST transformations, and performant algorithms.',
          level: 'Advanced',
          projects: ['Portfolio Universe', 'FlowSync'],
        },
      ],
    },
    {
      floorNumber: 6,
      floorIndex: 6,
      floorName: 'Floor 6 — Databases & Integration',
      department: 'Databases & Integration',
      category: 'DATA & APIS',
      themeColor: '#14b8a6',
      badge: 'DATABASE SYSTEMS',
      summary: 'Document data modeling, schema indexing, aggregation pipelines, and third-party API integration.',
      technologies: ['MongoDB', 'API Integration', 'Data Modeling'],
      skills: [
        {
          name: 'MongoDB',
          description: 'NoSQL document design, indexing strategies, aggregation pipelines, and connection pooling.',
          level: 'Advanced',
          projects: ['FlowSync Database', 'Telemedicine Patient Registry'],
          link: 'https://github.com/Abhisheknair7',
        },
        {
          name: 'Third-Party API Integration',
          description: 'Payment gateways, SMS/Push notification providers, maps & geolocation APIs, and cloud service webhooks.',
          level: 'Advanced',
          projects: ['TraqInn GPS Telemetry', 'Telemedicine Video Call API'],
        },
      ],
    },
    {
      floorNumber: 7,
      floorIndex: 7,
      floorName: 'Floor 7 — Development Tools',
      department: 'Development Tools',
      category: 'DEVOPS & TOOLS',
      themeColor: '#ec4899',
      badge: 'TOOLING & CLOUD',
      summary: 'Version control, collaborative workflows, cloud hosting, real-time database backends, and deployment.',
      technologies: ['Git', 'GitHub', 'Firebase', 'DevOps Tools'],
      skills: [
        {
          name: 'Git & GitHub',
          description: 'Branching models, pull request reviews, merge conflict resolution, semantic versioning, and CI actions.',
          level: 'Advanced',
          projects: ['All Repositories', 'Portfolio Universe'],
          link: 'https://github.com/Abhisheknair7',
        },
        {
          name: 'Firebase',
          description: 'Real-time database, cloud firestore, authentication providers, and cloud messaging for mobile notifications.',
          level: 'Intermediate',
          projects: ['TraqInn Live Location Alerts'],
        },
      ],
    },
    {
      floorNumber: 8,
      floorIndex: 8,
      floorName: 'Floor 8 — Research & Exploration',
      department: 'Research & Exploration',
      category: 'AI & EMERGING TECH',
      themeColor: '#8b5cf6',
      badge: 'AI & INNOVATION',
      summary: 'Exploratory projects and applied research in Artificial Intelligence, RAG pipelines, and interactive 3D WebGL graphics.',
      technologies: ['Artificial Intelligence', 'RAG (Retrieval-Augmented Gen)', 'Three.js / WebGL'],
      skills: [
        {
          name: 'AI & LLM Integration',
          description: 'Prompt engineering, structured outputs, function calling, and integrating LLMs into web applications.',
          level: 'Exploratory',
          projects: ['EchoAI Desktop Assistant', 'AI Automated Summary Workflows'],
          link: 'https://github.com/Abhisheknair7',
        },
        {
          name: 'Retrieval-Augmented Generation (RAG)',
          description: 'Vector embeddings, chunking strategies, semantic retrieval, and contextual augmentation for AI assistants.',
          level: 'Exploratory',
          projects: ['EchoAI Knowledge Engine'],
        },
        {
          name: 'Interactive 3D WebGL (Three.js)',
          description: 'Real-time 3D shaders, procedural city generation, instanced mesh rendering, and camera controllers.',
          level: 'Advanced',
          projects: ['Portfolio Coastal Metropolis', 'Interactive 3D Universe'],
        },
      ],
    },
    {
      floorNumber: 'R',
      floorIndex: 9,
      floorName: 'Roof — Technology Observatory',
      department: 'Technology Observatory',
      category: 'OBSERVATORY',
      themeColor: '#f97316',
      badge: 'SKYLINE TERRACE',
      summary: 'Open-air technology observatory with panoramic views of Developer HQ, Innovation Center, and coastal downtown.',
      technologies: ['Panoramic Skyline', 'Full Skill Matrix', 'Portfolio Synthesis'],
      skills: [
        {
          name: 'Metropolitan Portfolio Synthesis',
          description: 'A holistic overview bringing together all frontend, mobile, backend, full stack, database, and AI competencies.',
          level: 'Synthesis',
          projects: ['Portfolio Coastal Metropolis', 'All Integrated Systems'],
        },
      ],
    },
  ],
};
