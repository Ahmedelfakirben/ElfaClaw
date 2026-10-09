import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Code2, 
  Eye, 
  FileCode, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2,
  FolderPlus
} from 'lucide-react';
import { Artifact } from '../types';

interface ArtifactsPaneProps {
  artifact: Artifact | null;
  onClose: () => void;
  onOpenInIDE: (artifact: Artifact) => void;
}

export const ArtifactsPane: React.FC<ArtifactsPaneProps> = ({
  artifact,
  onClose,
  onOpenInIDE
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!artifact) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([artifact.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = artifact.title;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Generate safe preview iframe content for HTML/React/SVG
  const generatePreviewHtml = () => {
    if (artifact.type === 'image/svg+xml' || artifact.content.trim().startsWith('<svg')) {
      return `<!DOCTYPE html>
<html>
  <head>
    <style>body { margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh; background:#faf9f5; }</style>
  </head>
  <body>${artifact.content}</body>
</html>`;
    }

    if (artifact.type === 'text/html' || artifact.content.includes('<!DOCTYPE') || artifact.content.includes('<html')) {
      return artifact.content;
    }

    // Wrap React-like or HTML snippets with Tailwind CSS CDN
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #faf9f5; margin: 0; padding: 1.5rem; }
  </style>
</head>
<body>
  <div id="root">
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-xl border border-stone-200 shadow-sm text-stone-800">
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
        <h3 class="font-bold text-lg text-stone-900">${artifact.title}</h3>
        <span class="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">ElfaClaw Sandbox</span>
      </div>
      <div class="prose prose-stone text-sm">
        <p class="text-stone-600 mb-4">Artefacto generado localmente por Gemma. Código fuente listo para integración en el IDE.</p>
        <pre class="bg-stone-50 p-4 rounded-lg border border-stone-200 text-xs overflow-x-auto text-stone-800 font-mono"><code>${artifact.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  return (
    <div
      className={`border-l border-[#E8E5DF] dark:border-[#2E2B27] bg-white dark:bg-[#1C1A17] flex flex-col z-20 transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-full h-full'
          : 'w-full md:w-[480px] lg:w-[580px] h-full shadow-lg'
      }`}
    >
      {/* Top Claude style Artifact Header */}
      <div className="h-12 border-b border-[#E8E5DF] dark:border-[#2E2B27] bg-[#FAF9F5] dark:bg-[#181715] flex items-center justify-between px-3 select-none">
        <div className="flex items-center gap-2 truncate">
          <div className="p-1.5 bg-[#EDEBE6] dark:bg-[#252320] rounded-md text-[#D96547]">
            <FileCode className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h3 className="text-xs font-semibold text-[#2B2824] dark:text-[#EAE6DF] truncate">
              {artifact.title}
            </h3>
            <span className="text-[10px] text-[#736E67] font-mono">
              v{artifact.version || 1} · {artifact.language || 'typescript'}
            </span>
          </div>
        </div>

        {/* Tab switcher: Code vs Preview */}
        <div className="flex items-center bg-[#EDEBE6] dark:bg-[#252320] p-0.5 rounded-lg border border-[#E0DDD6] dark:border-[#33302A]">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                : 'text-[#736E67] dark:text-[#A39E96]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                : 'text-[#736E67] dark:text-[#A39E96]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista previa</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-[#736E67] dark:text-[#A39E96]">
          <button
            onClick={() => onOpenInIDE(artifact)}
            className="p-1.5 hover:text-[#2B2824] dark:hover:text-white rounded-md hover:bg-[#EDEBE6] dark:hover:bg-[#252320] transition-colors"
            title="Abrir en IDE de programación"
          >
            <FolderPlus className="w-4 h-4 text-indigo-600" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:text-[#2B2824] dark:hover:text-white rounded-md hover:bg-[#EDEBE6] dark:hover:bg-[#252320] transition-colors"
            title="Copiar código fuente"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 hover:text-[#2B2824] dark:hover:text-white rounded-md hover:bg-[#EDEBE6] dark:hover:bg-[#252320] transition-colors"
            title="Descargar archivo"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:text-[#2B2824] dark:hover:text-white rounded-md hover:bg-[#EDEBE6] dark:hover:bg-[#252320] transition-colors"
            title={isFullscreen ? "Restaurar tamaño" : "Pantalla completa"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:text-[#2B2824] dark:hover:text-white rounded-md hover:bg-[#EDEBE6] dark:hover:bg-[#252320] transition-colors"
            title="Cerrar panel de artefacto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Artifact Body */}
      <div className="flex-1 overflow-auto bg-[#FBFBFA] dark:bg-[#161513]">
        {activeTab === 'preview' ? (
          <div className="w-full h-full flex flex-col">
            <iframe
              srcDoc={generatePreviewHtml()}
              title={artifact.title}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-none bg-white"
            />
          </div>
        ) : (
          <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-[#2B2824] dark:text-[#E6E2DC]">
            <pre className="whitespace-pre">{artifact.content}</pre>
          </div>
        )}
      </div>

      {/* Artifact Footer */}
      <div className="h-9 border-t border-[#E8E5DF] dark:border-[#2E2B27] bg-[#FAF9F5] dark:bg-[#181715] px-3 flex items-center justify-between text-[11px] text-[#736E67] select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Generado con privacidad local (Gemma Engine)</span>
        </div>
        <button
          onClick={() => onOpenInIDE(artifact)}
          className="text-[#D96547] hover:underline font-medium flex items-center gap-1"
        >
          <span>Transferir a IDE</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
