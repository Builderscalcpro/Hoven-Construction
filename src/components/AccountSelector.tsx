import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Account {
  id: string;
  email: string;
  account_label?: string;
  is_primary: boolean;
  provider: string;
}

interface AccountSelectorProps {
  provider?: 'google' | 'outlook' | 'apple' | 'all';
  onSelect: (accountId: string, provider: string) => void;
  selectedAccountId?: string;
}

export function AccountSelector({ provider = 'all', onSelect, selectedAccountId }: AccountSelectorProps) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, [user, provider]);

  const loadAccounts = async () => {
    if (!user) return;
    try {
      const allAccounts: Account[] = [];

      if (provider === 'all' || provider === 'google') {
        const { data: google } = await supabase
          .from('google_calendar_tokens')
          .select('id, email, account_label, is_primary')
          .eq('user_id', user.id)
          .eq('sync_enabled', true);
        if (google) allAccounts.push(...google.map(a => ({ ...a, provider: 'google' })));
      }

      if (provider === 'all' || provider === 'outlook') {
        const { data: outlook } = await supabase
          .from('outlook_calendar_tokens')
          .select('id, email, account_label, is_primary')
          .eq('user_id', user.id)
          .eq('sync_enabled', true);
        if (outlook) allAccounts.push(...outlook.map(a => ({ ...a, provider: 'outlook' })));
      }

      if (provider === 'all' || provider === 'apple') {
        const { data: apple } = await supabase
          .from('apple_calendar_tokens')
          .select('id, apple_id, account_label, is_primary')
          .eq('user_id', user.id)
          .eq('sync_enabled', true);
        if (apple) allAccounts.push(...apple.map(a => ({ ...a, email: a.apple_id || '', provider: 'apple' })));
      }

      setAccounts(allAccounts);
      
      // Auto-select primary account if none selected
      if (!selectedAccountId && allAccounts.length > 0) {
        const primary = allAccounts.find(a => a.is_primary) || allAccounts[0];
        onSelect(primary.id, primary.provider);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading accounts...</div>;
  if (accounts.length === 0) return <div className="text-sm text-muted-foreground">No accounts available</div>;

  return (
    <div className="space-y-2">
      <Label>Select Calendar Account</Label>
      <Select value={selectedAccountId} onValueChange={(value) => {
        const account = accounts.find(a => a.id === value);
        if (account) onSelect(account.id, account.provider);
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Choose account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              <div className="flex items-center gap-2">
                <span>{account.account_label || account.email}</span>
                {account.is_primary && <Badge variant="outline" className="text-xs">Primary</Badge>}
                <Badge variant="secondary" className="text-xs">{account.provider}</Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
