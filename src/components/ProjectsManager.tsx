import React, { useState } from 'react';
import { 
  FolderOpen, 
  Plus, 
  FileCode, 
  Settings2, 
  MessageSquare, 
  Sparkles, 
  Trash2, 
  Upload, 
  Save, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { Project, ProjectFile } from '../types';

interface ProjectsManagerProps {
  projects: Project[];
  activeProjectId?: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, description: string, instructions: string) => void;
  onStartChatInProject: (projectId: string) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onStartChatInProject
}) => {
  const [selectedId, setSelectedId] = useState<string>(activeProjectId || projects[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectInstructions, setNewProjectInstructions] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentProject = projects.find(p => p.id === selectedId) || projects[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onCreateProject(newProjectName, newProjectDesc, newProjectInstructions);
    setNewProjectName('');
    setNewProjectDesc('');
    setNewProjectInstructions('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-2.75rem)] bg-[#FAF9F5] dark:bg-[#181715] text-[#2B2824] dark:text-[#EAE6DF] overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-12 border-b border-[#E8E5DF] dark:border-[#2E2B27] bg-[#FAF9F5] dark:bg-[#181715] flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[#D96547]" />
          <h2 className="font-semibold text-xs text-[#2B2824] dark:text-[#EAE6DF]">
            Proyectos Locales & Memoria de Contexto
          </h2>
          <span className="text-[10px] text-[#736E67] font-mono">
            Claude Desktop Projects Clone
          </span>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D96547] text-white rounded-lg text-xs font-medium hover:bg-[#C55639] transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Projects Sidebar */}
        <div className="w-72 border-r border-[#E8E5DF] dark:border-[#2E2B27] bg-[#F7F5F0] dark:bg-[#1A1917] flex flex-col text-xs">
          <div className="p-3 border-b border-[#E8E5DF] dark:border-[#2E2B27] text-[11px] font-semibold text-[#736E67] uppercase tracking-wider">
            Tus Proyectos ({projects.length})
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {projects.map(proj => {
              const isSelected = selectedId === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedId(proj.id)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-[#22201D] border-[#D96547] shadow-xs'
                      : 'bg-white/60 dark:bg-[#1E1C19] border-transparent hover:border-[#E0DDD6]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-[#2B2824] dark:text-[#F3F0EB]">
                      {proj.name}
                    </span>
                    <span className="text-[10px] text-[#A39E96]">
                      {proj.files.length} archivos
                    </span>
                  </div>
                  <p className="text-[11px] text-[#736E67] line-clamp-2 leading-relaxed">
                    {proj.description || 'Sin descripción'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Project Detail & Instructions */}
        {currentProject ? (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl space-y-6">
            <div className="flex items-start justify-between border-b border-[#E8E5DF] dark:border-[#2E2B27] pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                  {currentProject.name}
                </h3>
                <p className="text-xs text-[#736E67] mt-1">
                  {currentProject.description || 'Configuración de instrucciones y archivos de conocimiento para Gemma.'}
                </p>
              </div>

              <button
                onClick={() => onStartChatInProject(currentProject.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D96547] text-white rounded-lg text-xs font-medium hover:bg-[#C55639] transition-colors shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Iniciar Chat en este Proyecto</span>
              </button>
            </div>

            {/* Custom Instructions (Claude System Prompt) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#2B2824] dark:text-[#EAE6DF] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D96547]" />
                Instrucciones personalizadas para ElfaClaw en este proyecto
              </label>
              <p className="text-[11px] text-[#736E67]">
                Define el comportamiento, convenciones de código y estándares que Gemma debe seguir siempre en este proyecto.
              </p>
              <textarea
                value={currentProject.customInstructions}
                onChange={() => {}}
                rows={5}
                className="w-full p-3 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-xl text-xs outline-none focus:border-[#D96547] leading-relaxed"
                placeholder="Ejemplo: Responde siempre en español. Usa tipado estricto en TypeScript. Prioriza la seguridad y nunca inventes librerías."
              />
            </div>

            {/* Project Knowledge Files */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#2B2824] dark:text-[#EAE6DF]">
                    Archivos de Conocimiento del Proyecto ({currentProject.files.length})
                  </h4>
                  <p className="text-[11px] text-[#736E67]">
                    ElfaClaw consultará estos archivos automáticamente al responder.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentProject.files.map(file => (
                  <div
                    key={file.id}
                    className="p-3 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-4 h-4 text-[#D96547] shrink-0" />
                      <div className="truncate">
                        <div className="font-medium text-[#2B2824] dark:text-[#F3F0EB] truncate">{file.name}</div>
                        <div className="text-[10px] text-[#A39E96] font-mono">{file.path}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-mono">Indexado</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#736E67]">
            Selecciona o crea un proyecto.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-2xl p-6 shadow-xl space-y-4 text-xs"
          >
            <h3 className="text-base font-serif font-bold text-[#2B2824] dark:text-[#F3F0EB]">
              Crear Nuevo Proyecto ElfaClaw
            </h3>
            <div>
              <label className="block text-xs font-medium mb-1">Nombre del Proyecto</label>
              <input
                type="text"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                placeholder="ej: Microservicios Core"
                className="w-full px-3 py-2 border border-[#E0DDD6] rounded-lg outline-none focus:border-[#D96547]"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Descripción</label>
              <input
                type="text"
                value={newProjectDesc}
                onChange={e => setNewProjectDesc(e.target.value)}
                placeholder="Breve propósito del proyecto..."
                className="w-full px-3 py-2 border border-[#E0DDD6] rounded-lg outline-none focus:border-[#D96547]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Instrucciones Personalizadas de Sistema</label>
              <textarea
                value={newProjectInstructions}
                onChange={e => setNewProjectInstructions(e.target.value)}
                placeholder="Instrucciones para guiar a Gemma en este proyecto..."
                rows={3}
                className="w-full px-3 py-2 border border-[#E0DDD6] rounded-lg outline-none focus:border-[#D96547]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 text-[#736E67] hover:text-[#2B2824]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#D96547] text-white rounded-lg font-medium hover:bg-[#C55639]"
              >
                Crear Proyecto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
