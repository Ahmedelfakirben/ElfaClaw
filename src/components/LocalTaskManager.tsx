import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  FolderGit2, 
  Trash2,
  ListTodo
} from 'lucide-react';
import { LocalTask } from '../types';

export const LocalTaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<LocalTask[]>([
    {
      id: 'task-1',
      title: 'Auditoría y refactorización de tipos TypeScript',
      description: 'Escanear archivos /src, detectar fallos de tipado estricto e integrar validación.',
      status: 'completed',
      mcpToolToUse: 'filesystem.read_file',
      createdAt: Date.now() - 86400000,
      steps: [
        { id: 's1', text: 'Leer código de App.tsx y taskRunner.ts con MCP', done: true },
        { id: 's2', text: 'Ejecutar linter TypeScript en sandbox aislado', done: true },
        { id: 's3', text: 'Registrar informe en bóveda SQLite local', done: true }
      ]
    },
    {
      id: 'task-2',
      title: 'Suite de pruebas de integración con Vitest',
      description: 'Generar pruebas unitarias completas para los clientes MCP y ejecutar vitest run.',
      status: 'in_progress',
      mcpToolToUse: 'code_runner.execute_tests',
      createdAt: Date.now() - 3600000,
      steps: [
        { id: 's1', text: 'Inspeccionar tests/testRunner.test.ts', done: true },
        { id: 's2', text: 'Simular ejecución de tests sin salida de red', done: true },
        { id: 's3', text: 'Generar reporte de cobertura de código', done: false }
      ]
    },
    {
      id: 'task-3',
      title: 'Configurar servidor MCP PostgreSQL local',
      description: 'Crear definición en claude_desktop_config.json para base de datos local.',
      status: 'todo',
      mcpToolToUse: 'filesystem.write_file',
      createdAt: Date.now() - 1800000,
      steps: [
        { id: 's1', text: 'Definir cadena de conexión local uvx mcp-server-postgres', done: false },
        { id: 's2', text: 'Probar listado de tablas con esquema local', done: false }
      ]
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: LocalTask = {
      id: 'task-' + Date.now(),
      title: newTaskTitle,
      description: newTaskDesc || 'Tarea creada para ejecución local con Gemma',
      status: 'todo',
      mcpToolToUse: 'code_runner.run_node_script',
      createdAt: Date.now(),
      steps: [
        { id: '1', text: 'Analizar contexto del proyecto con Gemma', done: false },
        { id: '2', text: 'Ejecutar herramienta MCP correspondiente', done: false },
        { id: '3', text: 'Guardar cambios con cero egress de telemetría', done: false }
      ]
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowNewModal(false);
  };

  const handleExecuteTask = (taskId: string) => {
    setRunningTaskId(taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'in_progress' } : t));

    // Simulate step by step execution
    setTimeout(() => {
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          const updatedSteps = t.steps.map(s => ({ ...s, done: true }));
          return { ...t, status: 'completed', steps: updatedSteps };
        }
        return t;
      }));
      setRunningTaskId(null);
    }, 1500);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-2.75rem)] bg-[#FAF9F5] dark:bg-[#181715] text-[#2B2824] dark:text-[#EAE6DF] overflow-y-auto select-none p-6">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DF] dark:border-[#2E2B27]">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-serif font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                Gestor de Tareas Locales ElfaClaw
              </h2>
            </div>
            <p className="text-xs text-[#736E67] dark:text-[#A39E96] mt-1">
              Planificación y ejecución autónoma de tareas de desarrollo con privacidad total On-Device.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded-lg border border-emerald-200 dark:border-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>0 B Egress Garantizado</span>
            </div>

            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D96547] text-white rounded-lg text-xs font-medium hover:bg-[#C55639] transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Tarea</span>
            </button>
          </div>
        </div>

        {/* New Task Modal */}
        {showNewModal && (
          <form onSubmit={handleCreateTask} className="p-4 bg-white dark:bg-[#201E1B] border border-[#D96547] rounded-xl shadow-md space-y-3">
            <h4 className="text-xs font-semibold text-[#2B2824] dark:text-[#F3F0EB]">
              Crear nueva tarea para ElfaClaw
            </h4>
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="Título de la tarea (ej: Implementar validación de formularios)"
              className="w-full px-3 py-2 bg-[#FAF9F5] dark:bg-[#181715] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs outline-none"
              autoFocus
            />
            <textarea
              value={newTaskDesc}
              onChange={e => setNewTaskDesc(e.target.value)}
              placeholder="Detalles o especificaciones para el agente de código local..."
              rows={2}
              className="w-full px-3 py-2 bg-[#FAF9F5] dark:bg-[#181715] border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3 py-1.5 text-xs text-[#736E67] hover:text-[#2B2824]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#D96547] text-white text-xs font-medium rounded-lg"
              >
                Crear Tarea
              </button>
            </div>
          </form>
        )}

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Col 1: Todo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#736E67] uppercase tracking-wider pb-1">
              <span>Por Hacer ({tasks.filter(t => t.status === 'todo').length})</span>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'todo').map(task => (
                <div key={task.id} className="p-4 bg-white dark:bg-[#201E1B] border border-[#E0DDD6] dark:border-[#33302A] rounded-xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                      {task.title}
                    </span>
                    <button onClick={() => handleDeleteTask(task.id)} className="text-[#A39E96] hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#736E67] leading-relaxed">{task.description}</p>
                  
                  <div className="space-y-1.5 pt-1">
                    {task.steps.map(s => (
                      <div key={s.id} className="flex items-center gap-2 text-[11px] text-[#736E67]">
                        <Clock className="w-3 h-3 text-[#A39E96]" />
                        <span>{s.text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleExecuteTask(task.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#FAF9F5] dark:bg-[#282622] hover:bg-[#D96547] hover:text-white border border-[#E0DDD6] dark:border-[#33302A] rounded-lg text-xs font-medium transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>Ejecutar con Gemma</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: In Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-700 uppercase tracking-wider pb-1">
              <span>En Progreso ({tasks.filter(t => t.status === 'in_progress').length})</span>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'in_progress').map(task => (
                <div key={task.id} className="p-4 bg-amber-50/30 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 rounded-xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                      {task.title}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  </div>
                  <p className="text-xs text-[#736E67] leading-relaxed">{task.description}</p>
                  
                  <div className="space-y-1.5 pt-1">
                    {task.steps.map(s => (
                      <div key={s.id} className="flex items-center gap-2 text-[11px] text-[#2B2824] dark:text-[#EAE6DF]">
                        {s.done ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-500 animate-spin" />
                        )}
                        <span className={s.done ? 'line-through text-[#A39E96]' : ''}>{s.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-amber-700 font-mono text-center">
                    {runningTaskId === task.id ? 'Ejecutando pasos localmente...' : 'En cola de procesamiento'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Completed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 uppercase tracking-wider pb-1">
              <span>Completadas ({tasks.filter(t => t.status === 'completed').length})</span>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'completed').map(task => (
                <div key={task.id} className="p-4 bg-white dark:bg-[#201E1B] border border-emerald-200 dark:border-emerald-900 rounded-xl shadow-xs space-y-3 opacity-90">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2B2824] dark:text-[#F3F0EB]">
                      {task.title}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-[#736E67] leading-relaxed">{task.description}</p>
                  
                  <div className="space-y-1.5 pt-1">
                    {task.steps.map(s => (
                      <div key={s.id} className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{s.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/30 p-1.5 rounded text-center">
                    ✓ Validado On-Device (0 fugas)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
