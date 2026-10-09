export interface SupabaseProject {
  id: string;
  name: string;
  environment: 'production' | 'staging' | 'development';
  url: string;
  key: string;
  isActive: boolean;
  status: 'connected' | 'error' | 'untested';
  tables: string[];
  lastTested?: number;
  errorMessage?: string;
}

export const INITIAL_SUPABASE_PROJECTS: SupabaseProject[] = [
  {
    id: 'sp-prod',
    name: 'Producción Cloud (Principal)',
    environment: 'production',
    url: 'https://vvyozxskhbrcgnxevwqu.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.elfaclaw_service_role_key_prod',
    isActive: true,
    status: 'connected',
    tables: ['users', 'projects', 'artifacts', 'mcp_logs', 'team_members'],
    lastTested: Date.now() - 3600000
  },
  {
    id: 'sp-staging',
    name: 'Staging & Pruebas QA',
    environment: 'staging',
    url: 'https://app-staging-qa.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.elfaclaw_anon_key_staging',
    isActive: false,
    status: 'untested',
    tables: ['users_test', 'mock_datasets'],
    lastTested: Date.now() - 86400000
  }
];
