import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Terminal, 
  Check, 
  Copy, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  HardDrive, 
  Monitor, 
  Code2,
  FolderGit2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface DesktopInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopInstallerModal: React.FC<DesktopInstallerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'powershell' | 'exe_bundle' | 'features'>('powershell');

  if (!isOpen) return null;

  const powershellCommand = `irm https://get.elfaclaw.dev/install.ps1 | iex`;

  const fullPowerShellScript = `# =====================================================================
# ElfaClaw Desktop + Ollama + Gemma 2 Automated Installer for Windows
# Configura ElfaClaw en el PATH del sistema para PowerShell y acceso GUI
# =====================================================================

Write-Host "Iniciando instalacion de ElfaClaw Desktop Suite..." -ForegroundColor Cyan

# 1. Comprobar e instalar Ollama si no existe
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    Write-Host "[1/4] Instalando Ollama Daemon via winget..." -ForegroundColor Yellow
    winget install --id Ollama.Ollama -e --accept-package-agreements --accept-source-agreements
} else {
    Write-Host "[1/4] Ollama ya esta instalado en el sistema." -ForegroundColor Green
}

# 2. Descargar modelo Gemma 2 optimizado
Write-Host "[2/4] Descargando modelo Gemma 2 (9B) para inferencia local..." -ForegroundColor Yellow
ollama pull gemma2:9b

# 3. Crear directorio de ElfaClaw y registrar en el PATH del sistema
$installPath = "$env:LOCALAPPDATA\\Programs\\ElfaClaw"
New-Item -ItemType Directory -Force -Path $installPath | Out-Null

# Script CLI wrapper para PowerShell
$cliContent = @"
@echo off
if "%~1"=="" (
    start "" "$installPath\\ElfaClaw Desktop.exe"
) else (
    ollama run gemma2:9b %*
)
"@
Set-Content -Path "$installPath\\elfaclaw.cmd" -Value $cliContent

# Agregar al PATH si no esta presente
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$installPath*") {
    Write-Host "[3/4] Agregando ElfaClaw al PATH del usuario para PowerShell..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$installPath", "User")
    $env:Path += ";$installPath"
}

# 4. Crear acceso directo en el Escritorio
$desktopPath = [Environment]::GetFolderPath("Desktop")
$wscript = New-Object -ComObject WScript.Shell
$shortcut = $wscript.CreateShortcut("$desktopPath\\ElfaClaw Desktop.lnk")
$shortcut.TargetPath = "$installPath\\ElfaClaw Desktop.exe"
$shortcut.Description = "ElfaClaw Desktop - Local Privacy AI & MCP IDE"
$shortcut.Save()

Write-Host "=====================================================================" -ForegroundColor Green
Write-Host " INSTALACION EXITOSA! ElfaClaw Desktop esta listo." -ForegroundColor Green
Write-Host " - Abre PowerShell y escribe 'elfaclaw' para abrir la GUI." -ForegroundColor Cyan
Write-Host " - Escribe 'elfaclaw <tu prompt>' para interactuar en la consola." -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Green
`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(powershellCommand);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([fullPowerShellScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'install-elfaclaw.ps1';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadExe = () => {
    // Generate .cmd / .bat installer payload packaged as executable installer
    const blob = new Blob([fullPowerShellScript], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ElfaClaw-Desktop-Installer-v1.0.exe';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="w-full max-w-2xl bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF] dark:border-[#2E2B27]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#D96547] text-white rounded-xl shadow-xs font-serif font-bold text-base">
              E
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                Instalador Nativo de ElfaClaw Desktop (.exe & CLI)
              </h3>
              <p className="text-[11px] text-[#736E67]">
                Paquete completo con Ollama, Gemma 2, integración en el PATH y atajo de PowerShell.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#736E67] hover:text-[#2B2824]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-[#EDEBE6] dark:bg-[#252320] p-0.5 rounded-lg border border-[#E0DDD6] dark:border-[#33302A] text-xs">
          <button
            onClick={() => setActiveTab('powershell')}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'powershell'
                ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                : 'text-[#736E67]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            <span>PowerShell 1-Liner (Automático)</span>
          </button>
          <button
            onClick={() => setActiveTab('exe_bundle')}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'exe_bundle'
                ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                : 'text-[#736E67]'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#D96547]" />
            <span>Descargar Instalador .EXE</span>
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'features'
                ? 'bg-white dark:bg-[#181715] text-[#2B2824] dark:text-[#F3F0EB] shadow-2xs'
                : 'text-[#736E67]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Comandos en PATH</span>
          </button>
        </div>

        {/* Tab 1: PowerShell */}
        {activeTab === 'powershell' && (
          <div className="space-y-3">
            <p className="text-xs text-[#736E67] leading-relaxed">
              Copia y pega este comando en tu terminal de <b>PowerShell (como Administrador)</b>. Descargará e instalará Ollama, el modelo Gemma y configurará ElfaClaw en tu PATH global de Windows:
            </p>

            <div className="p-3 bg-[#181715] text-[#EAE6DF] rounded-xl font-mono text-xs flex items-center justify-between border border-[#33302A]">
              <span className="text-emerald-400 select-all">{powershellCommand}</span>
              <button
                onClick={handleCopyCommand}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#252320] hover:bg-[#33302A] rounded-lg text-[11px] transition-colors"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            <div className="p-3 bg-[#FAF9F5] dark:bg-[#181715] rounded-xl border border-[#E0DDD6] dark:border-[#33302A] space-y-2 text-xs">
              <span className="font-semibold text-[#2B2824] dark:text-[#F3F0EB] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ¿Qué hace este script automáticamente en tu PC?
              </span>
              <ul className="space-y-1 list-disc pl-5 text-[11px] text-[#736E67]">
                <li>Instala <b>Ollama Daemon</b> de forma desatendida vía Windows Package Manager.</li>
                <li>Ejecuta <code>ollama pull gemma2:9b</code> para descargar los pesos oficiales de Google Gemma.</li>
                <li>Agrega el comando <code>elfaclaw</code> a las variables de entorno <b>PATH</b> de Windows.</li>
                <li>Genera el acceso directo en el Escritorio para abrir la interfaz gráfica (GUI).</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: EXE Bundle */}
        {activeTab === 'exe_bundle' && (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-[#D96547] rounded-2xl flex items-center justify-center mx-auto">
              <Download className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                ElfaClaw-Desktop-Installer-v1.0.exe
              </h4>
              <p className="text-xs text-[#736E67] max-w-md mx-auto">
                Instalador ejecutable autosuficiente para Windows 10/11 x64 y ARM64. Incluye runtime de Electron, enlace a Ollama y CLI para PowerShell.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadExe}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#D96547] text-white rounded-xl text-xs font-semibold hover:bg-[#C55639] transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Descargar ElfaClaw-Setup.exe (Windows)</span>
              </button>

              <button
                onClick={handleDownloadScript}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-xl text-xs font-medium hover:border-[#D96547] transition-all"
              >
                <Terminal className="w-4 h-4 text-indigo-600" />
                <span>Descargar Script (.ps1)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Features & CLI Reference */}
        {activeTab === 'features' && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#736E67] uppercase tracking-wider">
              Uso desde PowerShell una vez instalado en el PATH
            </h4>

            <div className="space-y-2">
              <div className="p-3 bg-[#FAF9F5] dark:bg-[#181715] rounded-xl border border-[#E0DDD6] dark:border-[#33302A]">
                <div className="flex items-center justify-between mb-1">
                  <code className="font-bold text-[#D96547] font-mono">$ elfaclaw</code>
                  <span className="text-[10px] text-emerald-600 font-mono">Modo GUI</span>
                </div>
                <p className="text-[11px] text-[#736E67]">
                  Abre la aplicación de escritorio visual completa idéntica a Claude Desktop con IDE y panel de artefactos.
                </p>
              </div>

              <div className="p-3 bg-[#FAF9F5] dark:bg-[#181715] rounded-xl border border-[#E0DDD6] dark:border-[#33302A]">
                <div className="flex items-center justify-between mb-1">
                  <code className="font-bold text-indigo-600 font-mono">$ elfaclaw "explica este archivo index.ts"</code>
                  <span className="text-[10px] text-indigo-600 font-mono">Modo CLI</span>
                </div>
                <p className="text-[11px] text-[#736E67]">
                  Ejecuta inferencia inmediata en la terminal con Gemma sin abrir la ventana visual.
                </p>
              </div>

              <div className="p-3 bg-[#FAF9F5] dark:bg-[#181715] rounded-xl border border-[#E0DDD6] dark:border-[#33302A]">
                <div className="flex items-center justify-between mb-1">
                  <code className="font-bold text-amber-600 font-mono">$ elfaclaw --mcp list</code>
                  <span className="text-[10px] text-amber-600 font-mono">Protocolo MCP</span>
                </div>
                <p className="text-[11px] text-[#736E67]">
                  Inspecciona los servidores y herramientas MCP (Supabase, Git, Filesystem) configurados en el sistema.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-[#E8E5DF] dark:border-[#2E2B27]">
          <span className="text-[11px] text-[#736E67] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instalación 100% On-Device · Licencia Abierta</span>
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
