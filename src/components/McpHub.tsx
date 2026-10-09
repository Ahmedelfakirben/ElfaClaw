import React, { useState } from 'react';
import { 
  FolderGit2, 
  Terminal, 
  Play, 
  Settings2, 
  Plus, 
  CheckCircle2, 
  Copy, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  Wrench, 
  ExternalLink,
  Save,
  Clock,
  Layers,
  ChevronRight,
  Database,
  GitBranch,
  Search,
  Lock,
  Download,
  Key,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { McpServer, McpCall } from '../types';
import { POPULAR_MCP_SERVERS, executeMcpTool, verifyMcpServerAuth } from '../services/mcpClient';
import { McpConfigAuthModal } from './McpConfigAuthModal';

interface McpHubProps {
  servers: McpServer[];
  onAddServer: (server: McpServer) => void;
  onUpdateServers: (servers: McpServer[]) => void;
  onOpenDesktopInstaller?: () => void;
}

export const McpHub: React.FC<McpHubProps> = ({
  servers,
  onAddServer,
  onUpdateServers,
  onOpenDesktopInstaller
}) => {
  const [selectedServerId, setSelectedServerId] = useState<string>(servers[0]?.id || 'supabase');
  const [activeTab, setActiveTab] = useState<'tools' | 'catalog' | 'config' | 'logs'>('catalog');
  const [testToolName, setTestToolName] = useState<string>('query_database');
  const [testParams, setTestParams] = useState<string>('{"sql": "SELECT * FROM users LIMIT 5;"}');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [configModalServer, setConfigModalServer] = useState<McpServer | null>(null);

  const [jsonConfig, setJsonConfig] = useState<string>(() => {
    const configObj: Record<string, any> = { mcpServers: {} };
    servers.forEach(s => {
      configObj.mcpServers[s.id] = {
        command: s.command,
        args: s.args,
        env: s.authConfig?.fields?.reduce((acc: any, f) => {
          if (f.value) acc[f.key] = f.value;
          return acc;
        }, {}) || {}
      };
    });
    return JSON.stringify(configObj, null, 2);
  });
  const [copiedConfig, setCopiedConfig] = useState(false);

  const [recentCalls, setRecentCalls] = useState<McpCall[]>([
    {
      id: 'call-1',
      serverName: 'supabase',
      toolName: 'list_tables',
      arguments: {},
      result: '✓ Esquema Supabase: public.profiles, public.projects, auth.users',
      status: 'success',
      durationMs: 38,
      timestamp: Date.now() - 60000
    },
    {
      id: 'call-2',
      serverName: 'git',
      toolName: 'git_status',
      arguments: {},
      result: 'On branch main\nYour branch is up to date with origin/main.\nChanges not staged: src/App.tsx',
      status: 'success',
      durationMs: 12,
      timestamp: Date.now() - 180000
    }
  ]);

  const selectedServer = servers.find(s => s.id === selectedServerId) || servers[0] || POPULAR_MCP_SERVERS[0];

  const handleInstallServer = (serverTemplate: McpServer) => {
    const isAlreadyInstalled = servers.some(s => s.id === serverTemplate.id);
    if (isAlreadyInstalled) {
      // Open config directly
      setConfigModalServer(serverTemplate);
      return;
    }

    const newInstalledServer: McpServer = {
      ...serverTemplate,
      installed: true,
      status: 'active'
    };

    const updated = [...servers, newInstalledServer];
    onUpdateServers(updated);
    setSelectedServerId(newInstalledServer.id);
    setConfigModalServer(newInstalledServer);
  };

  const handleRunTest = async () => {
    setIsExecuting(true);
    setTestResult(null);

    let parsedArgs = {};
    try {
      parsedArgs = JSON.parse(testParams);
    } catch {
      parsedArgs = { raw: testParams };
    }

    try {
      const call = await executeMcpTool(selectedServer.id, testToolName, parsedArgs);
      setTestResult(call.result || 'Ejecutado sin salida');
      setRecentCalls(prev => [call, ...prev]);
    } catch (err: any) {
      setTestResult(`Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveJsonConfig = () => {
    try {
      const parsed = JSON.parse(jsonConfig);
      if (!parsed.mcpServers) throw new Error('Debe contener "mcpServers"');
      alert('Configuración MCP compatible con Claude Desktop guardada exitosamente.');
    } catch (err: any) {
      alert(`JSON Inválido: ${err.message}`);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonConfig);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const handleSaveServerConfig = (updatedServer: McpServer) => {
    const updated = servers.map(s => s.id === updatedServer.id ? updatedServer : s);
    if (!servers.some(s => s.id === updatedServer.id)) {
      updated.push(updatedServer);
    }
    onUpdateServers(updated);
    setSelectedServerId(updatedServer.id);
  };

  const filteredCatalog = POPULAR_MCP_SERVERS.filter(s => {
    if (catalogCategory === 'all') return true;
    return s.category === catalogCategory;
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-2.75rem)] bg-[#FAF9F5] dark:bg-[#181715] text-[#2B2824] dark:text-[#EAE6DF] overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-12 border-b border-[#E8E5DF] dark:border-[#2E2B27] bg-[#FAF9F5] dark:bg-[#181715] flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-amber-600" />
          <h2 className="font-semibold text-xs text-[#2B2824] dark:text-[#EAE6DF]">
            Model Context Protocol (MCP) Hub & Catálogo
          </h2>
          <span className="text-[10px] text-[#736E67] font-mono">
            claude_desktop_config.json
          </span>
        </div>

        {/* Tab switcher: Catalog, Tools, Config, Logs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#EDEBE6] dark:bg-[#252320] p-0.5 rounded-lg border border-[#E0DDD6] dark:border-[#33302A] text-xs">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                  : 'text-[#736E67]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D96547]" />
              <span>Instalador 1-Clic ({POPULAR_MCP_SERVERS.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === 'tools'
                  ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                  : 'text-[#736E67]'
              }`}
            >
              Servidores Activos ({servers.length})
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === 'config'
                  ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                  : 'text-[#736E67]'
              }`}
            >
              Configuración JSON
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === 'logs'
                  ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                  : 'text-[#736E67]'
              }`}
            >
              Historial ({recentCalls.length})
            </button>
          </div>

          {onOpenDesktopInstaller && (
            <button
              onClick={onOpenDesktopInstaller}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#D96547] text-white rounded-lg text-xs font-medium hover:bg-[#C55639] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalador .EXE / PATH</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tab 1: 1-Click Popular Catalog */}
        {activeTab === 'catalog' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF] dark:border-[#2E2B27]">
              <div>
                <h3 className="text-base font-serif font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                  Instalador de Servidores MCP Populares (1-Clic)
                </h3>
                <p className="text-xs text-[#736E67]">
                  Explora e instala integraciones reales para Git, Supabase, PostgreSQL, GitHub y herramientas locales.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-[#EDEBE6] dark:bg-[#252320] p-0.5 rounded-lg text-xs">
                {['all', 'database', 'version_control', 'filesystem', 'search'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCatalogCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] capitalize font-medium ${
                      catalogCategory === cat ? 'bg-white text-[#2B2824] shadow-xs' : 'text-[#736E67]'
                    }`}
                  >
                    {cat === 'all' ? 'Todos' : cat === 'database' ? 'Bases de Datos' : cat === 'version_control' ? 'Git / GitHub' : cat === 'filesystem' ? 'Archivos' : 'Búsqueda'}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Servers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCatalog.map(server => {
                const isInstalled = servers.some(s => s.id === server.id);
                const activeServer = servers.find(s => s.id === server.id) || server;
                const isConfigured = activeServer.authConfig?.isConfigured;

                return (
                  <div
                    key={server.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isInstalled
                        ? 'bg-white dark:bg-[#201E1B] border-[#D96547] shadow-xs'
                        : 'bg-white dark:bg-[#1E1C19] border-[#E0DDD6] dark:border-[#33302A] hover:border-[#D96547]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl text-white ${
                          server.category === 'database' ? 'bg-emerald-600' :
                          server.category === 'version_control' ? 'bg-amber-600' :
                          server.category === 'search' ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}>
                          {server.category === 'database' ? <Database className="w-5 h-5" /> :
                           server.category === 'version_control' ? <GitBranch className="w-5 h-5" /> :
                           server.category === 'search' ? <Search className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                            {server.name}
                          </h4>
                          <span className="text-[10px] text-[#A39E96] font-mono">
                            {server.command} {server.args[0]}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-mono ${
                        isInstalled
                          ? isConfigured ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                      }`}>
                        {isInstalled ? (isConfigured ? '✓ Conectado & Verificado' : 'Requiere Credenciales') : 'Disponible'}
                      </span>
                    </div>

                    <p className="text-xs text-[#736E67] leading-relaxed line-clamp-2">
                      {server.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F2EFE9] dark:border-[#282622] text-xs">
                      <span className="text-[11px] text-[#736E67] font-mono">
                        {server.tools.length} herramientas disponibles
                      </span>

                      <div className="flex items-center gap-2">
                        {isInstalled && (
                          <button
                            onClick={() => setConfigModalServer(activeServer)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-stone-100 dark:bg-stone-800 text-[#2B2824] dark:text-[#EAE6DF] hover:bg-stone-200 rounded-lg transition-colors"
                          >
                            <Key className="w-3 h-3 text-amber-600" />
                            <span>Configurar</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleInstallServer(server)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                            isInstalled
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                              : 'bg-[#D96547] text-white hover:bg-[#C55639]'
                          }`}
                        >
                          {isInstalled ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                          <span>{isInstalled ? 'Instalado' : 'Instalar 1-Clic'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Tools Inspector & Live Runner */}
        {activeTab === 'tools' && (
          <>
            {/* Left Servers List */}
            <div className="w-72 border-r border-[#E8E5DF] dark:border-[#2E2B27] bg-[#F7F5F0] dark:bg-[#1A1917] flex flex-col text-xs">
              <div className="p-3 border-b border-[#E8E5DF] dark:border-[#2E2B27] flex items-center justify-between">
                <span className="font-semibold text-[11px] text-[#736E67] uppercase tracking-wider">
                  Servidores Activos ({servers.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Conectados</span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {servers.map(s => {
                  const isSelected = selectedServerId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedServerId(s.id);
                        if (s.tools[0]) setTestToolName(s.tools[0].name);
                      }}
                      className={`p-3 rounded-xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-white dark:bg-[#22201D] border-[#D96547] shadow-xs'
                          : 'bg-white/60 dark:bg-[#1E1C19] border-transparent hover:border-[#E0DDD6]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-[#2B2824] dark:text-[#F3F0EB]">
                          {s.name}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Activo" />
                      </div>
                      <p className="text-[11px] text-[#736E67] line-clamp-2 leading-relaxed">
                        {s.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-[#A39E96] font-mono">
                        <span>{s.tools.length} tools</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfigModalServer(s);
                          }}
                          className="text-[#D96547] hover:underline"
                        >
                          Configurar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-t border-[#E8E5DF] dark:border-[#2E2B27] bg-emerald-50/50 dark:bg-emerald-950/20 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ejecución estrictamente local. Sin egress de red.</span>
              </div>
            </div>

            {/* Right Tools Inspector & Testbench */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-[#1E1C19] p-6 space-y-6">
              {/* Server Details */}
              <div className="border-b border-[#E8E5DF] dark:border-[#2E2B27] pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                      {selectedServer.name}
                    </h3>
                    <p className="text-xs text-[#736E67] mt-0.5">
                      {selectedServer.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConfigModalServer(selectedServer)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EDEBE6] dark:bg-[#282622] text-[#2B2824] dark:text-[#EAE6DF] rounded-lg text-xs font-medium hover:bg-[#E0DDD6]"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-600" />
                      <span>Autenticación & Parámetros</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tools List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#736E67] uppercase tracking-wider">
                  Herramientas Expuestas por el Servidor ({selectedServer.tools.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedServer.tools.map(tool => (
                    <div
                      key={tool.name}
                      onClick={() => setTestToolName(tool.name)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        testToolName === tool.name
                          ? 'border-[#D96547] bg-amber-50/20 dark:bg-amber-950/20'
                          : 'border-[#E0DDD6] dark:border-[#33302A] hover:border-[#D96547]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                          {tool.name}
                        </span>
                        <Wrench className="w-3.5 h-3.5 text-[#D96547]" />
                      </div>
                      <p className="text-xs text-[#736E67] leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Testbench */}
              <div className="p-4 bg-[#FAF9F5] dark:bg-[#181715] rounded-xl border border-[#E0DDD6] dark:border-[#33302A] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2B2824] dark:text-[#EAE6DF] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                    Probar ejecución de herramienta: <code className="text-[#D96547] font-mono">{testToolName}</code>
                  </span>
                  <button
                    onClick={handleRunTest}
                    disabled={isExecuting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D96547] text-white rounded-lg text-xs font-medium hover:bg-[#C55639] transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isExecuting ? 'Ejecutando...' : 'Ejecutar Tool'}</span>
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-[#736E67] block mb-1">
                    Parámetros JSON de invocación:
                  </label>
                  <input
                    type="text"
                    value={testParams}
                    onChange={e => setTestParams(e.target.value)}
                    placeholder='{"path": "."}'
                    className="w-full px-3 py-2 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg font-mono text-xs outline-none focus:border-[#D96547]"
                  />
                </div>

                {testResult && (
                  <div className="p-3 bg-white dark:bg-[#201E1B] rounded-lg border border-[#E0DDD6] dark:border-[#33302A] font-mono text-xs">
                    <div className="text-[10px] text-emerald-600 mb-1 font-semibold">
                      ✓ Resultado MCP recibido:
                    </div>
                    <pre className="text-stone-800 dark:text-stone-200 whitespace-pre-wrap">{testResult}</pre>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Tab 3: JSON Config */}
        {activeTab === 'config' && (
          <div className="flex-1 flex flex-col p-6 space-y-4 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#2B2824] dark:text-[#F3F0EB]">
                  claude_desktop_config.json
                </h3>
                <p className="text-xs text-[#736E67]">
                  Archivo de configuración estándar de Claude Desktop. Puedes editarlo o sincronizarlo localmente.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#22201D] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs font-medium hover:border-[#D96547]"
                >
                  {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar JSON</span>
                </button>
                <button
                  onClick={handleSaveJsonConfig}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D96547] text-white rounded-lg text-xs font-medium hover:bg-[#C55639]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Configuración</span>
                </button>
              </div>
            </div>

            <textarea
              value={jsonConfig}
              onChange={e => setJsonConfig(e.target.value)}
              className="flex-1 min-h-[400px] p-4 bg-white dark:bg-[#201E1B] text-[#2B2824] dark:text-[#EAE6DF] border border-[#E0DDD6] dark:border-[#33302A] rounded-xl font-mono text-xs outline-none focus:border-[#D96547] leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}

        {/* Tab 4: Logs */}
        {activeTab === 'logs' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-3 max-w-4xl mx-auto w-full">
            <h3 className="text-sm font-semibold text-[#2B2824] dark:text-[#F3F0EB]">
              Registro de Invocaciones MCP Recientes
            </h3>
            <p className="text-xs text-[#736E67]">
              Cada herramienta invocada por ElfaClaw o por el usuario queda auditada localmente.
            </p>

            <div className="space-y-2 pt-2">
              {recentCalls.map(call => (
                <div
                  key={call.id}
                  className="p-3 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-xl text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-500">
                      {call.serverName}.{call.toolName}
                    </span>
                    <span className="text-[10px] text-[#736E67] font-mono">
                      {call.durationMs}ms · {new Date(call.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-[#736E67] font-mono text-[11px]">
                    Args: {JSON.stringify(call.arguments)}
                  </div>
                  {call.result && (
                    <div className="p-2 bg-[#FAF9F5] dark:bg-[#181715] rounded border border-[#EDEBE6] dark:border-[#282622] font-mono text-[11px] text-emerald-700 dark:text-emerald-400 whitespace-pre-wrap">
                      {call.result}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Config & Authenticate MCP */}
      {configModalServer && (
        <McpConfigAuthModal
          server={configModalServer}
          isOpen={true}
          onClose={() => setConfigModalServer(null)}
          onSaveServer={handleSaveServerConfig}
        />
      )}
    </div>
  );
};
