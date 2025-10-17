import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KBEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  priority: number;
  is_active: boolean;
}

export default function KnowledgeBaseEditor() {
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    question: '',
    answer: '',
    keywords: '',
    priority: 0,
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const { data, error } = await supabase
      .from('chatbot_knowledge_base')
      .select('*')
      .order('priority', { ascending: false });
    
    if (data) setEntries(data);
  };

  const handleSave = async () => {
    const entry = {
      ...formData,
      keywords: formData.keywords.split(',').map(k => k.trim())
    };

    if (editing) {
      await supabase.from('chatbot_knowledge_base').update(entry).eq('id', editing);
      toast({ title: 'Updated successfully' });
    } else {
      await supabase.from('chatbot_knowledge_base').insert(entry);
      toast({ title: 'Added successfully' });
    }
    
    resetForm();
    loadEntries();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('chatbot_knowledge_base').delete().eq('id', id);
    toast({ title: 'Deleted successfully' });
    loadEntries();
  };

  const resetForm = () => {
    setFormData({ category: '', question: '', answer: '', keywords: '', priority: 0, is_active: true });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit' : 'Add'} Knowledge Base Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          <Input placeholder="Question" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} />
          <Textarea placeholder="Answer" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} rows={4} />
          <Input placeholder="Keywords (comma-separated)" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} />
          <div className="flex gap-4">
            <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save</Button>
            {editing && <Button variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-2" />Cancel</Button>}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {entries.map(entry => (
          <Card key={entry.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Badge>{entry.category}</Badge>
                  <h3 className="font-semibold mt-2">{entry.question}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{entry.answer}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setFormData({...entry, keywords: entry.keywords.join(', ')}); setEditing(entry.id); }}><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(entry.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
