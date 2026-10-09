import React, { useState } from 'react';
import { 
  SquarePen, 
  Search, 
  MessageSquare, 
  Trash2, 
  Layers, 
  FolderGit2, 
  Sparkles, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeftOpen,
  FolderOpen,
  Cpu,
  Lock
} from 'lucide-react';
import { Conversation, Project } from '../types';
import { Language, translations } from '../i18n';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  projects: Project[];
  activeProjectId?: string;
  onSelectProject: (id?: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onOpenMcp: () => void;
  lang?: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  projects,
  activeProjectId,
  onSelectProject,
  isOpen,
  onToggleOpen,
  onOpenMcp,
  lang = 'es'
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) {
    return (
      <aside className="w-11 bg-[#FAF9F5] dark:bg-[#171614] border-r border-[#ECE9E2] dark:border-[#282622] flex flex-col items-center py-2.5 justify-between z-20 select-none">
        <div className="flex flex-col items-center gap-2.5">
          <button
            onClick={onToggleOpen}
            className="p-1.5 text-[#736E67] hover:text-[#2B2824] dark:text-[#8E8A83] dark:hover:text-white rounded-md hover:bg-[#EFECE6] dark:hover:bg-[#22201D] transition-colors"
            title="Expandir barra lateral (⌘B)"
          >
            <PanelLeftOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNewConversation}
            className="p-1.5 text-[#D96547] hover:bg-amber-100/40 dark:hover:bg-amber-950/20 rounded-md transition-colors"
            title="Nuevo Chat (⌘K)"
          >
            <SquarePen className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onOpenMcp}
            className="p-1.5 text-amber-700 dark:text-amber-500 hover:bg-[#EFECE6] dark:hover:bg-[#22201D] rounded-md transition-colors"
            title="Ver Servidores MCP"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-60 bg-[#FAF9F5] dark:bg-[#171614] border-r border-[#ECE9E2] dark:border-[#282622] flex flex-col justify-between h-[calc(100vh-2.5rem)] select-none text-xs z-20 transition-colors">
      {/* Top Header & New Chat button */}
      <div className="p-2.5 border-b border-[#ECE9E2] dark:border-[#282622] space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-xs tracking-tight text-[#2B2824] dark:text-[#EAE6DF] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            ElfaClaw Workspace
          </span>
          <button
            onClick={onToggleOpen}
            className="p-1 text-[#736E67] dark:text-[#8E8A83] hover:text-[#2B2824] dark:hover:text-white rounded hover:bg-[#EFECE6] dark:hover:bg-[#22201D] transition-colors"
            title="Ocultar barra lateral"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Start new chat button */}
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-between px-2.5 py-1.5 bg-white dark:bg-[#201E1B] border border-[#E6E3DC] dark:border-[#2C2926] rounded-lg text-xs font-medium text-[#2B2824] dark:text-[#EAE6DF] hover:border-[#D96547] shadow-2xs transition-all group"
        >
          <div className="flex items-center gap-2">
            <SquarePen className="w-3.5 h-3.5 text-[#D96547] group-hover:scale-105 transition-transform" />
            <span>{t.newChat}</span>
          </div>
          <kbd className="px-1 py-0.2 text-[9px] font-mono text-[#736E67] bg-[#EFECE6] dark:bg-[#282622] rounded border border-[#E6E3DC] dark:border-[#33302A]">
            ⌘K
          </kbd>
        </button>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3 h-3 text-[#A39E96] absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-7 pr-2 py-1 bg-[#F3F0EA] dark:bg-[#1E1C1A] border border-transparent focus:border-[#D96547] focus:bg-white dark:focus:bg-[#171614] rounded-md text-[11px] text-[#2B2824] dark:text-[#EAE6DF] placeholder-[#A39E96] outline-none transition-all"
          />
        </div>
      </div>

      {/* Projects Section */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3.5">
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-semibold text-[#8E8A83] dark:text-[#7A756E] uppercase tracking-wider">
              {t.localProjects}
            </span>
            <button
              onClick={() => onSelectProject(undefined)}
              className="text-[10px] text-[#D96547] hover:underline"
            >
              {t.seeAll}
            </button>
          </div>
          <div className="space-y-0.5">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors ${
                  activeProjectId === proj.id
                    ? 'bg-[#EAE7E0] dark:bg-[#24221F] text-[#2B2824] dark:text-white font-medium'
                    : 'text-[#5A554E] dark:text-[#B5B0A8] hover:bg-[#F0EDE6] dark:hover:bg-[#1E1C1A]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FolderOpen className="w-3.5 h-3.5 text-[#D96547] shrink-0" />
                  <span className="truncate text-[11px]">{proj.name}</span>
                </div>
                <span className="text-[10px] text-[#A39E96]">
                  {proj.files.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversations History */}
        <div>
          <div className="px-2 mb-1">
            <span className="text-[10px] font-semibold text-[#8E8A83] dark:text-[#7A756E] uppercase tracking-wider">
              {t.recentChats}
            </span>
          </div>

          <div className="space-y-0.5">
            {filteredConversations.length === 0 ? (
              <div className="px-3 py-3 text-center text-[#8E8A83] text-[11px]">
                {t.noRecentChats}
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isActive = c.id === activeConversationId;
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectConversation(c.id)}
                    className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#EAE7E0] dark:bg-[#24221F] text-[#2B2824] dark:text-white font-medium shadow-2xs'
                        : 'text-[#5A554E] dark:text-[#B5B0A8] hover:bg-[#F0EDE6] dark:hover:bg-[#1E1C1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#D96547]' : 'text-[#8E8A83]'}`} />
                      <span className="truncate text-[11px]">{c.title || 'Nueva conversación'}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 rounded transition-opacity"
                      title="Eliminar chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer: MCP Protocol Link & Local Vault status badge */}
      <div className="p-2.5 border-t border-[#ECE9E2] dark:border-[#282622] bg-[#F7F5F0]/70 dark:bg-[#171614] space-y-1.5">
        <button
          onClick={onOpenMcp}
          className="w-full flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-[#201E1B] border border-[#E6E3DC] dark:border-[#2C2926] hover:border-amber-400 text-xs transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium text-[#2B2824] dark:text-[#EAE6DF] text-[11px]">{t.mcpHub}</span>
          </div>
          <span className="px-1 py-0.2 text-[9px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded font-mono">
            MCP
          </span>
        </button>

        <div className="flex items-center justify-between pt-0.5 text-[10px] text-[#8E8A83]">
          <div className="flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-emerald-600" />
            <span>Gemma On-Device</span>
          </div>
          <span className="font-mono text-emerald-700 dark:text-emerald-400">
            {t.privacyTotal}
          </span>
        </div>
      </div>
    </aside>
  );
};
