import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function ProjectPreferences() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('project_preferences')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setPreferences(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('project_preferences').delete().eq('id', id);
    loadPreferences();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Project Preferences</h1>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : preferences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No saved preferences yet.</p>
              <Button onClick={() => navigate('/')} className="mt-4">Create New Project</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {preferences.map((pref) => (
              <Card key={pref.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{pref.project_type}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(pref.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {pref.timeline && <p><strong>Timeline:</strong> {pref.timeline}</p>}
                    {pref.budget_range && <p><strong>Budget:</strong> {pref.budget_range}</p>}
                    {pref.notes && <p><strong>Notes:</strong> {pref.notes}</p>}
                    <p className="text-gray-500">Saved: {new Date(pref.created_at).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
