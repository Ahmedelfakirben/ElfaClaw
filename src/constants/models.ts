import { ModelOption } from '../types';

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'elfaclaw-gemma-27b',
    name: 'ElfaClaw Gemma 27B Local Reasoning',
    tagline: 'Razonamiento profundo para programación y MCP en tu máquina',
    badge: '100% On-Device',
    contextWindow: '32k tokens',
    isLocalOnly: true,
    recommendedFor: 'Desarrollo de software, análisis confidencial y uso sin conexión'
  },
  {
    id: 'elfaclaw-gemma-fast',
    name: 'ElfaClaw Gemma Local Ultra-Fast',
    tagline: 'Respuestas instantáneas y tareas de edición ligera',
    badge: 'Local Rápido',
    contextWindow: '8k tokens',
    isLocalOnly: true,
    recommendedFor: 'Consultas rápidas, generación de scripts y comandos de terminal'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning Engine)',
    tagline: 'Modelo de razonamiento y matemáticas avanzadas con cadena de pensamiento',
    badge: 'DeepSeek API',
    contextWindow: '64k tokens',
    isLocalOnly: false,
    recommendedFor: 'Algoritmia compleja, demostraciones y debugging arquitectónico'
  },
  {
    id: 'grok-2',
    name: 'xAI Grok-2',
    tagline: 'Comprensión del mundo real y generación de código de vanguardia',
    badge: 'Grok API',
    contextWindow: '128k tokens',
    isLocalOnly: false,
    recommendedFor: 'Soluciones creativas y análisis de código en tiempo real'
  },
  {
    id: 'hf-gemma-27b',
    name: 'Hugging Face: google/gemma-2-27b-it',
    tagline: 'Inferencia Serverless en el Hub de Hugging Face para modelos de código abierto',
    badge: 'Hugging Face',
    contextWindow: '32k tokens',
    isLocalOnly: false,
    recommendedFor: 'Acceso a miles de checkpoints abiertos en Hugging Face'
  },
  {
    id: 'elfaclaw-ultra-hybrid',
    name: 'Google Gemini 3.8 Flash (Hybrid Guard)',
    tagline: 'Potencia multimodal con filtro previo de privacidad y cifrado local',
    badge: 'Gemini API',
    contextWindow: '1M tokens',
    isLocalOnly: false,
    recommendedFor: 'Búsquedas web en vivo, razonamiento multimodal y proyectos masivos'
  }
];
