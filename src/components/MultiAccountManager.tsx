import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Star, Trash2, Edit2, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Account {
  id: string;
  email: string;
  account_label?: string;
  is_primary: boolean;
  sync_enabled: boolean;
  expires_at?: string;
  provider: string;
}

interface MultiAccountManagerProps {
  accounts: Account[];
  provider: string;
  tableName: string;
  onUpdate: () => void;
}

export function MultiAccountManager({ accounts, provider, tableName, onUpdate }: MultiAccountManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [labelValue, setLabelValue] = useState('');

  const handleSetPrimary = async (accountId: string) => {
    try {
      await supabase.from(tableName).update({ is_primary: true }).eq('id', accountId);
      toast.success('Primary account updated');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update primary account');
    }
  };

  const handleToggleSync = async (accountId: string, currentValue: boolean) => {
    try {
      await supabase.from(tableName).update({ sync_enabled: !currentValue }).eq('id', accountId);
      toast.success(`Sync ${!currentValue ? 'enabled' : 'disabled'}`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to toggle sync');
    }
  };

  const handleSaveLabel = async (accountId: string) => {
    try {
      await supabase.from(tableName).update({ account_label: labelValue }).eq('id', accountId);
      toast.success('Label updated');
      setEditingId(null);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update label');
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm('Remove this account?')) return;
    try {
      await supabase.from(tableName).delete().eq('id', accountId);
      toast.success('Account removed');
      onUpdate();
    } catch (error) {
      toast.error('Failed to remove account');
    }
  };

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <Card key={account.id} className="border-l-4" style={{ borderLeftColor: account.is_primary ? '#10b981' : '#e5e7eb' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {editingId === account.id ? (
                    <div className="flex items-center gap-2">
                      <Input value={labelValue} onChange={(e) => setLabelValue(e.target.value)} className="h-8 w-48" placeholder="Account label" />
                      <Button size="sm" variant="ghost" onClick={() => handleSaveLabel(account.id)}><Check className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{account.account_label || account.email}</span>
                      <Button size="sm" variant="ghost" onClick={() => { setEditingId(account.id); setLabelValue(account.account_label || ''); }}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                  {account.is_primary && <Badge className="bg-green-500">Primary</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{account.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sync</span>
                  <Switch checked={account.sync_enabled} onCheckedChange={() => handleToggleSync(account.id, account.sync_enabled)} />
                </div>
                <Button size="sm" variant="outline" onClick={() => handleSetPrimary(account.id)} disabled={account.is_primary}>
                  <Star className={`w-4 h-4 ${account.is_primary ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(account.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
