import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Paperclip, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Terminal, 
  FolderGit2, 
  FileCode, 
  Copy, 
  Check, 
  Maximize2,
  Trash2,
  Code2,
  Lock,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Message, Artifact, ModelOption, McpCall } from '../types';
import { Language, translations } from '../i18n';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (text: string, attachments?: string[]) => void;
  isLoading: boolean;
  selectedModel: ModelOption;
  onOpenModelModal: () => void;
  onSelectArtifact: (art: Artifact) => void;
  onOpenInIDE: (art: Artifact) => void;
  activeArtifact: Artifact | null;
  lang?: Language;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  isLoading,
  selectedModel,
  onOpenModelModal,
  onSelectArtifact,
  onOpenInIDE,
  activeArtifact,
  lang = 'es'
}) => {
  const t = translations[lang];
  const [inputText, setInputText] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [expandedMcp, setExpandedMcp] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
    setShowSlashMenu(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    if (val.startsWith('/')) {
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
    }

    // Auto resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const insertSlashCommand = (cmd: string) => {
    setInputText(cmd + ' ');
    setShowSlashMenu(false);
    textareaRef.current?.focus();
  };

  const toggleMcpExpand = (id: string) => {
    setExpandedMcp(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-2.75rem)] bg-[#FAF9F5] dark:bg-[#181715] text-[#2B2824] dark:text-[#EAE6DF] relative overflow-hidden transition-colors">
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-4xl w-full mx-auto space-y-6">
        {messages.length === 0 ? (
          // Claude Desktop Empty State (Subtle, Understated)
          <div className="min-h-[68vh] flex flex-col justify-center items-center text-center max-w-xl mx-auto space-y-5 select-none animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#D96547] text-white flex items-center justify-center font-serif font-bold text-2xl shadow-xs mx-auto">
              E
            </div>
            
            <div className="space-y-1.5">
              <h1 className="text-2xl font-serif font-medium tracking-tight text-[#2B2824] dark:text-[#F3F0EB]">
                {t.helloPrompt}
              </h1>
              <p className="text-xs text-[#736E67] dark:text-[#8E8A83] max-w-md mx-auto leading-relaxed">
                {t.helloSubtitle}
              </p>
            </div>

            {/* Quick Starters Cards (Subtle borders) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left pt-3">
              <button
                onClick={() => onSendMessage('Crea un componente React interactivo en un artefacto con Tailwind CSS y pruébalo')}
                className="p-3 bg-white dark:bg-[#1E1C1A] border border-[#E6E3DC] dark:border-[#2A2724] rounded-xl hover:border-[#D96547] shadow-2xs hover:shadow-xs transition-all text-xs space-y-1 group"
              >
                <div className="flex items-center gap-2 font-medium text-[#2B2824] dark:text-[#F3F0EB] group-hover:text-[#D96547]">
                  <FileCode className="w-3.5 h-3.5 text-[#D96547]" />
                  <span>{t.createReactArtifact}</span>
                </div>
                <p className="text-[#736E67] dark:text-[#8E8A83] text-[11px] leading-relaxed">
                  {t.createReactDesc}
                </p>
              </button>

              <button
                onClick={() => onSendMessage('Muestra el estado de los servidores MCP conectados y ejecuta una lectura con el Filesystem MCP')}
                className="p-3 bg-white dark:bg-[#1E1C1A] border border-[#E6E3DC] dark:border-[#2A2724] rounded-xl hover:border-amber-500 shadow-2xs hover:shadow-xs transition-all text-xs space-y-1 group"
              >
                <div className="flex items-center gap-2 font-medium text-[#2B2824] dark:text-[#F3F0EB] group-hover:text-amber-600">
                  <FolderGit2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.inspectMcp}</span>
                </div>
                <p className="text-[#736E67] dark:text-[#8E8A83] text-[11px] leading-relaxed">
                  {t.inspectMcpDesc}
                </p>
              </button>

              <button
                onClick={() => onSendMessage('Escribe una función TypeScript con tipado estricto y pruebas unitarias para abrir en el IDE')}
                className="p-3 bg-white dark:bg-[#1E1C1A] border border-[#E6E3DC] dark:border-[#2A2724] rounded-xl hover:border-indigo-500 shadow-2xs hover:shadow-xs transition-all text-xs space-y-1 group"
              >
                <div className="flex items-center gap-2 font-medium text-[#2B2824] dark:text-[#F3F0EB] group-hover:text-indigo-600">
                  <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{t.programInIde}</span>
                </div>
                <p className="text-[#736E67] dark:text-[#8E8A83] text-[11px] leading-relaxed">
                  {t.programInIdeDesc}
                </p>
              </button>

              <button
                onClick={() => onSendMessage('Explícame cómo funciona la garantía de privacidad On-Device y la bóveda local de datos en ElfaClaw')}
                className="p-3 bg-white dark:bg-[#1E1C1A] border border-[#E6E3DC] dark:border-[#2A2724] rounded-xl hover:border-emerald-500 shadow-2xs hover:shadow-xs transition-all text-xs space-y-1 group"
              >
                <div className="flex items-center gap-2 font-medium text-[#2B2824] dark:text-[#F3F0EB] group-hover:text-emerald-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.privacyAudit}</span>
                </div>
                <p className="text-[#736E67] dark:text-[#8E8A83] text-[11px] leading-relaxed">
                  {t.privacyAuditDesc}
                </p>
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col space-y-2 ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {msg.role === 'user' ? (
                // User Message Bubble
                <div className="max-w-[85%] bg-[#EDEBE6] dark:bg-[#272522] text-[#2B2824] dark:text-[#F3F0EB] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed border border-[#E0DDD6] dark:border-[#33302A]">
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                // Assistant Message (Claude Style)
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#736E67] dark:text-[#A39E96]">
                    <div className="w-5 h-5 rounded-md bg-[#D96547] text-white flex items-center justify-center font-serif font-bold text-[11px]">
                      E
                    </div>
                    <span className="font-medium text-[#2B2824] dark:text-[#EAE6DF]">ElfaClaw</span>
                    <span className="text-[10px] text-[#A39E96]">· {msg.model || 'Gemma 27B Local'}</span>
                    {msg.privacyAudit?.zeroDataSentToThirdParty && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                        <Lock className="w-2.5 h-2.5" />
                        0 B Egress
                      </span>
                    )}
                  </div>

                  {/* MCP Tool Calls Visualizer */}
                  {msg.mcpCalls && msg.mcpCalls.length > 0 && (
                    <div className="space-y-1.5 my-2">
                      {msg.mcpCalls.map((call, idx) => {
                        const callKey = `${msg.id}-${idx}`;
                        const isExpanded = !!expandedMcp[callKey];
                        return (
                          <div
                            key={callKey}
                            className="bg-stone-50 dark:bg-[#201E1B] border border-stone-200 dark:border-[#33302A] rounded-lg text-xs overflow-hidden"
                          >
                            <button
                              onClick={() => toggleMcpExpand(callKey)}
                              className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-stone-100 dark:hover:bg-[#272522] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="font-mono text-[11px] text-amber-700 dark:text-amber-500 font-medium">
                                  MCP Tool: {call.serverName}.{call.toolName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-stone-500">
                                <span>Ejecutado localmente</span>
                                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </div>
                            </button>
                            {isExpanded && (
                              <div className="px-3 py-2 bg-stone-100/60 dark:bg-[#1B1917] border-t border-stone-200 dark:border-[#33302A] font-mono text-[11px] text-stone-700 dark:text-stone-300">
                                <div>Parámetros: {JSON.stringify(call.arguments || {})}</div>
                                {call.result && <div className="mt-1 text-emerald-700 dark:text-emerald-400">{call.result}</div>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Assistant Text Content */}
                  <div className="text-sm leading-relaxed text-[#2B2824] dark:text-[#EAE6DF] space-y-3 prose-stone">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={pIdx} className="text-base font-semibold text-[#2B2824] dark:text-[#F3F0EB] pt-2">
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                        return (
                          <ul key={pIdx} className="space-y-1 list-disc pl-5">
                            {paragraph.split('\n').map((item, itemIdx) => (
                              <li key={itemIdx} className="text-sm">
                                {item.replace(/^[-*]\s*/, '')}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={pIdx} className="whitespace-pre-wrap">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Artifact Box Card if message has an artifact */}
                  {msg.artifact && (
                    <div
                      onClick={() => onSelectArtifact(msg.artifact!)}
                      className="mt-3 p-3.5 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-xl hover:border-[#D96547] hover:shadow-sm cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-[#D96547] rounded-lg">
                          <FileCode className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#2B2824] dark:text-[#F3F0EB]">
                              {msg.artifact.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-[#EDEBE6] dark:bg-[#2E2B27] text-[#736E67] rounded font-mono">
                              {msg.artifact.language}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#736E67] dark:text-[#8E8982]">
                            Haz clic para abrir el artefacto interactivo en pantalla dividida
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenInIDE(msg.artifact!);
                          }}
                          className="px-2.5 py-1 text-[11px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 flex items-center gap-1"
                          title="Abrir directamente en el IDE"
                        >
                          <Terminal className="w-3 h-3" />
                          <span>IDE</span>
                        </button>
                        <span className="text-xs font-medium text-[#D96547] group-hover:translate-x-0.5 transition-transform">
                          Ver Artefacto →
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#736E67] dark:text-[#A39E96] py-3">
            <div className="w-4 h-4 rounded-full border-2 border-[#D96547] border-t-transparent animate-spin" />
            <span>ElfaClaw razonando localmente con Gemma...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Prompt Bar Area */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-[#FAF9F5] via-[#FAF9F5] to-transparent dark:from-[#181715] dark:via-[#181715] select-none">
        <div className="max-w-4xl mx-auto relative">
          {/* Slash Commands Dropdown Menu */}
          {showSlashMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-72 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-xl shadow-lg p-1.5 space-y-1 z-30 text-xs">
              <div className="px-2 py-1 text-[10px] font-semibold text-[#736E67] uppercase">
                Comandos rápidos ElfaClaw
              </div>
              <button
                onClick={() => insertSlashCommand('/mcp')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#272522] text-left"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-amber-600" />
                <div>
                  <div className="font-medium">/mcp</div>
                  <div className="text-[10px] text-[#736E67]">Inspeccionar servidores y herramientas MCP</div>
                </div>
              </button>
              <button
                onClick={() => insertSlashCommand('/code')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#272522] text-left"
              >
                <FileCode className="w-3.5 h-3.5 text-[#D96547]" />
                <div>
                  <div className="font-medium">/code</div>
                  <div className="text-[10px] text-[#736E67]">Generar código y artefacto interactivo</div>
                </div>
              </button>
              <button
                onClick={() => insertSlashCommand('/privacy')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#272522] text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <div>
                  <div className="font-medium">/privacy</div>
                  <div className="text-[10px] text-[#736E67]">Comprobar estado de bóveda local y 0 B egress</div>
                </div>
              </button>
              <button
                onClick={() => insertSlashCommand('/task')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#272522] text-left"
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                <div>
                  <div className="font-medium">/task</div>
                  <div className="text-[10px] text-[#736E67]">Crear y ejecutar tarea de programación</div>
                </div>
              </button>
            </div>
          )}

          {/* Main Prompt Card (Claude Desktop Box) */}
          <div className="bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-2xl shadow-sm focus-within:border-[#D96547] focus-within:shadow-md transition-all p-3">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje a ElfaClaw... (Escribe '/' para comandos)"
              rows={1}
              className="w-full bg-transparent resize-none outline-none text-sm text-[#2B2824] dark:text-[#EAE6DF] placeholder-[#A39E96] max-h-44 leading-relaxed"
            />

            {/* Prompt bar footer actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F2EFE9] dark:border-[#282622] mt-1 text-xs select-none">
              <div className="flex items-center gap-2">
                {/* Model switcher button */}
                <button
                  onClick={onOpenModelModal}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF9F5] dark:bg-[#272522] border border-[#E8E5DF] dark:border-[#36332E] text-[11px] font-medium text-[#2B2824] dark:text-[#EAE6DF] hover:border-[#D96547] transition-colors"
                >
                  <Cpu className="w-3 h-3 text-[#D96547]" />
                  <span>{selectedModel.name.replace('ElfaClaw ', '')}</span>
                  <ChevronDown className="w-3 h-3 text-[#736E67]" />
                </button>

                {/* MCP indicator pill */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
                  <FolderGit2 className="w-3 h-3" />
                  MCP Conectado
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSendMessage('Ejecuta un diagnóstico completo de los archivos y servidores MCP locales')}
                  className="p-1.5 text-[#736E67] hover:text-[#2B2824] dark:text-[#A39E96] dark:hover:text-white rounded-lg hover:bg-[#F2EFE9] dark:hover:bg-[#272522] transition-colors"
                  title="Adjuntar o inspeccionar archivos locales"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isLoading}
                  className={`p-2 rounded-xl transition-all ${
                    inputText.trim() && !isLoading
                      ? 'bg-[#D96547] text-white hover:bg-[#C55639] shadow-xs cursor-pointer'
                      : 'bg-[#EDEBE6] dark:bg-[#2B2926] text-[#A39E96] cursor-not-allowed'
                  }`}
                  title="Enviar (Enter)"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-[11px] text-[#A39E96] mt-2 select-none">
            <span>ElfaClaw Desktop · Privacidad 100% On-Device con Gemma</span>
            <span>·</span>
            <span>Presiona Enter para enviar, Shift+Enter para salto de línea</span>
          </div>
        </div>
      </div>
    </div>
  );
};
