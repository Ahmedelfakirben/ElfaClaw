import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  Link, 
  Play, 
  Save, 
  Lock, 
  Database, 
  GitBranch,
  RefreshCw
} from 'lucide-react';
import { McpServer } from '../types';
import { verifyMcpServerAuth } from '../services/mcpClient';

interface McpConfigAuthModalProps {
  server: McpServer | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveServer: (updatedServer: McpServer) => void;
}

export const McpConfigAuthModal: React.FC<McpConfigAuthModalProps> = ({
  server,
  isOpen,
  onClose,
  onSaveServer
}) => {
  if (!isOpen || !server) return null;

  const [fields, setFields] = useState(() => {
    return server.authConfig?.fields || [];
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFieldChange = (key: string, value: string) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, value } : f));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const tempServer: McpServer = {
      ...server,
      authConfig: {
        isConfigured: true,
        fields,
        testStatus: 'untested'
      }
    };

    const result = await verifyMcpServerAuth(tempServer);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSave = () => {
    const updatedServer: McpServer = {
      ...server,
      status: 'active',
      installed: true,
      authConfig: {
        isConfigured: true,
        lastTested: Date.now(),
        testStatus: testResult?.success ? 'success' : 'failed',
        errorMessage: testResult?.success ? undefined : testResult?.message,
        fields
      }
    };

    onSaveServer(updatedServer);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="w-full max-w-lg bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF] dark:border-[#2E2B27]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                Configurar & Autenticar: {server.name}
              </h3>
              <p className="text-[11px] text-[#736E67]">
                Ingresa credenciales y parámetros de conexión para el servidor MCP.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#736E67] hover:text-[#2B2824]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Server Command Badge */}
        <div className="p-2.5 bg-[#FAF9F5] dark:bg-[#181715] rounded-xl border border-[#E8E5DF] dark:border-[#2E2B27] flex items-center justify-between font-mono text-[11px]">
          <span className="text-[#736E67]">Ejecutable MCP:</span>
          <span className="font-bold text-[#D96547]">{server.command} {server.args.join(' ')}</span>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          {fields.length === 0 ? (
            <p className="text-xs text-[#736E67]">
              Este servidor MCP no requiere credenciales secretas externas y funciona de forma local.
            </p>
          ) : (
            fields.map(field => (
              <div key={field.key} className="space-y-1">
                <label className="block text-xs font-medium text-[#2B2824] dark:text-[#EAE6DF] flex items-center justify-between">
                  <span>{field.label}</span>
                  {field.required && <span className="text-red-500 text-[10px]">* Requerido</span>}
                </label>
                <div className="relative">
                  <input
                    type={field.type === 'password' ? 'password' : 'text'}
                    value={field.value}
                    onChange={e => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 bg-white dark:bg-[#252320] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs outline-none focus:border-[#D96547] font-mono text-[#2B2824] dark:text-[#EAE6DF]"
                  />
                  {field.type === 'password' && (
                    <Lock className="w-3.5 h-3.5 text-[#A39E96] absolute right-3 top-2.5" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Test Result Alert */}
        {testResult && (
          <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
            testResult.success
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-800 dark:text-red-300'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold">{testResult.success ? 'Conexión Exitosa' : 'Error de Autenticación'}</div>
              <div className="text-[11px] mt-0.5">{testResult.message}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-[#E8E5DF] dark:border-[#2E2B27]">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#252320] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs font-medium hover:border-[#D96547] transition-colors"
          >
            {isTesting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D96547]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#D96547]" />
            )}
            <span>{isTesting ? 'Verificando...' : 'Probar Autenticación & Conexión'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#736E67] hover:text-[#2B2824]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#D96547] text-white rounded-lg text-xs font-medium hover:bg-[#C55639] transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar & Activar MCP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
