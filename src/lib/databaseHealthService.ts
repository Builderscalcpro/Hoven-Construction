import { supabase } from './supabase';

export interface TableHealth {
  name: string;
  exists: boolean;
  rlsEnabled: boolean;
  rowCount: number | null;
  indexes: string[];
  policies: string[];
  issues: string[];
}

export interface DatabaseHealth {
  connected: boolean;
  tables: TableHealth[];
  overallStatus: 'healthy' | 'warning' | 'critical';
  lastChecked: Date;
}

const EXPECTED_TABLES = [
  'user_profiles',
  'customers',
  'projects',
  'invoices',
  'consultations',
  'contractors',
  'email_templates',
  'google_reviews',
  'calendar_events',
  'payment_transactions',
];

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const health: DatabaseHealth = {
    connected: false,
    tables: [],
    overallStatus: 'healthy',
    lastChecked: new Date(),
  };

  try {
    // Test connection
    const { error: connError } = await supabase.from('user_profiles').select('count').limit(1);
    health.connected = !connError;

    // Check each table
    for (const tableName of EXPECTED_TABLES) {
      const tableHealth = await checkTableHealth(tableName);
      health.tables.push(tableHealth);
    }

    // Determine overall status
    const criticalIssues = health.tables.filter(t => !t.exists || !t.rlsEnabled);
    const warnings = health.tables.filter(t => t.issues.length > 0);

    if (criticalIssues.length > 0) {
      health.overallStatus = 'critical';
    } else if (warnings.length > 0) {
      health.overallStatus = 'warning';
    }
  } catch (error) {
    console.error('Database health check failed:', error);
    health.connected = false;
    health.overallStatus = 'critical';
  }

  return health;
}

async function checkTableHealth(tableName: string): Promise<TableHealth> {
  const health: TableHealth = {
    name: tableName,
    exists: false,
    rlsEnabled: false,
    rowCount: null,
    indexes: [],
    policies: [],
    issues: [],
  };

  try {
    // Check if table exists and get row count
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      health.exists = true;
      health.rowCount = count;
    } else if (error.message.includes('does not exist')) {
      health.issues.push('Table does not exist');
      return health;
    }

    // Check RLS status
    const { data: rlsData } = await supabase.rpc('check_rls_enabled', { table_name: tableName }).single();
    health.rlsEnabled = rlsData?.rls_enabled || false;
    if (!health.rlsEnabled) {
      health.issues.push('RLS not enabled');
    }

    // Get policies
    const { data: policiesData } = await supabase.rpc('get_table_policies', { table_name: tableName });
    health.policies = policiesData?.map((p: any) => p.policyname) || [];
    if (health.policies.length === 0) {
      health.issues.push('No RLS policies found');
    }

    // Get indexes
    const { data: indexesData } = await supabase.rpc('get_table_indexes', { table_name: tableName });
    health.indexes = indexesData?.map((i: any) => i.indexname) || [];

  } catch (error) {
    console.error(`Error checking ${tableName}:`, error);
    health.issues.push('Health check failed');
  }

  return health;
}

export async function refreshSchemaCache(): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.rpc('refresh_schema_cache');
    if (error) throw error;
    return { success: true, message: 'Schema cache refreshed successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to refresh schema cache' };
  }
}
