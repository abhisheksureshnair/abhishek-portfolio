export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  duration: string;
  type: 'Full-Time' | 'Independent';
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  period: string;
  score: string;
  status: 'Completed';
  highlights: string[];
}

export interface TimelineMilestone {
  year: string;
  date: string;
  title: string;
  category: 'Experience' | 'Education' | 'Milestone' | 'Project';
  organization: string;
  description: string;
  tags: string[];
  badgeColor: string;
}

export interface ProfessionalLink {
  label: string;
  url: string;
  description: string;
  icon: 'github' | 'linkedin' | 'globe' | 'file-text' | 'download';
  isPrimary?: boolean;
}

export const CAREER_CENTER_METADATA = {
  id: 'career',
  title: 'CAREER & EXPERIENCE CENTER',
  subtitle: 'SOFTWARE ENGINEERING • PROFESSIONAL JOURNEY',
  district: 'District 05 // Corporate Career Institution',
  parcelId: 'block-1-2',
  coordinates: [40.0, 0, 0.0] as [number, number, number],
  facingDirection: 'west',
  floors: 8,
  totalHeight: 34.8,

  headline: {
    role: 'Software Developer',
    experienceYears: '3.6 Years',
    summary:
      '3.6 years of software development experience delivering production mobile applications, full-stack web platforms, real-time telemetry systems, and intelligent desktop software.',
  },

  technicalAreas: [
    { name: 'React.js Web Development', description: 'Component architecture, responsive state, custom hooks & high-performance WebGL interfaces' },
    { name: 'React Native Mobile Development', description: 'Cross-platform iOS/Android development, BLE GATT hardware integrations & platform bridges' },
    { name: 'Flutter Application Development', description: 'High-performance 60 FPS mobile applications, real-time map telemetry & smooth animations' },
    { name: 'JavaScript & Modern ES6+', description: 'Asynchronous event architecture, functional programming & clean modular patterns' },
    { name: 'Frontend Engineering', description: 'Modern UI/UX design, Tailwind CSS, Framer Motion, and Three.js 3D web graphics' },
    { name: 'REST API & WebSocket Integration', description: 'Scalable Express/Node.js endpoints, real-time Socket.IO sync, and secure JWT authentication' },
    { name: 'Full-Stack Development Knowledge', description: 'MERN stack architecture, MongoDB Atlas data modeling, microservices & cloud deployment' },
  ],

  experience: [
    {
      id: 'innspark-analyst',
      role: 'Software Developer',
      company: 'InnSpark Solutions Pvt. Ltd.',
      location: 'Kochi, Kerala, India',
      period: 'June 2023 – Present',
      duration: '3.6 Years Total Experience',
      type: 'Full-Time',
      summary:
        'Software Developer contributing to production application engineering, mobile cross-platform systems, IoT hardware diagnostic utilities, and real-time backend integrations.',
      highlights: [
        'Engineered Vehicle Tracking System (VTS) cross-platform mobile application, migrating core codebase from React Native to Flutter for seamless 60 FPS route mapping.',
        'Developed Telemedicine Application hardware communications connecting Bluetooth Low Energy (BLE) medical diagnostic devices via GATT characteristics.',
        'Engineered SafeNet device management security application using React Native bridged with Android Platform APIs (Device Admin & Accessibility Services).',
        'Built internal Bluetooth BLE Debugger engineering utility for GATT peripheral discovery, RSSI signal mapping, and live byte parsing.',
        'Implemented low-latency WebSocket and Socket.IO real-time data synchronization across Android and iOS production deployments.',
      ],
      technologies: [
        'React.js',
        'React Native',
        'Flutter',
        'JavaScript (ES6+)',
        'Node.js',
        'REST APIs',
        'Bluetooth BLE',
        'WebSockets',
        'Google Maps API',
        'Android Platform APIs',
      ],
    },
  ] as ExperienceItem[],

  education: [
    {
      id: 'mca-degree',
      degree: 'Master of Computer Applications (MCA)',
      field: 'AI Specialization',
      institution: 'Manipal University Jaipur',
      period: '2024 – 2026',
      score: '72%',
      status: 'Completed',
      highlights: [
        'Specialization in Artificial Intelligence, Machine Learning algorithms, and scalable distributed system design.',
        'Completed comprehensive coursework in Advanced Algorithms, Cloud Architecture, and Software Engineering methodologies.',
        'Maintained a verified 72% academic performance.',
      ],
    },
    {
      id: 'bsc-degree',
      degree: 'Bachelor of Science in Computer Science (B.Sc.)',
      field: 'Computer Science & Software Development',
      institution: 'Mannam Memorial NSS College',
      period: '2020 – 2023',
      score: 'Completed',
      status: 'Completed',
      highlights: [
        'Core computer science foundation covering data structures, object-oriented programming, relational databases, and operating systems.',
        'Developed initial full-stack web and mobile application prototypes.',
        'Graduated with honors in Computer Science.',
      ],
    },
  ] as EducationItem[],

  timeline: [
    {
      year: '2020',
      date: 'Aug 2020',
      title: 'Commenced B.Sc. in Computer Science',
      category: 'Education',
      organization: 'Mannam Memorial NSS College',
      description: 'Began undergraduate education in computer science, software design principles, and programming fundamentals.',
      tags: ['B.Sc.', 'Computer Science', 'Foundations'],
      badgeColor: '#38bdf8',
    },
    {
      year: '2023',
      date: 'May 2023',
      title: 'Graduated B.Sc. in Computer Science',
      category: 'Education',
      organization: 'Mannam Memorial NSS College',
      description: 'Completed Bachelor of Science in Computer Science with a strong foundation in modern web and software engineering.',
      tags: ['Graduation', 'B.Sc.', 'Honors'],
      badgeColor: '#10b981',
    },
    {
      year: '2023',
      date: 'June 2023',
      title: 'Joined InnSpark Solutions Pvt. Ltd.',
      category: 'Experience',
      organization: 'InnSpark Solutions Pvt. Ltd.',
      description: 'Started official software development career working on production mobile applications, IoT diagnostics, and REST API integration.',
      tags: ['Employment', 'InnSpark', 'Software Developer'],
      badgeColor: '#ec4899',
    },
    {
      year: '2023',
      date: 'Aug 2023',
      title: 'Built Bluetooth BLE Debugger',
      category: 'Project',
      organization: 'InnSpark Solutions Pvt. Ltd.',
      description: 'Engineered hardware diagnostic utility for scanning, connecting, and inspecting GATT services on medical and logistics BLE peripherals.',
      tags: ['Bluetooth BLE', 'GATT', 'React Native'],
      badgeColor: '#818cf8',
    },
    {
      year: '2023',
      date: 'Nov 2023',
      title: 'Telemedicine BLE Vitals Application',
      category: 'Project',
      organization: 'InnSpark Solutions Pvt. Ltd.',
      description: 'Delivered cross-platform healthcare telemedicine application featuring real-time BLE GATT diagnostic vitals capture and Socket.IO consultations.',
      tags: ['Healthcare IoT', 'BLE', 'Socket.IO'],
      badgeColor: '#06b6d4',
    },
    {
      year: '2024',
      date: 'Feb 2024',
      title: 'Vehicle Tracking System (VTS)',
      category: 'Project',
      organization: 'InnSpark Solutions Pvt. Ltd.',
      description: 'Migrated mission-critical GPS vehicle tracking platform from React Native to Flutter for seamless 60 FPS live route animation and geofencing.',
      tags: ['Flutter', 'Google Maps', 'WebSockets', 'GPS'],
      badgeColor: '#f59e0b',
    },
    {
      year: '2024',
      date: 'May 2024',
      title: 'SafeNet Security & Device Management',
      category: 'Project',
      organization: 'InnSpark Solutions Pvt. Ltd.',
      description: 'Engineered parental oversight and security application using React Native bridged with native Android Device Admin and Accessibility APIs.',
      tags: ['Security', 'Android APIs', 'Device Admin'],
      badgeColor: '#10b981',
    },
    {
      year: '2024',
      date: 'July 2024',
      title: 'Commenced MCA with AI Specialization',
      category: 'Education',
      organization: 'Manipal University Jaipur',
      description: 'Enrolled in Master of Computer Applications program specializing in Artificial Intelligence and Machine Learning systems.',
      tags: ['MCA', 'AI Specialization', 'Manipal'],
      badgeColor: '#a855f7',
    },
    {
      year: '2024',
      date: 'Oct 2024',
      title: 'Created FlowSync & Echo Desktop AI',
      category: 'Milestone',
      organization: 'Independent Engineering',
      description: 'Architected FlowSync (collaborative full-stack SaaS with NVIDIA NIM LLM) and Echo Desktop AI (Electron.js assistant with 4 browser extensions).',
      tags: ['FlowSync', 'Echo AI', 'Full Stack', 'Electron'],
      badgeColor: '#ec4899',
    },
    {
      year: '2026',
      date: '2026',
      title: 'Completed MCA (72%) & 3.6+ Years Software Development',
      category: 'Milestone',
      organization: 'Professional Milestone',
      description: 'Completed MCA degree with 72% aggregate score while maintaining 3.6 years of active production software engineering across Web, Mobile, and AI.',
      tags: ['MCA (72%)', '3.6 Years Exp', 'Full Stack • Mobile'],
      badgeColor: '#38bdf8',
    },
  ] as TimelineMilestone[],

  resumeLinks: [
    {
      label: 'View Resume (PDF)',
      url: '/resume.pdf',
      description: 'Open the verified production resume PDF directly in browser',
      icon: 'file-text' as const,
      isPrimary: true,
    },
    {
      label: 'Download Resume',
      url: '/resume.pdf',
      description: 'Download the verified resume PDF to your local system',
      icon: 'download' as const,
    },
    {
      label: 'Portfolio Website',
      url: 'https://abhisheksnair.vercel.app',
      description: 'Personal web development portfolio and interactive showcases',
      icon: 'globe' as const,
    },
    {
      label: 'GitHub Profile',
      url: 'https://github.com/abhisheksureshnair',
      description: 'Open source repositories, personal projects, and code contributions',
      icon: 'github' as const,
    },
    {
      label: 'LinkedIn Profile',
      url: 'https://www.linkedin.com/in/abhisheksnair',
      description: 'Professional networking, official career history, and endorsements',
      icon: 'linkedin' as const,
    },
  ] as ProfessionalLink[],
};
