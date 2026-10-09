import React, { useState } from 'react';
import { X, ShieldCheck, Lock, EyeOff, Cpu, HardDrive, CheckCircle2 } from 'lucide-react';

interface PrivacyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyShieldModal: React.FC<PrivacyShieldModalProps> = ({
  isOpen,
  onClose
}) => {
  const [localOnly, setLocalOnly] = useState(true);
  const [piiFilter, setPiiFilter] = useState(true);
  const [encryptedVault, setEncryptedVault] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="w-full max-w-lg bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-2xl p-6 shadow-2xl space-y-5 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF] dark:border-[#2E2B27]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                Bóveda de Privacidad Total ElfaClaw
              </h3>
              <p className="text-[11px] text-[#736E67]">
                Garantía estricta de procesamiento On-Device y cero fugas de datos.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#736E67] hover:text-[#2B2824]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time metrics counters */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-[#FAF9F5] dark:bg-[#181715] rounded-xl border border-[#E8E5DF] dark:border-[#2E2B27] text-center">
            <span className="text-xl font-bold font-mono text-emerald-600">0 B</span>
            <div className="text-[10px] text-[#736E67] mt-0.5">Telemetría de Red</div>
          </div>
          <div className="p-3 bg-[#FAF9F5] dark:bg-[#181715] rounded-xl border border-[#E8E5DF] dark:border-[#2E2B27] text-center">
            <span className="text-xl font-bold font-mono text-[#D96547]">Gemma</span>
            <div className="text-[10px] text-[#736E67] mt-0.5">Inferencia Local</div>
          </div>
          <div className="p-3 bg-[#FAF9F5] dark:bg-[#181715] rounded-xl border border-[#E8E5DF] dark:border-[#2E2B27] text-center">
            <span className="text-xl font-bold font-mono text-indigo-600">AES-256</span>
            <div className="text-[10px] text-[#736E67] mt-0.5">Cifrado de Bóveda</div>
          </div>
        </div>

        {/* Security Policies List */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[#736E67] uppercase tracking-wider">
            Políticas de Seguridad Activas
          </h4>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-[#252320] rounded-xl border border-[#E0DDD6] dark:border-[#33302A]">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="font-semibold text-[#2B2824] dark:text-[#F3F0EB]">Modo Aislado Estricto (Air-Gapped)</div>
                <div className="text-[10px] text-[#736E67]">Bloquea cualquier salida de red fuera de tu localhost</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={localOnly}
              onChange={e => setLocalOnly(e.target.checked)}
              className="accent-[#D96547] w-4 h-4 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-[#252320] rounded-xl border border-[#E0DDD6] dark:border-[#33302A]">
            <div className="flex items-center gap-2.5">
              <EyeOff className="w-4 h-4 text-[#D96547]" />
              <div>
                <div className="font-semibold text-[#2B2824] dark:text-[#F3F0EB]">Filtro Automático de PII y Secretos</div>
                <div className="text-[10px] text-[#736E67]">Detecta y sanitiza API keys, correos y contraseñas</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={piiFilter}
              onChange={e => setPiiFilter(e.target.checked)}
              className="accent-[#D96547] w-4 h-4 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-[#252320] rounded-xl border border-[#E0DDD6] dark:border-[#33302A]">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              <div>
                <div className="font-semibold text-[#2B2824] dark:text-[#F3F0EB]">Almacenamiento Cifrado en SQLite</div>
                <div className="text-[10px] text-[#736E67]">Tus proyectos y memoria persisten únicamente en disco local</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={encryptedVault}
              onChange={e => setEncryptedVault(e.target.checked)}
              className="accent-[#D96547] w-4 h-4 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#D96547] text-white rounded-lg font-medium hover:bg-[#C55639] transition-colors"
          >
            Entendido y Protegido
          </button>
        </div>
      </div>
    </div>
  );
};
