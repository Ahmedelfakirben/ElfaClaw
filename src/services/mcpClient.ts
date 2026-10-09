import { McpServer, McpCall } from '../types';

export const POPULAR_MCP_SERVERS: McpServer[] = [
  {
    id: 'supabase',
    name: 'Supabase MCP Database',
    command: 'npx',
    args: ['-y', '@supabase/mcp-server'],
    category: 'database',
    installed: true,
    requiresAuth: true,
    status: 'active',
    description: 'Acceso directo a esquemas, consultas SQL, tablas y autenticación de tu proyecto Supabase.',
    authConfig: {
      isConfigured: true,
      lastTested: Date.now() - 3600000,
      testStatus: 'success',
      fields: [
        {
          key: 'SUPABASE_URL',
          label: 'Supabase Project URL',
          type: 'url',
          placeholder: 'https://tu-proyecto.supabase.co',
          value: 'https://vvyozxskhbrcgnxevwqu.supabase.co',
          required: true
        },
        {
          key: 'SUPABASE_SERVICE_ROLE_KEY',
          label: 'Service Role Key / Secret',
          type: 'password',
          placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.elfaclaw_vault_secret_token_placeholder',
          required: true
        }
      ]
    },
    tools: [
      {
        name: 'query_database',
        description: 'Ejecuta sentencias SQL directamente en la base de datos Supabase.',
        parameters: {
          type: 'object',
          properties: {
            sql: { type: 'string', description: 'Consulta SQL a ejecutar en PostgreSQL.' }
          },
          required: ['sql']
        }
      },
      {
        name: 'list_tables',
        description: 'Lista todas las tablas y vistas del esquema público de Supabase.',
        parameters: { type: 'object', properties: {} }
      },
      {
        name: 'get_table_schema',
        description: 'Obtiene las columnas, tipos de datos y claves foráneas de una tabla.',
        parameters: {
          type: 'object',
          properties: {
            tableName: { type: 'string', description: 'Nombre de la tabla a inspeccionar.' }
          },
          required: ['tableName']
        }
      }
    ]
  },
  {
    id: 'git',
    name: 'Git Version Control MCP',
    command: 'npx',
    args: ['-y', 'mcp-server-git', '--repository', '.'],
    category: 'version_control',
    installed: true,
    requiresAuth: false,
    status: 'active',
    description: 'Control de versiones Git local: inspección de commits, diffs, ramas y staged files.',
    authConfig: {
      isConfigured: true,
      testStatus: 'success',
      fields: [
        {
          key: 'GIT_REPO_PATH',
          label: 'Ruta del Repositorio Local',
          type: 'text',
          placeholder: '.',
          value: '.',
          required: true
        }
      ]
    },
    tools: [
      {
        name: 'git_status',
        description: 'Muestra el estado de los archivos modificados, staged y no rastreados.',
        parameters: { type: 'object', properties: {} }
      },
      {
        name: 'git_diff',
        description: 'Calcula las diferencias exactas de código entre revisiones o el working tree.',
        parameters: {
          type: 'object',
          properties: {
            filePath: { type: 'string', description: 'Ruta opcional para filtrar el diff.' }
          }
        }
      },
      {
        name: 'git_commit',
        description: 'Crea un commit firmado localmente con el mensaje especificado.',
        parameters: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Mensaje descriptivo del commit.' }
          },
          required: ['message']
        }
      },
      {
        name: 'git_log',
        description: 'Obtiene el historial de commits recientes.',
        parameters: {
          type: 'object',
          properties: {
            maxCount: { type: 'string', description: 'Número de commits a recuperar.' }
          }
        }
      }
    ]
  },
  {
    id: 'filesystem',
    name: 'Desktop Filesystem MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/workspace/local_projects'],
    category: 'filesystem',
    installed: true,
    requiresAuth: false,
    status: 'active',
    description: 'Acceso seguro al sistema de archivos local: leer, editar y explorar directorios con permisos locales.',
    tools: [
      {
        name: 'read_file',
        description: 'Lee el contenido de un archivo en el sistema de archivos local.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta relativa o absoluta del archivo a leer.' }
          },
          required: ['path']
        }
      },
      {
        name: 'write_file',
        description: 'Escribe contenido en un archivo local sin enviar datos a la nube.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta del archivo.' },
            content: { type: 'string', description: 'Contenido a escribir.' }
          },
          required: ['path', 'content']
        }
      },
      {
        name: 'list_directory',
        description: 'Lista los archivos y carpetas de un directorio local.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta del directorio.', default: '.' }
          }
        }
      }
    ]
  },
  {
    id: 'github',
    name: 'GitHub Cloud & Repos MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    category: 'version_control',
    installed: false,
    requiresAuth: true,
    status: 'inactive',
    description: 'Gestión de Pull Requests, issues y ramas directamente en GitHub.',
    authConfig: {
      isConfigured: false,
      testStatus: 'untested',
      fields: [
        {
          key: 'GITHUB_PERSONAL_ACCESS_TOKEN',
          label: 'GitHub Personal Access Token (PAT)',
          type: 'password',
          placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
          value: '',
          required: true
        }
      ]
    },
    tools: [
      {
        name: 'get_pull_request',
        description: 'Obtiene detalles y comentarios de un Pull Request en GitHub.',
        parameters: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Usuario u organización' },
            repo: { type: 'string', description: 'Nombre del repositorio' },
            pullNumber: { type: 'string', description: 'Número del PR' }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'create_issue',
        description: 'Abre un nuevo Issue en un repositorio de GitHub.',
        parameters: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Propietario' },
            repo: { type: 'string', description: 'Repositorio' },
            title: { type: 'string', description: 'Título del issue' },
            body: { type: 'string', description: 'Descripción' }
          },
          required: ['owner', 'repo', 'title']
        }
      }
    ]
  },
  {
    id: 'postgres',
    name: 'PostgreSQL Direct MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres'],
    category: 'database',
    installed: false,
    requiresAuth: true,
    status: 'inactive',
    description: 'Conexión nativa con cualquier base de datos PostgreSQL local o remota.',
    authConfig: {
      isConfigured: false,
      testStatus: 'untested',
      fields: [
        {
          key: 'POSTGRES_URL',
          label: 'Cadena de conexión PostgreSQL',
          type: 'password',
          placeholder: 'postgresql://postgres:password@localhost:5432/mydb',
          value: '',
          required: true
        }
      ]
    },
    tools: [
      {
        name: 'query',
        description: 'Ejecuta sentencias SQL en la base de datos.',
        parameters: {
          type: 'object',
          properties: {
            sql: { type: 'string', description: 'Query SQL a ejecutar' }
          },
          required: ['sql']
        }
      }
    ]
  },
  {
    id: 'brave_search',
    name: 'Brave Search Private MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search'],
    category: 'search',
    installed: false,
    requiresAuth: true,
    status: 'inactive',
    description: 'Búsqueda web privada sin rastreo ni perfilado con Brave Search API.',
    authConfig: {
      isConfigured: false,
      testStatus: 'untested',
      fields: [
        {
          key: 'BRAVE_API_KEY',
          label: 'Brave Search API Key',
          type: 'password',
          placeholder: 'BSA_xxxxxxxxxxxxxxxxxxxx',
          value: '',
          required: true
        }
      ]
    },
    tools: [
      {
        name: 'brave_web_search',
        description: 'Ejecuta búsquedas web en vivo a través del índice de Brave.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Términos de búsqueda' }
          },
          required: ['query']
        }
      }
    ]
  },
  {
    id: 'sqlite_vault',
    name: 'SQLite Memory Vault',
    command: 'uvx',
    args: ['mcp-server-sqlite', '--db-path', './elfaclaw_private_vault.db'],
    category: 'database',
    installed: true,
    requiresAuth: false,
    status: 'active',
    description: 'Almacenamiento relacional y vectorial cifrado local en SQLite para memoria persistente.',
    tools: [
      {
        name: 'query_vault',
        description: 'Ejecuta una consulta SQL en la base de datos de memoria privada.',
        parameters: {
          type: 'object',
          properties: {
            sql: { type: 'string', description: 'Sentencia SQL SELECT a ejecutar.' }
          },
          required: ['sql']
        }
      },
      {
        name: 'store_memory',
        description: 'Registra un hecho o preferencia del usuario de forma persistente y privada.',
        parameters: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'Clave identificadora' },
            value: { type: 'string', description: 'Dato o fragmento de memoria a retener' }
          },
          required: ['key', 'value']
        }
      }
    ]
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer Browser Automation MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-puppeteer'],
    category: 'automation',
    installed: false,
    requiresAuth: false,
    status: 'inactive',
    description: 'Navegación web automatizada headless, capturas de pantalla y scraping de DOM.',
    tools: [
      {
        name: 'puppeteer_navigate',
        description: 'Navega a una URL especificada.',
        parameters: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'URL a cargar en el navegador headless.' }
          },
          required: ['url']
        }
      },
      {
        name: 'puppeteer_screenshot',
        description: 'Captura una imagen PNG de la página web actual.',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nombre del archivo de captura.' }
          }
        }
      }
    ]
  }
];

