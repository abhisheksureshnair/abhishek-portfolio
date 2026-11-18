/**
 * AI Research & Innovation Center Metadata (Phase 2.7)
 * Authoritative research documentation, AI curriculum, demonstrations, and verified credentials.
 */

export interface AIResearchTopic {
  id: string;
  category: 'python' | 'fundamentals' | 'ml' | 'llm' | 'rag' | 'agents' | 'future';
  title: string;
  subtitle: string;
  status: 'demonstrated' | 'knowledge' | 'research_interest';
  summary: string;
  keyConcepts: string[];
  toolsAndStack: string[];
  demonstrationType?: 'interactive_graph' | 'rag_pipeline' | 'agent_loop' | 'neural_network';
}

export interface AIResearchCenterMetadata {
  id: 'ai';
  name: string;
  subtitle: string;
  parcelId: string;
  center: [number, number];
  dimensions: [number, number];
  totalFloors: number;
  height: number;
  facing: 'north';
  academicBackground: {
    degree: string;
    specialization: string;
    institution: string;
    grade: string;
    status: string;
    thesisFocus: string;
  };
  topics: AIResearchTopic[];
}

export const AI_RESEARCH_METADATA: AIResearchCenterMetadata = {
  id: 'ai',
  name: 'AI Research Center',
  subtitle: 'Artificial Intelligence • Python • Research',
  parcelId: 'block-2-1',
  center: [0.0, 40.0],
  dimensions: [23.6, 23.6],
  totalFloors: 6,
  height: 25.5,
  facing: 'north',
  academicBackground: {
    degree: 'Master of Computer Applications (MCA)',
    specialization: 'Artificial Intelligence Specialization',
    institution: 'Manipal University Jaipur',
    grade: '72% (First Class with Distinction)',
    status: 'Completed',
    thesisFocus: 'Applied Machine Learning, Intelligent Systems & Data Analytics',
  },
  topics: [
    {
      id: 'python-core',
      category: 'python',
      title: 'Python for AI & Scientific Computing',
      subtitle: 'Core Scripting, Vectorized Math & Data Pipelines',
      status: 'knowledge',
      summary: 'Proficiency in idiomatic Python 3, asynchronous event loops (asyncio), object-oriented design, and vectorized computation for machine learning workflows.',
      keyConcepts: [
        'Vectorized operations via NumPy & ndarray memory buffers',
        'Tabular data analysis & feature manipulation with Pandas',
        'Asynchronous API clients and concurrency with asyncio & aiohttp',
        'Type hinting (PEP 484), dataclasses, and Pydantic validation schemas',
      ],
      toolsAndStack: ['Python 3.11+', 'NumPy', 'Pandas', 'Pydantic', 'FastAPI', 'Pytest'],
    },
    {
      id: 'ai-fundamentals',
      category: 'fundamentals',
      title: 'Artificial Intelligence Fundamentals',
      subtitle: 'State Space Search, Heuristics & Deterministic AI',
      status: 'knowledge',
      summary: 'Foundational principles of intelligent agent architecture, classical state-space exploration, heuristic search algorithms, and rule-based decision modeling.',
      keyConcepts: [
        'A* and Dijkstra graph traversal algorithms (implemented in city vehicle routing)',
        'Minimax adversarial search with alpha-beta pruning',
        'Constraint satisfaction problems (CSP) and heuristic scoring',
        'Finite State Machines (FSM) & Behavior Trees for autonomous agent behavior',
      ],
      toolsAndStack: ['Graph Theory', 'A* Search', 'Behavior Trees', 'Decision Engines'],
    },
    {
      id: 'ml-concepts',
      category: 'ml',
      title: 'Machine Learning Concepts & Mathematics',
      subtitle: 'Supervised Learning, Loss Landscapes & Optimization',
      status: 'knowledge',
      summary: 'Core understanding of statistical learning theory, loss gradient minimization, bias-variance tradeoffs, and data regularization strategies.',
      keyConcepts: [
        'Linear & Logistic Regression, Decision Trees, and Random Forests',
        'Gradient Descent optimization (SGD, Adam) and backpropagation calculus',
        'Overfitting prevention via L1/L2 regularization and Dropout layers',
        'Model validation metrics: Precision, Recall, F1-Score, and ROC-AUC',
      ],
      toolsAndStack: ['Scikit-Learn', 'PyTorch Basics', 'Matplotlib', 'Jupyter Lab'],
      demonstrationType: 'neural_network',
    },
    {
      id: 'llm-engineering',
      category: 'llm',
      title: 'Large Language Models & Prompt Engineering',
      subtitle: 'Transformer Architectures, Attention & Structured Outputs',
      status: 'demonstrated',
      summary: 'Hands-on practical experience integrating frontier LLMs (OpenAI GPT, Google Gemini, Anthropic Claude) into production web applications with streaming responses and JSON schema constraints.',
      keyConcepts: [
        'Transformer multi-head self-attention mechanisms and positional encodings',
        'Few-shot prompting, chain-of-thought (CoT), and structured system prompts',
        'OpenAI / Anthropic / Gemini API integration with Server-Sent Events (SSE) streaming',
        'Function calling, tool schemas, and JSON schema enforcement',
      ],
      toolsAndStack: ['OpenAI API', 'Google Gemini API', 'Vercel AI SDK', 'LangChain', 'Promptfoo'],
    },
    {
      id: 'rag-architectures',
      category: 'rag',
      title: 'Retrieval-Augmented Generation (RAG)',
      subtitle: 'Dense Semantic Vector Search & Context Augmentation',
      status: 'demonstrated',
      summary: 'Architecting end-to-end RAG pipelines that ground LLM outputs in verified external knowledge bases, mitigating hallucinations and ensuring auditability.',
      keyConcepts: [
        'Text chunking strategies: recursive character splitting, sliding windows with overlap',
        'Dense vector embeddings (OpenAI text-embedding-3, nomic-embed-text)',
        'Vector similarity search using Cosine Distance and HNSW indexing',
        'Context injection, prompt token budgeting, and reciprocal rank fusion',
      ],
      toolsAndStack: ['pgvector', 'Pinecone', 'LangChain Embeddings', 'ChromaDB'],
      demonstrationType: 'rag_pipeline',
    },
    {
      id: 'ai-agents',
      category: 'agents',
      title: 'Autonomous AI Agents & Tool Execution',
      subtitle: 'ReAct Orchestration, Tool Calling & Multi-Agent Systems',
      status: 'demonstrated',
      summary: 'Designing autonomous agents capable of decomposing complex goals into sequential sub-tasks, invoking custom tools, and self-reflecting on intermediate results.',
      keyConcepts: [
        'ReAct paradigm: Reason -> Act -> Observe -> Reflect feedback loop',
        'Tool specification and deterministic output extraction',
        'Multi-agent role specialization (Coordinator, Researcher, Verifier)',
        'State persistence, execution telemetry, and human-in-the-loop safeguards',
      ],
      toolsAndStack: ['LangGraph', 'Agentic Workflows', 'Tool Schemas', 'Node.js / Python'],
      demonstrationType: 'agent_loop',
    },
    {
      id: 'future-research',
      category: 'future',
      title: 'Future Research & Emerging Frontiers',
      subtitle: 'Local Quantized Models, WebGPU Inference & Multimodal AI',
      status: 'research_interest',
      summary: 'Active exploration of emerging frontiers in edge AI deployment, client-side WebGPU neural execution, and lightweight domain-specific model distillation.',
      keyConcepts: [
        'Client-side inference using ONNX Runtime Web and WebGPU shader pipelines',
        'Quantization strategies: 4-bit and 8-bit GGUF models for local edge operation',
        'Multimodal vision-language models for spatial 3D scene understanding',
        'Self-hosting local open-weights LLMs (Llama 3, Mistral, Gemma) via Ollama',
      ],
      toolsAndStack: ['WebGPU', 'ONNX Runtime', 'Ollama', 'GGUF / llama.cpp', 'Hugging Face'],
    },
  ],
};
