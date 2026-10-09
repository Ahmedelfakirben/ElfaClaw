import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  FolderGit2, 
  CheckSquare, 
  MessageSquareCode, 
  Settings2, 
  Cpu, 
  Sparkles, 
  Layers, 
  ChevronDown, 
  Moon, 
  Sun,
  Download,
  Database,
  Globe
} from 'lucide-react';
import { ModelOption } from '../types';
import { Language, translations } from '../i18n';

interface DesktopTitlebarProps {
  currentView: 'chat' | 'ide' | 'mcp' | 'projects' | 'tasks';
  onSelectView: (view: 'chat' | 'ide' | 'mcp' | 'projects' | 'tasks') => void;
  selectedModel: ModelOption;
  onOpenModelModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenDesktopInstaller?: () => void;
  onOpenSupabaseManager?: () => void;
  activeSupabaseCount?: number;
  zeroEgress: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
}

export const DesktopTitlebar: React.FC<DesktopTitlebarProps> = ({
  currentView,
  onSelectView,
  selectedModel,
  onOpenModelModal,
  onOpenPrivacyModal,
  onOpenDesktopInstaller,
  onOpenSupabaseManager,
  activeSupabaseCount = 1,
  zeroEgress,
  isDarkMode,
  onToggleTheme,
  lang,
  onSelectLang
}) => {
  const t = translations[lang];

  return (
    <header className="h-10 select-none border-b border-[#ECE9E2] dark:border-[#282622] bg-[#FAF9F5] dark:bg-[#171614] flex items-center justify-between px-3 text-xs z-30 transition-colors">
      {/* Window Controls & Subtle Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 pr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block opacity-80 hover:opacity-100 transition-opacity cursor-pointer" title="Cerrar" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block opacity-80 hover:opacity-100 transition-opacity cursor-pointer" title="Minimizar" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block opacity-80 hover:opacity-100 transition-opacity cursor-pointer" title="Zoom" />
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-[#ECE9E2] dark:border-[#282622]">
          <div className="w-5 h-5 rounded-md bg-[#D96547] text-white flex items-center justify-center font-serif font-bold text-xs shadow-2xs">
            E
          </div>
          <span className="font-medium text-xs tracking-tight text-[#2B2824] dark:text-[#EAE6DF]">
            ElfaClaw
          </span>
          <span className="text-[10px] text-[#A39E96] font-mono hidden md:inline">
            v1.0
          </span>
        </div>
      </div>

      {/* Central View Switcher (Subtle, Clean) */}
      <nav className="flex items-center bg-[#EFECE6]/70 dark:bg-[#201E1B] p-0.5 rounded-lg border border-[#E6E3DC] dark:border-[#2C2926]">
        <button
          onClick={() => onSelectView('chat')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all ${
            currentView === 'chat'
              ? 'bg-white dark:bg-[#171614] text-[#2B2824] dark:text-[#F3F0EB] font-medium shadow-2xs'
              : 'text-[#736E67] dark:text-[#8E8A83] hover:text-[#2B2824] dark:hover:text-[#F3F0EB]'
          }`}
        >
          <MessageSquareCode className="w-3.5 h-3.5 text-[#D96547]" />
          <span>{t.chatAndArtifacts}</span>
        </button>

        <button
          onClick={() => onSelectView('ide')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all ${
            currentView === 'ide'
              ? 'bg-white dark:bg-[#171614] text-[#2B2824] dark:text-[#F3F0EB] font-medium shadow-2xs'
              : 'text-[#736E67] dark:text-[#8E8A83] hover:text-[#2B2824] dark:hover:text-[#F3F0EB]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-500" />
          <span>{t.ideStudio}</span>
        </button>

        <button
          onClick={() => onSelectView('mcp')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all ${
            currentView === 'mcp'
              ? 'bg-white dark:bg-[#171614] text-[#2B2824] dark:text-[#F3F0EB] font-medium shadow-2xs'
              : 'text-[#736E67] dark:text-[#8E8A83] hover:text-[#2B2824] dark:hover:text-[#F3F0EB]'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5 text-amber-600" />
          <span>{t.mcpProtocol}</span>
        </button>

        <button
          onClick={() => onSelectView('tasks')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all ${
            currentView === 'tasks'
              ? 'bg-white dark:bg-[#171614] text-[#2B2824] dark:text-[#F3F0EB] font-medium shadow-2xs'
              : 'text-[#736E67] dark:text-[#8E8A83] hover:text-[#2B2824] dark:hover:text-[#F3F0EB]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.localTasks}</span>
        </button>

        <button
          onClick={() => onSelectView('projects')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all ${
            currentView === 'projects'
              ? 'bg-white dark:bg-[#171614] text-[#2B2824] dark:text-[#F3F0EB] font-medium shadow-2xs'
              : 'text-[#736E67] dark:text-[#8E8A83] hover:text-[#2B2824] dark:hover:text-[#F3F0EB]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.projects}</span>
        </button>
      </nav>

      {/* Right Controls: Supabase Multi-project, Model, Language, Privacy, Theme */}
      <div className="flex items-center gap-2">
        {/* Supabase Multi-Project Manager Pill */}
        {onOpenSupabaseManager && (
          <button
            onClick={onOpenSupabaseManager}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-[#201E1B] border border-[#E6E3DC] dark:border-[#2C2926] rounded-md text-[11px] font-medium text-[#2B2824] dark:text-[#EAE6DF] hover:border-emerald-500 transition-colors shadow-2xs"
            title="Gestionar instancias de Supabase (Activar / Desactivar)"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xl:inline">Supabase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>
        )}

        {/* Model Selector pill */}
        <button
          onClick={onOpenModelModal}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-[#201E1B] border border-[#E6E3DC] dark:border-[#2C2926] rounded-md text-[11px] font-medium text-[#2B2824] dark:text-[#EAE6DF] hover:border-[#D96547] transition-colors shadow-2xs"
          title={t.changeModel}
        >
          <Cpu className="w-3.5 h-3.5 text-[#D96547]" />
          <span className="truncate max-w-[120px] hidden md:inline">
            {selectedModel.name.replace('ElfaClaw ', '').replace('Google ', '')}
          </span>
          <ChevronDown className="w-3 h-3 text-[#736E67]" />
        </button>

        {/* Language Switcher (ES / EN / FR) */}
        <div className="flex items-center bg-[#EFECE6]/70 dark:bg-[#201E1B] p-0.5 rounded-md border border-[#E6E3DC] dark:border-[#2C2926] text-[10px] font-medium">
          <button
            onClick={() => onSelectLang('es')}
            className={`px-1.5 py-0.5 rounded ${lang === 'es' ? 'bg-white dark:bg-[#171614] text-[#2B2824] dark:text-white shadow-2xs' : 'text-[#736E67]'}`}
            title="Español"
          >
            ES
          </button>
          <button
            onClick={() => onSelectLang('en')}
            className={`px-1.5 py-0.5 rounded ${lang === 'en' ? 'bg-white dark:bg-[#171614] text-[#2B2824] dark:text-white shadow-2xs' : 'text-[#736E67]'}`}
            title="English"
          >
            EN
          </button>
          <button
            onClick={() => onSelectLang('fr')}
            className={`px-1.5 py-0.5 rounded ${lang === 'fr' ? 'bg-white dark:bg-[#171614] text-[#2B2824] dark:text-white shadow-2xs' : 'text-[#736E67]'}`}
            title="Français"
          >
            FR
          </button>
        </div>

        {/* Windows .EXE / PowerShell Installer */}
        {onOpenDesktopInstaller && (
          <button
            onClick={onOpenDesktopInstaller}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FAF9F5] dark:bg-[#201E1B] border border-[#E6E3DC] dark:border-[#2C2926] hover:border-[#D96547] text-[#2B2824] dark:text-[#EAE6DF] transition-colors"
            title={t.installerExe}
          >
            <Download className="w-3.5 h-3.5 text-[#D96547]" />
            <span className="hidden lg:inline">.EXE</span>
          </button>
        )}

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 text-[#736E67] dark:text-[#8E8A83] hover:text-[#2B2824] dark:hover:text-[#F3F0EB] rounded-md hover:bg-[#EFECE6] dark:hover:bg-[#201E1B] transition-colors"
          title={t.toggleTheme}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
