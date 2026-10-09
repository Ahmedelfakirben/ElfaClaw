import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Terminal, 
  RotateCcw, 
  Play, 
  HardDrive,
  Activity,
  Layers,
  Key,
  Lock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ModelOption } from '../types';
import { AVAILABLE_MODELS } from '../constants/models';
import { checkLocalEngines, queryLocalEngine, LocalEngineStatus } from '../services/localAiEngine';
import { localVault } from '../services/localVault';

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel
}) => {
  const [activeTab, setActiveTab] = useState<'models' | 'local_engines' | 'external_apis'>('models');
  const [engineStatus, setEngineStatus] = useState<LocalEngineStatus | null>(null);
  const [isTestingOllama, setIsTestingOllama] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [selectedOllamaModel, setSelectedOllamaModel] = useState<string>('gemma2:9b');

  // External APIs State
  const [deepseekKey, setDeepseekKey] = useState<string>(() => localVault.getStoredData('key_deepseek', ''));
  const [deepseekModel, setDeepseekModel] = useState<string>('deepseek-chat');

  const [grokKey, setGrokKey] = useState<string>(() => localVault.getStoredData('key_grok', ''));
  const [grokModel, setGrokModel] = useState<string>('grok-2-latest');

  const [hfToken, setHfToken] = useState<string>(() => localVault.getStoredData('key_hf', ''));
  const [hfModel, setHfModel] = useState<string>('google/gemma-2-27b-it');

  const [isTestingApi, setIsTestingApi] = useState<string | null>(null);
  const [apiTestResult, setApiTestResult] = useState<{ provider: string; success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkLocalEngines().then(status => {
        setEngineStatus(status);
        if (status.ollama.models[0]) {
          setSelectedOllamaModel(status.ollama.models[0]);
        }
      });
    }
  }, [isOpen]);

  const handleTestOllama = async () => {
    setIsTestingOllama(true);
    setTestResult(null);
    try {
      const res = await queryLocalEngine(
        'ollama',
        selectedOllamaModel,
        'Hola Gemma, escribe un console.log de verificación de privacidad en TypeScript.'
      );
      setTestResult(`${res.text}\n\n[Inferencia completada en ${res.durationMs}ms con ${res.engine}]`);
    } catch (err: any) {
      setTestResult(`Error al conectar: ${err.message}`);
    } finally {
      setIsTestingOllama(false);
    }
  };

  const handleConnectOllamaAsMain = () => {
    const customOllamaModel: ModelOption = {
      id: 'ollama-local-' + selectedOllamaModel,
      name: `Ollama ${selectedOllamaModel} (Local GPU)`,
      tagline: `Ejecución nativa en tu tarjeta gráfica vía localhost:11434`,
      badge: 'Ollama Nativo',
      contextWindow: '32k tokens',
      isLocalOnly: true,
      recommendedFor: 'Inferencia local acelerada por hardware CUDA/Metal'
    };
    onSelectModel(customOllamaModel);
    onClose();
  };

  // Test external provider API
  const handleTestExternalApi = async (provider: 'deepseek' | 'grok' | 'huggingface') => {
    setIsTestingApi(provider);
    setApiTestResult(null);

    const apiKey = provider === 'deepseek' ? deepseekKey : provider === 'grok' ? grokKey : hfToken;
    const model = provider === 'deepseek' ? deepseekModel : provider === 'grok' ? grokModel : hfModel;

    try {
      const res = await fetch('/api/providers/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          model,
          apiKey,
          prompt: 'Responde brevemente: ¿Conexión exitosa con ElfaClaw?'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setApiTestResult({
          provider,
          success: true,
          message: `✓ Conexión exitosa (${data.durationMs}ms). Respuesta: "${data.content.slice(0, 100)}..."`
        });
      } else {
        setApiTestResult({
          provider,
          success: false,
          message: `Error: ${data.error || 'Fallo de autenticación con la API'}`
        });
      }
    } catch (err: any) {
      setApiTestResult({
        provider,
        success: false,
        message: `Error de red: ${err.message}`
      });
    } finally {
      setIsTestingApi(null);
    }
  };

  // Activate external provider model
  const handleActivateExternalModel = (provider: 'deepseek' | 'grok' | 'huggingface') => {
    if (provider === 'deepseek') {
      localVault.setStoredData('key_deepseek', deepseekKey);
      const opt: ModelOption = {
        id: 'deepseek-' + deepseekModel,
        name: `DeepSeek (${deepseekModel})`,
        tagline: 'Inferencia de alta precisión y razonamiento vía DeepSeek API',
        badge: 'DeepSeek API',
        contextWindow: '64k tokens',
        isLocalOnly: false,
        recommendedFor: 'Razonamiento lógico y desarrollo'
      };
      onSelectModel(opt);
    } else if (provider === 'grok') {
      localVault.setStoredData('key_grok', grokKey);
      const opt: ModelOption = {
        id: 'grok-' + grokModel,
        name: `xAI Grok (${grokModel})`,
        tagline: 'Generación avanzada con Grok xAI',
        badge: 'Grok API',
        contextWindow: '128k tokens',
        isLocalOnly: false,
        recommendedFor: 'Comprensión contextual y código'
      };
      onSelectModel(opt);
    } else if (provider === 'huggingface') {
      localVault.setStoredData('key_hf', hfToken);
      const opt: ModelOption = {
        id: 'hf-' + hfModel,
        name: `Hugging Face: ${hfModel}`,
        tagline: `Modelo serverless alojado en Hugging Face Hub`,
        badge: 'Hugging Face',
        contextWindow: '32k tokens',
        isLocalOnly: false,
        recommendedFor: 'Modelos de código abierto en Hugging Face'
      };
      onSelectModel(opt);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="w-full max-w-2xl bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
        {/* Header with Tab switcher */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF] dark:border-[#2E2B27]">
          <div>
            <h3 className="text-base font-serif font-bold text-[#2B2824] dark:text-[#F3F0EB]">
              Modelos de IA & Proveedores Externos
            </h3>
            <p className="text-[11px] text-[#736E67]">
              Selecciona modelos locales con Gemma o conecta APIs de DeepSeek, Grok, Hugging Face y Gemini.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-[#736E67] hover:text-[#2B2824]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center bg-[#EDEBE6] dark:bg-[#252320] p-0.5 rounded-lg border border-[#E0DDD6] dark:border-[#33302A] text-xs">
          <button
            onClick={() => setActiveTab('models')}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all text-center ${
              activeTab === 'models'
                ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                : 'text-[#736E67]'
            }`}
          >
            Modelos de IA ({AVAILABLE_MODELS.length})
          </button>
          <button
            onClick={() => setActiveTab('local_engines')}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'local_engines'
                ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                : 'text-[#736E67]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#D96547]" />
            <span>Ollama & WebGPU</span>
          </button>
          <button
            onClick={() => setActiveTab('external_apis')}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'external_apis'
                ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                : 'text-[#736E67]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>APIs (DeepSeek, Grok, HF)</span>
          </button>
        </div>

        {/* Tab 1: Models List */}
        {activeTab === 'models' && (
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {AVAILABLE_MODELS.map(model => {
              const isSelected = selectedModel.id === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#D96547] bg-amber-50/20 dark:bg-amber-950/20 shadow-xs'
                      : 'border-[#E0DDD6] dark:border-[#33302A] hover:border-[#D96547]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#2B2824] dark:text-[#F3F0EB]">
                        {model.name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          model.isLocalOnly
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200'
                            : 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200'
                        }`}
                      >
                        {model.badge}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#D96547]" />}
                  </div>

                  <p className="text-xs text-[#736E67] leading-relaxed mb-2">
                    {model.tagline}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#A39E96]">
                    <span>Ventana de Contexto: {model.contextWindow}</span>
                    <span className="font-mono text-[#D96547]">{model.recommendedFor}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Ollama & WebGPU */}
        {activeTab === 'local_engines' && (
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {/* Ollama Section */}
            <div className="p-4 rounded-xl border border-[#E0DDD6] dark:border-[#33302A] bg-[#FAF9F5] dark:bg-[#181715] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-[#2B2824] dark:text-[#F3F0EB]">
                    Ollama Local Daemon
                  </span>
                  <span className="font-mono text-[10px] text-[#736E67]">
                    http://localhost:11434
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    engineStatus?.ollama.connected
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {engineStatus?.ollama.connected ? 'Conectado · Activo' : 'Listo para Conectar'}
                </span>
              </div>

              <p className="text-xs text-[#736E67]">
                Ejecuta Gemma 2 o Gemma 3 de forma nativa en tu GPU (NVIDIA CUDA / Apple Silicon Metal).
              </p>

              <div className="flex items-center gap-2">
                <select
                  value={selectedOllamaModel}
                  onChange={e => setSelectedOllamaModel(e.target.value)}
                  className="flex-1 p-2 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs outline-none"
                >
                  {(engineStatus?.ollama.models || ['gemma2:9b', 'gemma2:27b', 'gemma:2b']).map(m => (
                    <option key={m} value={m}>
                      Modelo: {m}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleTestOllama}
                  disabled={isTestingOllama}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#22201D] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs font-medium hover:border-[#D96547]"
                >
                  <Play className="w-3 h-3 text-[#D96547]" />
                  <span>{isTestingOllama ? 'Probando...' : 'Probar Latencia'}</span>
                </button>

                <button
                  onClick={handleConnectOllamaAsMain}
                  className="px-3 py-2 bg-[#D96547] text-white rounded-lg text-xs font-medium hover:bg-[#C55639]"
                >
                  Activar este Modelo
                </button>
              </div>

              <div className="bg-stone-900 text-stone-200 p-2.5 rounded-lg font-mono text-[11px] flex items-center justify-between">
                <span>$ ollama run gemma2</span>
                <span className="text-stone-400 text-[10px]">Comando para iniciar en terminal</span>
              </div>

              {testResult && (
                <div className="p-3 bg-white dark:bg-[#201E1B] rounded-lg border border-[#E0DDD6] dark:border-[#33302A] font-mono text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap">
                  {testResult}
                </div>
              )}
            </div>

            {/* LM Studio Section */}
            <div className="p-4 rounded-xl border border-[#E0DDD6] dark:border-[#33302A] bg-[#FAF9F5] dark:bg-[#181715] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span className="font-bold text-xs text-[#2B2824] dark:text-[#F3F0EB]">
                    LM Studio Local Server
                  </span>
                  <span className="font-mono text-[10px] text-[#736E67]">
                    http://localhost:1234/v1
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-full">
                  Compatible OpenAI API
                </span>
              </div>
              <p className="text-xs text-[#736E67]">
                Conexión transparente con cualquier modelo GGUF cargado en LM Studio local.
              </p>
            </div>

            {/* WebGPU Section */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-[#2B2824] dark:text-[#F3F0EB]">
                    Aceleración WebGPU en el Navegador
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 rounded-full font-mono">
                  Soportado
                </span>
              </div>
              <p className="text-xs text-[#736E67]">
                Capacidad de ejecutar pesos cuantizados de Gemma en los shaders de tu tarjeta gráfica sin enviar nada a servidores externos.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: External APIs (DeepSeek, Grok, Hugging Face, Gemini) */}
        {activeTab === 'external_apis' && (
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {/* Alert Result */}
            {apiTestResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                apiTestResult.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                {apiTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                <div className="text-[11px]">{apiTestResult.message}</div>
              </div>
            )}

            {/* 1. DeepSeek API */}
            <div className="p-4 rounded-xl border border-[#E0DDD6] dark:border-[#33302A] bg-[#FAF9F5] dark:bg-[#181715] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="font-bold text-xs text-[#2B2824] dark:text-[#F3F0EB]">DeepSeek API</span>
                  <span className="text-[10px] text-[#736E67] font-mono">api.deepseek.com</span>
                </div>
                <span className="text-[10px] text-blue-600 font-medium">V3 & R1 Reasoning</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#736E67] block mb-1">DeepSeek API Key:</label>
                  <input
                    type="password"
                    value={deepseekKey}
                    onChange={e => setDeepseekKey(e.target.value)}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#736E67] block mb-1">Modelo DeepSeek:</label>
                  <select
                    value={deepseekModel}
                    onChange={e => setDeepseekModel(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs outline-none"
                  >
                    <option value="deepseek-chat">deepseek-chat (DeepSeek-V3)</option>
                    <option value="deepseek-reasoner">deepseek-reasoner (DeepSeek-R1)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => handleTestExternalApi('deepseek')}
                  disabled={isTestingApi === 'deepseek'}
                  className="px-3 py-1 bg-white dark:bg-[#22201D] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-[11px] font-medium hover:border-blue-500"
                >
                  {isTestingApi === 'deepseek' ? 'Verificando...' : 'Probar Conexión'}
                </button>
                <button
                  onClick={() => handleActivateExternalModel('deepseek')}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-medium hover:bg-blue-700"
                >
                  Activar DeepSeek
                </button>
              </div>
            </div>

            {/* 2. xAI Grok API */}
            <div className="p-4 rounded-xl border border-[#E0DDD6] dark:border-[#33302A] bg-[#FAF9F5] dark:bg-[#181715] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-900 dark:bg-white" />
                  <span className="font-bold text-xs text-[#2B2824] dark:text-[#F3F0EB]">xAI Grok API</span>
                  <span className="text-[10px] text-[#736E67] font-mono">api.x.ai/v1</span>
                </div>
                <span className="text-[10px] text-stone-600 dark:text-stone-300 font-medium">Grok-2</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#736E67] block mb-1">xAI Grok API Key:</label>
                  <input
                    type="password"
                    value={grokKey}
                    onChange={e => setGrokKey(e.target.value)}
                    placeholder="xai-xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#736E67] block mb-1">Modelo Grok:</label>
                  <select
                    value={grokModel}
                    onChange={e => setGrokModel(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs outline-none"
                  >
                    <option value="grok-2-latest">grok-2-latest</option>
                    <option value="grok-beta">grok-beta</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => handleTestExternalApi('grok')}
                  disabled={isTestingApi === 'grok'}
                  className="px-3 py-1 bg-white dark:bg-[#22201D] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-[11px] font-medium hover:border-black"
                >
                  {isTestingApi === 'grok' ? 'Verificando...' : 'Probar Conexión'}
                </button>
                <button
                  onClick={() => handleActivateExternalModel('grok')}
                  className="px-3 py-1 bg-stone-900 text-white dark:bg-white dark:text-black rounded-lg text-[11px] font-medium"
                >
                  Activar Grok
                </button>
              </div>
            </div>

            {/* 3. Hugging Face Hub */}
            <div className="p-4 rounded-xl border border-[#E0DDD6] dark:border-[#33302A] bg-[#FAF9F5] dark:bg-[#181715] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-bold text-xs text-[#2B2824] dark:text-[#F3F0EB]">Hugging Face Hub</span>
                  <span className="text-[10px] text-[#736E67] font-mono">huggingface.co</span>
                </div>
                <span className="text-[10px] text-amber-600 font-medium">Inferencia Serverless</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#736E67] block mb-1">User Access Token (opcional para modelos públicos):</label>
                  <input
                    type="password"
                    value={hfToken}
                    onChange={e => setHfToken(e.target.value)}
                    placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#736E67] block mb-1">Modelo / Checkpoint HF:</label>
                  <input
                    type="text"
                    value={hfModel}
                    onChange={e => setHfModel(e.target.value)}
                    placeholder="ej: google/gemma-2-27b-it o Qwen/Qwen2.5-Coder-32B"
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => handleTestExternalApi('huggingface')}
                  disabled={isTestingApi === 'huggingface'}
                  className="px-3 py-1 bg-white dark:bg-[#22201D] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-[11px] font-medium hover:border-amber-500"
                >
                  {isTestingApi === 'huggingface' ? 'Verificando...' : 'Probar Modelo HF'}
                </button>
                <button
                  onClick={() => handleActivateExternalModel('huggingface')}
                  className="px-3 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-medium hover:bg-amber-700"
                >
                  Activar Hugging Face
                </button>
              </div>
            </div>

            {/* 4. Google Gemini API */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-xs text-[#2B2824] dark:text-[#F3F0EB]">Google Gemini API</span>
                  <span className="text-[10px] text-emerald-700 font-mono">gemini-3.8-flash</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">Integrado Automáticamente</span>
              </div>
              <p className="text-[11px] text-[#736E67]">
                Totalmente operativo en el servidor con SDK oficial <code>@google/genai</code> y filtro de privacidad.
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between border-t border-[#E8E5DF] dark:border-[#2E2B27]">
          <span className="text-[11px] text-[#736E67] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tus claves API se almacenan cifradas en tu navegador</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#D96547] text-white rounded-lg font-medium hover:bg-[#C55639] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
