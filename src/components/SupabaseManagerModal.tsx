import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Plus, 
  Check, 
  Power, 
  Play, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Lock, 
  ExternalLink,
  Layers,
  Key
} from 'lucide-react';
import { SupabaseProject } from '../types/supabase';
import { Language, translations } from '../i18n';

interface SupabaseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: SupabaseProject[];
  onUpdateProjects: (projects: SupabaseProject[]) => void;
  lang: Language;
}

export const SupabaseManagerModal: React.FC<SupabaseManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  onUpdateProjects,
  lang
}) => {
  const t = translations[lang];
  const [showAddForm, setShowAddForm] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  // New project form state
  const [newName, setNewName] = useState('');
  const [newEnv, setNewEnv] = useState<'production' | 'staging' | 'development'>('development');
  const [newUrl, setNewUrl] = useState('');
  const [newKey, setNewKey] = useState('');

  if (!isOpen) return null;

  const handleToggleActive = (id: string) => {
    const updated = projects.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
    onUpdateProjects(updated);
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    onUpdateProjects(updated);
  };

  const handleTestConnection = async (proj: SupabaseProject) => {
    setTestingId(proj.id);

    try {
      const res = await fetch('/api/mcp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverId: 'supabase',
          authConfig: {
            fields: [
              { key: 'SUPABASE_URL', value: proj.url },
              { key: 'SUPABASE_SERVICE_ROLE_KEY', value: proj.key }
            ]
          }
        })
      });

      const data = await res.json();
      const updated = projects.map(p => {
        if (p.id === proj.id) {
          return {
            ...p,
            status: data.success ? ('connected' as const) : ('error' as const),
            lastTested: Date.now(),
            errorMessage: data.success ? undefined : (data.error || 'Fallo de conexión')
          };
        }
        return p;
      });

      onUpdateProjects(updated);
    } catch (err: any) {
      const updated = projects.map(p => p.id === proj.id ? { ...p, status: 'error' as const, errorMessage: err.message } : p);
      onUpdateProjects(updated);
    } finally {
      setTestingId(null);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim() || !newKey.trim()) return;

    const newProject: SupabaseProject = {
      id: 'sp-' + Date.now(),
      name: newName,
      environment: newEnv,
      url: newUrl.trim(),
      key: newKey.trim(),
      isActive: true,
      status: 'untested',
      tables: ['public.schema_ready'],
      lastTested: Date.now()
    };

    onUpdateProjects([newProject, ...projects]);
    setNewName('');
    setNewUrl('');
    setNewKey('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FAF9F5] dark:bg-[#1A1816] border border-[#E6E3DC] dark:border-[#2C2926] rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE9E2] dark:border-[#282622]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-900/60">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-semibold text-[#2B2824] dark:text-[#F3F0EB]">
                {t.supabaseTitle}
              </h3>
              <p className="text-[11px] text-[#736E67] dark:text-[#8E8A83]">
                {t.supabaseSubtitle}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-[#736E67] hover:text-[#2B2824] dark:hover:text-white rounded-lg hover:bg-[#EFECE6] dark:hover:bg-[#252320] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button: Add New Project */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#736E67] dark:text-[#8E8A83]">
            {projects.filter(p => p.isActive).length} de {projects.length} proyectos activos en el entorno MCP
          </span>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D96547] text-white hover:bg-[#C55639] rounded-lg text-xs font-medium transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addProject}</span>
          </button>
        </div>

        {/* Add Project Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddProject} className="p-4 bg-white dark:bg-[#22201D] border border-[#E6E3DC] dark:border-[#2E2B27] rounded-xl space-y-3 shadow-xs">
            <div className="font-semibold text-xs text-[#2B2824] dark:text-[#F3F0EB]">
              Conectar nueva instancia de Supabase
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-[#736E67] mb-1">Nombre del Proyecto:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="ej: Producción UE / Base Usuarios"
                  className="w-full px-3 py-1.5 bg-[#FAF9F5] dark:bg-[#181715] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#736E67] mb-1">Entorno:</label>
                <select
                  value={newEnv}
                  onChange={e => setNewEnv(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-[#FAF9F5] dark:bg-[#181715] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs outline-none"
                >
                  <option value="production">Producción</option>
                  <option value="staging">Staging / QA</option>
                  <option value="development">Desarrollo Local</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[#736E67] mb-1">Project URL:</label>
              <input
                type="url"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="https://tu-proyecto.supabase.co"
                className="w-full px-3 py-1.5 bg-[#FAF9F5] dark:bg-[#181715] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#736E67] mb-1">Service Role Key o Anon Key:</label>
              <input
                type="password"
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-1.5 bg-[#FAF9F5] dark:bg-[#181715] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs font-mono outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-xs text-[#736E67] hover:text-[#2B2824]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#D96547] text-white rounded-lg text-xs font-medium hover:bg-[#C55639]"
              >
                Guardar Proyecto
              </button>
            </div>
          </form>
        )}

        {/* Projects List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {projects.map(proj => (
            <div
              key={proj.id}
              className={`p-3.5 bg-white dark:bg-[#201E1B] rounded-xl border transition-all ${
                proj.isActive
                  ? 'border-emerald-300 dark:border-emerald-800/80 shadow-2xs'
                  : 'border-[#E6E3DC] dark:border-[#2C2926] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${proj.isActive ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span className="font-semibold text-xs text-[#2B2824] dark:text-[#F3F0EB]">
                    {proj.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    proj.environment === 'production' 
                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200' 
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}>
                    {proj.environment}
                  </span>
                </div>

                {/* Switcher & Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(proj.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      proj.isActive
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200'
                        : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                    }`}
                    title={proj.isActive ? 'Desactivar en MCP' : 'Activar en MCP'}
                  >
                    <Power className="w-3 h-3" />
                    <span>{proj.isActive ? t.active : t.inactive}</span>
                  </button>

                  <button
                    onClick={() => handleTestConnection(proj)}
                    disabled={testingId === proj.id}
                    className="p-1 text-[#736E67] hover:text-[#2B2824] dark:hover:text-white rounded hover:bg-[#EFECE6] dark:hover:bg-[#252320]"
                    title="Probar conexión"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingId === proj.id ? 'animate-spin text-emerald-600' : ''}`} />
                  </button>

                  {projects.length > 1 && (
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1 text-[#A39E96] hover:text-red-500 rounded"
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#736E67] dark:text-[#8E8A83] font-mono">
                <span className="truncate max-w-[280px]">{proj.url}</span>
                <div className="flex items-center gap-2">
                  {proj.status === 'connected' && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-sans flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Conectado</span>
                    </span>
                  )}
                  {proj.status === 'error' && (
                    <span className="text-red-600 font-sans flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Error</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Tables Preview pill */}
              {proj.tables && proj.tables.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#F2EFE9] dark:border-[#272522] flex items-center gap-1.5 overflow-x-auto text-[10px] text-[#736E67]">
                  <span className="text-[#A39E96]">Tablas:</span>
                  {proj.tables.map(t => (
                    <span key={t} className="px-1.5 py-0.2 bg-[#FAF9F5] dark:bg-[#181715] rounded border border-[#E6E3DC] dark:border-[#2C2926] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-[#ECE9E2] dark:border-[#282622]">
          <span className="text-[11px] text-[#736E67] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Las credenciales se cifran localmente y solo se usan en tu máquina</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#D96547] text-white rounded-lg font-medium hover:bg-[#C55639] transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
