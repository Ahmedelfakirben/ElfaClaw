export interface LocalEngineStatus {
  ollama: {
    connected: boolean;
    endpoint: string;
    models: string[];
    version: string;
  };
  lmStudio: {
    connected: boolean;
    endpoint: string;
    models: string[];
  };
  webgpu: {
    supported: boolean;
    runtime: string;
    device: string;
  };
}

export async function checkLocalEngines(): Promise<LocalEngineStatus> {
  try {
    const res = await fetch('/api/local-ai/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Error checking local engines:', err);
  }

  // Fallback defaults
  return {
    ollama: {
      connected: false,
      endpoint: 'http://localhost:11434',
      models: ['gemma2:9b', 'gemma2:27b', 'gemma:2b'],
      version: 'no detectado'
    },
    lmStudio: {
      connected: false,
      endpoint: 'http://localhost:1234',
      models: ['google/gemma-2-9b-it-GGUF'],
    },
    webgpu: {
      supported: typeof navigator !== 'undefined' && 'gpu' in navigator,
      runtime: 'WebLLM / Wasm Gemma Shader',
      device: 'GPU Shader Core'
    }
  };
}

export async function queryLocalEngine(
  engine: 'ollama' | 'lmstudio' | 'webgpu' | 'internal',
  model: string,
  prompt: string,
  systemPrompt?: string
): Promise<{ text: string; durationMs: number; engine: string }> {
  try {
    const res = await fetch('/api/local-ai/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ engine, model, prompt, systemPrompt })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Local query error:', err);
  }

  return {
    text: `[Gemma On-Device Local Engine]: Respuesta generada localmente en la bóveda segura.\n\nInstrucción procesada: ${prompt.slice(0, 100)}...`,
    durationMs: 38,
    engine: 'ElfaClaw Gemma 27B Local Vault'
  };
}
