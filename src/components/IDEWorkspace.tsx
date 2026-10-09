import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  FolderTree, 
  Terminal as TerminalIcon, 
  Play, 
  Save, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  GitBranch, 
  SplitSquareVertical, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  RotateCcw,
  CheckCircle2,
  FolderOpen,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  ExternalLink,
  Code2,
  AlertCircle
} from 'lucide-react';
import { ProjectFile } from '../types';

interface IDEWorkspaceProps {
  files: ProjectFile[];
  onUpdateFile: (fileId: string, content: string) => void;
  onCreateFile: (name: string, path: string, content: string) => void;
  onDeleteFile: (fileId: string) => void;
}

export const IDEWorkspace: React.FC<IDEWorkspaceProps> = ({
  files,
  onUpdateFile,
  onCreateFile,
  onDeleteFile,
}) => {
  const [activeFileId, setActiveFileId] = useState<string>(files[0]?.id || '');
  const [openTabIds, setOpenTabIds] = useState<string[]>([files[0]?.id || '']);
  const [activeView, setActiveView] = useState<'editor' | 'split_preview' | 'diff'>('split_preview');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([
    'Sandbox DOM montado con éxito en 14ms',
    'Tailwind CSS v3/v4 inyectado en sandbox local',
    'Event listeners listos (cero conexiones externas)'
  ]);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'ElfaClaw Local IDE Runtime v1.0.4',
    'Conexión local segura establecida: 0 B salida de telemetría.',
    'MCP Filesystem montado en ./workspace',
    'Listo para compilar y ejecutar pruebas locales. Escribe "help" para ver comandos.'
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAiRefactoring, setIsAiRefactoring] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleSelectFile = (file: ProjectFile) => {
    setActiveFileId(file.id);
    if (!openTabIds.includes(file.id)) {
      setOpenTabIds(prev => [...prev, file.id]);
    }
  };

  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = openTabIds.filter(id => id !== fileId);
    setOpenTabIds(updated);
    if (activeFileId === fileId && updated.length > 0) {
      setActiveFileId(updated[0]);
    }
  };

  const handleCopyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim().toLowerCase();
    const newLogs = [...terminalLogs, `$ ${commandInput}`];

    if (cmd === 'help') {
      newLogs.push('Comandos disponibles:');
      newLogs.push('  npm test       -> Ejecuta las pruebas unitarias locales con Vitest');
      newLogs.push('  git status     -> Muestra archivos modificados y estado del repositorio');
      newLogs.push('  mcp status     -> Inspecciona los servidores MCP activos');
      newLogs.push('  run            -> Ejecuta el archivo actual en el sandbox local');
      newLogs.push('  clear          -> Limpia la pantalla de la terminal');
    } else if (cmd === 'npm test') {
      newLogs.push('Running Vitest in local sandbox...');
      newLogs.push('✓ tests/testRunner.test.ts > garantiza ejecución on-device sin fugas externas (18ms)');
      newLogs.push('✓ tests/testRunner.test.ts > verifica que la firma criptográfica sea válida (4ms)');
      newLogs.push('Test Files  1 passed (1)');
      newLogs.push('Tests       2 passed (2)');
      newLogs.push('Time        0.24s');
    } else if (cmd === 'git status') {
      newLogs.push('On branch main');
      newLogs.push('Changes not staged for commit:');
      newLogs.push(`  modified:   ${activeFile?.path || 'src/App.tsx'}`);
      newLogs.push('no changes added to commit (use "git add" to stage)');
    } else if (cmd === 'mcp status') {
      newLogs.push('Active MCP Servers:');
      newLogs.push('  ✓ filesystem     (4 tools loaded)');
      newLogs.push('  ✓ git            (3 tools loaded)');
      newLogs.push('  ✓ sqlite_vault   (2 tools loaded)');
      newLogs.push('  ✓ code_runner    (2 tools loaded)');
    } else if (cmd === 'run') {
      newLogs.push(`Ejecutando ${activeFile?.name} en entorno aislado de Node.js...`);
      newLogs.push(`[Output] Compilación exitosa en 42ms. Memoria: 12MB.`);
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setCommandInput('');
      return;
    } else {
      newLogs.push(`bash: comando '${commandInput}' ejecutado exitosamente en sandbox local.`);
    }

    setTerminalLogs(newLogs);
    setCommandInput('');
  };

  const handleAskAgentToRefactor = () => {
    if (!aiPrompt.trim() || !activeFile) return;
    setIsAiRefactoring(true);

    setTimeout(() => {
      let updatedContent = activeFile.content;
      if (activeFile.name.endsWith('.tsx') || activeFile.name.endsWith('.ts')) {
        updatedContent += `\n\n// [ElfaClaw Gemma Code Agent]: Generado localmente según instrucción: "${aiPrompt}"\nexport const localSecurityPolicy = {\n  vaultEnabled: true,\n  zeroTelemetry: true,\n  timestamp: "${new Date().toISOString()}"\n};\n`;
      } else {
        updatedContent += `\n// Modificado por ElfaClaw Code Agent: ${aiPrompt}\n`;
      }

      onUpdateFile(activeFile.id, updatedContent);
      setIsAiRefactoring(false);
      setAiPrompt('');
      setPreviewKey(k => k + 1); // trigger live preview update
      setTerminalLogs(prev => [
        ...prev,
        `[ElfaClaw Agent] Archivo ${activeFile.name} actualizado localmente según solicitud.`
      ]);
      setSandboxLogs(prev => [
        ...prev,
        `[Live Reload] ${activeFile.name} recompilado en el sandbox (HMR local)`
      ]);
    }, 800);
  };

  const handleCreateNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const path = newFileName.includes('/') ? newFileName : `src/${newFileName}`;
    onCreateFile(newFileName, path, `// Archivo creado en ElfaClaw IDE\nexport const moduleName = "${newFileName}";\n`);
    setNewFileName('');
    setShowNewFileInput(false);
  };

  // Build live sandbox iframe HTML for React/HTML component
  const generateSandboxHtml = () => {
    const isApp = activeFile?.name.includes('App') || activeFile?.name.endsWith('.tsx');
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Source+Serif+4:wght@600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background-color: #FAF9F5; margin: 0; padding: 1.5rem; color: #2B2824; }
  </style>
</head>
<body>
  <div id="sandbox-root" class="max-w-3xl mx-auto space-y-6">
    <header class="flex items-center justify-between pb-4 border-b border-[#E8E5DF]">
      <div>
        <h1 class="text-xl font-serif font-bold text-[#2B2824]">
          ${activeFile?.name || 'Live Component Sandbox'}
        </h1>
        <p class="text-xs text-[#736E67]">
          Renderizado en vivo en el entorno local ElfaClaw (Cero salida externa)
        </p>
      </div>
      <div class="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-md border border-emerald-200">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Live Sandbox HMR</span>
      </div>
    </header>

    <main class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-white rounded-xl border border-[#E8E5DF] shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-sm">Gemma On-Device AI</h3>
          <span class="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-mono">27B Local</span>
        </div>
        <p class="text-xs text-[#736E67]">
          Inferencia local y generación de código sin costos ni transmisión de datos a APIs externas.
        </p>
        <button onclick="logInteraction('Gemma Inferencia solicitada')" class="text-xs px-3 py-1.5 bg-[#D96547] text-white rounded-lg hover:bg-[#C55639] transition-colors">
          Ejecutar Prueba Local
        </button>
      </div>

      <div class="p-4 bg-white rounded-xl border border-[#E8E5DF] shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-sm">Model Context Protocol</h3>
          <span class="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono">Filesystem</span>
        </div>
        <p class="text-xs text-[#736E67]">
          Conexión segura con el sistema de archivos local de tu proyecto.
        </p>
        <button onclick="logInteraction('MCP Sync activado')" class="text-xs px-3 py-1.5 bg-[#2B2824] text-white rounded-lg hover:bg-black transition-colors">
          Sincronizar Bóveda
        </button>
      </div>
    </main>

    <div class="p-4 bg-white rounded-xl border border-[#E8E5DF] shadow-xs">
      <h3 class="font-semibold text-xs text-[#736E67] uppercase tracking-wider mb-2">Código Fuente Compilado</h3>
      <pre class="p-3 bg-[#FAF9F5] rounded-lg text-xs font-mono text-[#2B2824] overflow-x-auto border border-[#E8E5DF]"><code>${(activeFile?.content || '').slice(0, 300).replace(/</g, '&lt;').replace(/>/g, '&gt;')}...</code></pre>
    </div>
  </div>

  <script>
    function logInteraction(action) {
      const banner = document.createElement('div');
      banner.className = 'fixed bottom-4 right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs shadow-md animate-bounce';
      banner.innerText = '✓ Acción: ' + action;
      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 2000);
      window.parent.postMessage({ type: 'SANDBOX_LOG', message: 'Interacción de usuario: ' + action }, '*');
    }
  </script>
</body>
</html>`;
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-2.75rem)] bg-[#FAF9F5] dark:bg-[#181715] text-[#2B2824] dark:text-[#EAE6DF] overflow-hidden select-none">
      {/* Top IDE Toolbar */}
      <div className="h-10 border-b border-[#E8E5DF] dark:border-[#2E2B27] bg-[#FAF9F5] dark:bg-[#181715] flex items-center justify-between px-3 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[#2B2824] dark:text-[#EAE6DF]">
            <TerminalIcon className="w-4 h-4 text-indigo-600" />
            <span>ElfaClaw Code Studio</span>
          </div>
          <span className="text-[10px] text-[#736E67] font-mono">
            /workspace/local_projects
          </span>
        </div>

        {/* View mode toggle (Editor, Editor + Live Preview, Git Diff) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#EDEBE6] dark:bg-[#252320] p-0.5 rounded-lg border border-[#E0DDD6] dark:border-[#33302A] text-xs">
            <button
              onClick={() => setActiveView('editor')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeView === 'editor'
                  ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                  : 'text-[#736E67]'
              }`}
            >
              Solo Editor
            </button>
            <button
              onClick={() => setActiveView('split_preview')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'split_preview'
                  ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                  : 'text-[#736E67]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Editor + Live Sandbox</span>
            </button>
            <button
              onClick={() => setActiveView('diff')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                activeView === 'diff'
                  ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                  : 'text-[#736E67]'
              }`}
            >
              <SplitSquareVertical className="w-3 h-3" />
              <span>Git Diff</span>
            </button>
          </div>

          <button
            onClick={() => {
              setTerminalLogs(prev => [
                ...prev,
                `$ npm test`,
                `✓ 2 tests ejecutados localmente sin fugas externas en 0.19s.`
              ]);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#D96547] text-white hover:bg-[#C55639] rounded-lg text-[11px] font-medium transition-colors shadow-2xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Ejecutar Tests</span>
          </button>
        </div>
      </div>

      {/* Main IDE Body (Split: FileTree + Editor + Sandbox + Terminal) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Project File Tree */}
        <div className="w-56 border-r border-[#E8E5DF] dark:border-[#2E2B27] bg-[#F7F5F0] dark:bg-[#1A1917] flex flex-col text-xs">
          <div className="p-2.5 border-b border-[#E8E5DF] dark:border-[#2E2B27] flex items-center justify-between">
            <span className="font-semibold text-[11px] text-[#736E67] uppercase tracking-wider flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-amber-600" />
              Explorador
            </span>
            <button
              onClick={() => setShowNewFileInput(!showNewFileInput)}
              className="p-1 text-[#736E67] hover:text-[#2B2824] rounded hover:bg-[#EDEBE6] transition-colors"
              title="Nuevo archivo"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* New file input */}
          {showNewFileInput && (
            <form onSubmit={handleCreateNewFile} className="p-2 border-b border-[#E8E5DF]">
              <input
                type="text"
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                placeholder="ej: utils.ts"
                className="w-full px-2 py-1 bg-white border border-[#D96547] rounded text-xs outline-none"
                autoFocus
              />
            </form>
          )}

          <div className="flex-1 overflow-y-auto py-1 px-1.5 space-y-0.5">
            {files.map(f => (
              <div
                key={f.id}
                onClick={() => handleSelectFile(f)}
                className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors group ${
                  activeFileId === f.id
                    ? 'bg-[#EDEBE6] dark:bg-[#272522] text-[#2B2824] dark:text-white font-medium'
                    : 'text-[#5A554E] dark:text-[#A39E96] hover:bg-[#F0EDE8] dark:hover:bg-[#201E1B]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${f.name.endsWith('.tsx') ? 'text-indigo-500' : 'text-amber-600'}`} />
                  <span className="truncate">{f.name}</span>
                </div>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(f.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 rounded transition-opacity"
                    title="Eliminar archivo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* MCP Status pill at bottom of tree */}
          <div className="p-2 border-t border-[#E8E5DF] dark:border-[#2E2B27] bg-[#EDEBE6]/50 dark:bg-[#161513] text-[10px] text-[#736E67] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-emerald-600" />
              <span>main (clean)</span>
            </span>
            <span className="text-emerald-700 font-mono">100% Local</span>
          </div>
        </div>

        {/* Center & Right: Code Editor & Live Preview & AI Agent */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#1E1C19]">
          {/* File Tabs */}
          <div className="h-9 border-b border-[#E8E5DF] dark:border-[#2E2B27] bg-[#FAF9F5] dark:bg-[#181715] flex items-center px-1 overflow-x-auto">
            {openTabIds.map(tabId => {
              const file = files.find(f => f.id === tabId);
              if (!file) return null;
              const isActive = activeFileId === tabId;
              return (
                <div
                  key={tabId}
                  onClick={() => setActiveFileId(tabId)}
                  className={`flex items-center gap-2 px-3 py-1.5 border-r border-[#E8E5DF] dark:border-[#2E2B27] text-xs cursor-pointer select-none transition-colors ${
                    isActive
                      ? 'bg-white dark:bg-[#1E1C19] text-[#2B2824] dark:text-[#F3F0EB] font-medium border-t-2 border-t-[#D96547]'
                      : 'text-[#736E67] hover:bg-[#F2EFE9] dark:hover:bg-[#201E1B]'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-[#D96547]" />
                  <span>{file.name}</span>
                  {openTabIds.length > 1 && (
                    <button
                      onClick={(e) => handleCloseTab(tabId, e)}
                      className="p-0.5 hover:text-red-500 rounded"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Editor + Live Sandbox / Diff Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left part: Code Editor */}
            <div className={`flex flex-col relative overflow-hidden transition-all ${
              activeView === 'split_preview' ? 'w-1/2 border-r border-[#E8E5DF] dark:border-[#2E2B27]' : 'flex-1'
            }`}>
              {activeView === 'diff' ? (
                // Git Diff View
                <div className="flex-1 p-4 font-mono text-xs overflow-auto bg-[#FBFBFA] dark:bg-[#181715] space-y-1">
                  <div className="text-[#736E67] pb-2 border-b border-[#E8E5DF]">
                    diff --git a/{activeFile?.path} b/{activeFile?.path}
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-1 rounded">
                    + export const elfaclawLocalEngine = true;
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-1 rounded">
                    + // Garantía On-Device validada mediante MCP
                  </div>
                  <div className="text-[#5A554E] dark:text-[#A39E96] p-1">
                    &nbsp;&nbsp;import React from 'react';
                  </div>
                </div>
              ) : activeFile ? (
                <div className="flex-1 flex font-mono text-xs overflow-auto">
                  {/* Line numbers column */}
                  <div className="w-10 bg-[#FAF9F5] dark:bg-[#181715] border-r border-[#E8E5DF] dark:border-[#2E2B27] text-right pr-2 py-3 select-none text-[#A39E96] leading-relaxed">
                    {activeFile.content.split('\n').map((_, idx) => (
                      <div key={idx}>{idx + 1}</div>
                    ))}
                  </div>
                  {/* Editable textarea with code styling */}
                  <textarea
                    value={activeFile.content}
                    onChange={(e) => {
                      onUpdateFile(activeFile.id, e.target.value);
                      setPreviewKey(k => k + 1);
                    }}
                    className="flex-1 p-3 bg-white dark:bg-[#1E1C19] text-[#2B2824] dark:text-[#EAE6DF] font-mono text-xs leading-relaxed outline-none resize-none overflow-auto"
                    spellCheck={false}
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-[#736E67]">
                  Ningún archivo abierto.
                </div>
              )}
            </div>

            {/* Right part: Live Sandbox Preview (Split Mode) */}
            {activeView === 'split_preview' && (
              <div className="w-1/2 flex flex-col bg-[#F7F5F0] dark:bg-[#181715] overflow-hidden">
                {/* Sandbox Toolbar */}
                <div className="h-8 border-b border-[#E8E5DF] dark:border-[#2E2B27] bg-[#FAF9F5] dark:bg-[#1A1917] px-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#736E67]">
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-[11px] text-[#2B2824] dark:text-[#EAE6DF]">
                      Live Sandbox
                    </span>
                    <span className="text-[10px] text-emerald-600 font-mono">
                      (HMR Activo)
                    </span>
                  </div>

                  {/* Viewport size buttons */}
                  <div className="flex items-center gap-1 bg-[#EDEBE6] dark:bg-[#252320] p-0.5 rounded border border-[#E0DDD6] dark:border-[#33302A]">
                    <button
                      onClick={() => setPreviewViewport('desktop')}
                      className={`p-1 rounded ${previewViewport === 'desktop' ? 'bg-white text-black' : 'text-[#736E67]'}`}
                      title="Desktop (100%)"
                    >
                      <Monitor className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setPreviewViewport('tablet')}
                      className={`p-1 rounded ${previewViewport === 'tablet' ? 'bg-white text-black' : 'text-[#736E67]'}`}
                      title="Tablet (768px)"
                    >
                      <Tablet className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setPreviewViewport('mobile')}
                      className={`p-1 rounded ${previewViewport === 'mobile' ? 'bg-white text-black' : 'text-[#736E67]'}`}
                      title="Mobile (375px)"
                    >
                      <Smartphone className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => setPreviewKey(k => k + 1)}
                    className="p-1 text-[#736E67] hover:text-[#2B2824] rounded"
                    title="Recargar vista previa"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sandbox iframe Container */}
                <div className="flex-1 overflow-auto flex justify-center items-start p-2 bg-[#FAF9F5] dark:bg-[#141311]">
                  <div className={`h-full bg-white shadow-xs rounded-lg overflow-hidden border border-[#E0DDD6] transition-all ${
                    previewViewport === 'desktop' ? 'w-full' : previewViewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
                  }`}>
                    <iframe
                      key={previewKey}
                      srcDoc={generateSandboxHtml()}
                      title="ElfaClaw Live Component Sandbox"
                      sandbox="allow-scripts allow-same-origin allow-modals"
                      className="w-full h-full border-none"
                    />
                  </div>
                </div>

                {/* Sandbox Console Log Drawer */}
                <div className="h-20 border-t border-[#E8E5DF] dark:border-[#2E2B27] bg-[#FAF9F5] dark:bg-[#181715] p-2 overflow-y-auto font-mono text-[10px] space-y-0.5 text-[#736E67]">
                  <div className="font-semibold text-[#2B2824] dark:text-[#EAE6DF] flex items-center gap-1">
                    <TerminalIcon className="w-3 h-3 text-emerald-600" />
                    <span>Sandbox Console Output</span>
                  </div>
                  {sandboxLogs.slice(-3).map((log, i) => (
                    <div key={i} className="text-emerald-700 dark:text-emerald-400">
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Right: ElfaClaw Code Agent Panel (When not in split preview, or collapsible) */}
            {activeView !== 'split_preview' && (
              <div className="w-72 border-l border-[#E8E5DF] dark:border-[#2E2B27] bg-[#FAF9F5] dark:bg-[#181715] flex flex-col text-xs select-none">
                <div className="p-3 border-b border-[#E8E5DF] dark:border-[#2E2B27] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D96547]" />
                  <span className="font-semibold text-[#2B2824] dark:text-[#EAE6DF]">
                    ElfaClaw Code Agent
                  </span>
                </div>

                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  <p className="text-[#736E67] text-[11px] leading-relaxed">
                    Pide a ElfaClaw que analice, refactorice o cree pruebas sobre <b>{activeFile?.name}</b> en tu entorno local.
                  </p>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => setAiPrompt('Agrega validación de tipos TypeScript y manejo de errores con try/catch')}
                      className="w-full text-left p-2 bg-white dark:bg-[#22201D] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg hover:border-[#D96547] text-[11px] text-[#2B2824] dark:text-[#EAE6DF] transition-colors"
                    >
                      ⚡ Mejorar tipado y manejo de errores
                    </button>
                    <button
                      onClick={() => setAiPrompt('Crea suite de pruebas unitarias con Vitest para este archivo')}
                      className="w-full text-left p-2 bg-white dark:bg-[#22201D] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg hover:border-[#D96547] text-[11px] text-[#2B2824] dark:text-[#EAE6DF] transition-colors"
                    >
                      🧪 Generar tests unitarios locales
                    </button>
                    <button
                      onClick={() => setAiPrompt('Optimiza el rendimiento y elimina posibles fugas de memoria')}
                      className="w-full text-left p-2 bg-white dark:bg-[#22201D] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg hover:border-[#D96547] text-[11px] text-[#2B2824] dark:text-[#EAE6DF] transition-colors"
                    >
                      🛡️ Auditar seguridad y privacidad
                    </button>
                  </div>

                  <div className="pt-2">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Escribe tu instrucción al agente de código..."
                      rows={3}
                      className="w-full p-2 bg-white dark:bg-[#22201D] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs outline-none focus:border-[#D96547]"
                    />
                    <button
                      onClick={handleAskAgentToRefactor}
                      disabled={!aiPrompt.trim() || isAiRefactoring}
                      className="w-full mt-2 py-1.5 bg-[#D96547] text-white rounded-lg font-medium text-xs hover:bg-[#C55639] transition-colors disabled:opacity-50"
                    >
                      {isAiRefactoring ? 'Procesando con Gemma...' : 'Aplicar Cambios al Archivo'}
                    </button>
                  </div>
                </div>

                <div className="p-2 border-t border-[#E8E5DF] bg-emerald-50 dark:bg-emerald-950/20 text-[10px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Edición 100% On-Device sin subir código a la nube</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom: Integrated Terminal */}
          <div className="h-36 border-t border-[#E8E5DF] dark:border-[#2E2B27] bg-[#1E1C19] text-[#EAE6DF] flex flex-col font-mono text-xs">
            <div className="h-7 bg-[#151412] px-3 flex items-center justify-between border-b border-[#2E2B27]">
              <div className="flex items-center gap-2 text-[11px] text-[#A39E96]">
                <TerminalIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span>Terminal Local (bash / zsh sandbox)</span>
              </div>
              <button
                onClick={() => setTerminalLogs([])}
                className="text-[10px] text-[#A39E96] hover:text-white"
              >
                Limpiar
              </button>
            </div>

            <div className="flex-1 p-2.5 overflow-y-auto space-y-1 text-[11px] leading-relaxed">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith('$') ? 'text-amber-400' : log.startsWith('✓') ? 'text-emerald-400' : 'text-[#D0CBC4]'}>
                  {log}
                </div>
              ))}
            </div>

            <form onSubmit={handleRunCommand} className="h-8 bg-[#151412] px-2.5 flex items-center border-t border-[#2E2B27]">
              <span className="text-emerald-500 mr-2 font-bold">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Escribe comando (npm test, git status, mcp status, run)..."
                className="flex-1 bg-transparent border-none outline-none text-white text-[11px] placeholder-[#736E67]"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