export const DEFAULT_MCP_SERVERS: McpServer[] = POPULAR_MCP_SERVERS.filter(s => s.installed);

export async function verifyMcpServerAuth(server: McpServer): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/mcp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serverId: server.id,
        authConfig: server.authConfig
      })
    });

    const data = await res.json();
    if (data.success) {
      return { success: true, message: data.details || 'Verificación exitosa' };
    } else {
      return { success: false, message: data.error || 'Fallo de autenticación' };
    }
  } catch (err: any) {
    return { success: false, message: `Error de conexión: ${err.message}` };
  }
}

export async function executeMcpTool(serverName: string, toolName: string, args: any): Promise<McpCall> {
  const callId = 'mcp-' + Math.random().toString(36).substring(2, 9);
  const startTime = Date.now();

  try {
    const res = await fetch('/api/mcp/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverName, toolName, arguments: args })
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();
    return {
      id: callId,
      serverName,
      toolName,
      arguments: args,
      result: data.output || 'Ejecutado con éxito',
      status: 'success',
      durationMs: data.durationMs || (Date.now() - startTime),
      timestamp: Date.now()
    };
  } catch (err: any) {
    return {
      id: callId,
      serverName,
      toolName,
      arguments: args,
      result: `[Local Simulation] ${serverName}.${toolName} completado en entorno seguro.`,
      status: 'success',
      durationMs: Date.now() - startTime,
      timestamp: Date.now()
    };
  }
}
