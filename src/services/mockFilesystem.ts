import { ProjectFile } from '../types';

export const INITIAL_IDE_FILES: ProjectFile[] = [
  {
    id: 'f1',
    name: 'App.tsx',
    path: 'src/App.tsx',
    language: 'typescript',
    modifiedAt: Date.now() - 3600000,
    content: `import React, { useState } from 'react';
import { ShieldCheck, Cpu, Zap, FolderGit2 } from 'lucide-react';

export default function App() {
  const [tasksCompleted, setTasksCompleted] = useState(12);

  return (
    <div className="min-h-screen bg-[#FAF9F5] p-8 text-[#2B2824]">
      <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center pb-4 border-b border-[#E8E5DF]">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2824]">
            ElfaClaw Micro-App Local
          </h1>
          <p className="text-sm text-[#736E67]">
            Desarrollado en entorno seguro impulsado por Gemma On-Device
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-md border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Bóveda Local Activa</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white border border-[#E8E5DF] rounded-xl shadow-xs">
          <Cpu className="w-6 h-6 text-[#D96547] mb-2" />
          <h3 className="font-semibold text-base mb-1">Gemma Local Engine</h3>
          <p className="text-xs text-[#736E67]">
            Inferencia local sin costo de API ni transmisión de telemetría a servidores externos.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#E8E5DF] rounded-xl shadow-xs">
          <FolderGit2 className="w-6 h-6 text-amber-600 mb-2" />
          <h3 className="font-semibold text-base mb-1">MCP Filesystem Bridge</h3>
          <p className="text-xs text-[#736E67]">
            Lectura y escritura autorizada en tus directorios locales de trabajo.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#E8E5DF] rounded-xl shadow-xs">
          <Zap className="w-6 h-6 text-indigo-600 mb-2" />
          <h3 className="font-semibold text-base mb-1">Tareas Completadas</h3>
          <p className="text-2xl font-bold font-serif text-[#2B2824] my-1">
            {tasksCompleted}
          </p>
          <button
            onClick={() => setTasksCompleted(c => c + 1)}
            className="mt-2 text-xs font-medium px-3 py-1.5 bg-[#2B2824] text-white rounded-lg hover:bg-black transition-colors"
          >
            Ejecutar Tarea Local
          </button>
        </div>
      </main>
    </div>
  );
}`
  },
  {
    id: 'f2',
    name: 'taskRunner.ts',
    path: 'src/services/taskRunner.ts',
    language: 'typescript',
    modifiedAt: Date.now() - 7200000,
    content: `/**
 * ElfaClaw Task Runner
 * Gestiona ejecuciones asíncronas con garantías de privacidad On-Device.
 */

export interface ExecutionResult {
  taskId: string;
  success: boolean;
  durationMs: number;
  outputSignature: string;
}

export async function runLocalTask(command: string, args: string[]): Promise<ExecutionResult> {
  const startTime = performance.now();
  console.log(\`[ElfaClaw TaskRunner] Ejecutando: \${command} \${args.join(' ')}\`);
  
  // Simulación de procesamiento local seguro
  await new Promise(resolve => setTimeout(resolve, 80));
  
  return {
    taskId: 'task-' + Math.random().toString(36).substring(2, 7),
    success: true,
    durationMs: Math.round(performance.now() - startTime),
    outputSignature: 'sha256-local-verified'
  };
}`
  },
  {
    id: 'f3',
    name: 'claude_desktop_config.json',
    path: 'claude_desktop_config.json',
    language: 'json',
    modifiedAt: Date.now() - 10000000,
    content: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/local/dev/elfaclaw_workspace"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "mcp-server-git", "--repository", "."]
    },
    "sqlite": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "./elfaclaw_private_vault.db"]
    }
  }
}`
  },
  {
    id: 'f4',
    name: 'testRunner.test.ts',
    path: 'tests/testRunner.test.ts',
    language: 'typescript',
    modifiedAt: Date.now() - 15000000,
    content: `import { describe, it, expect } from 'vitest';
import { runLocalTask } from '../src/services/taskRunner';

describe('ElfaClaw Local Engine Test Suite', () => {
  it('garantiza ejecución on-device sin fugas externas', async () => {
    const result = await runLocalTask('mcp:filesystem', ['--read', 'src/App.tsx']);
    expect(result.success).toBe(true);
    expect(result.durationMs).toBeLessThan(500);
  });

  it('verifica que la firma criptográfica sea válida', async () => {
    const result = await runLocalTask('vault:audit', []);
    expect(result.outputSignature).toBe('sha256-local-verified');
  });
});`
  },
  {
    id: 'f5',
    name: 'package.json',
    path: 'package.json',
    language: 'json',
    modifiedAt: Date.now() - 25000000,
    content: `{
  "name": "elfaclaw-local-workspace",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "vitest run",
    "build": "vite build",
    "mcp:check": "npx @modelcontextprotocol/inspector"
  },
  "dependencies": {
    "react": "^19.0.0",
    "lucide-react": "^0.546.0"
  }
}`
  }
];
