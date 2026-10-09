export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
  mcpCalls?: McpCall[];
  artifact?: Artifact;
  privacyAudit?: PrivacyAudit;
  thinking?: string;
}

export interface Artifact {
  id: string;
  title: string;
  type: 'application/react' | 'application/typescript' | 'text/html' | 'text/markdown' | 'application/json' | 'image/svg+xml';
  language: string;
  content: string;
  version: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  projectId?: string;
  messages: Message[];
  activeArtifact?: Artifact;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  customInstructions: string;
  files: ProjectFile[];
  createdAt: number;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  modifiedAt: number;
}

export interface McpToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string; default?: any }>;
    required?: string[];
  };
}

export interface McpServer {
  id: string;
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  status: 'active' | 'inactive' | 'error';
  description: string;
  category?: 'database' | 'version_control' | 'filesystem' | 'search' | 'tools' | 'automation';
  installed?: boolean;
  requiresAuth?: boolean;
  authConfig?: {
    isConfigured: boolean;
    lastTested?: number;
    testStatus?: 'success' | 'failed' | 'untested';
    errorMessage?: string;
    fields: {
      key: string;
      label: string;
      type: 'text' | 'password' | 'url';
      placeholder: string;
      value: string;
      required?: boolean;
    }[];
  };
  tools: McpToolDefinition[];
}

export interface McpCall {
  id: string;
  serverName: string;
  toolName: string;
  arguments: any;
  result?: string;
  status: 'pending' | 'running' | 'success' | 'error';
  durationMs?: number;
  timestamp: number;
}

export interface PrivacyAudit {
  piiScrubbed: boolean;
  cloudEgressEncrypted: boolean;
  localVaultStored: boolean;
  zeroDataSentToThirdParty: boolean;
  bytesSentOutside: number;
}

export interface ModelOption {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  contextWindow: string;
  isLocalOnly: boolean;
  recommendedFor: string;
}

export interface LocalTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  mcpToolToUse: string;
  steps: { id: string; text: string; done: boolean }[];
  createdAt: number;
}
