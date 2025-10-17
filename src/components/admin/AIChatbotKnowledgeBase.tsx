import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Save, BookOpen, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface KnowledgeEntry {
  id?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  source_type: string;
  is_active: boolean;
}

interface Props {
  configId: string | undefined;
  knowledge: KnowledgeEntry[];
  setKnowledge: (knowledge: KnowledgeEntry[]) => void;
}

export default function AIChatbotKnowledgeBase({ configId, knowledge, setKnowledge }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [bulkContent, setBulkContent] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);

  const addKnowledgeEntry = () => {
    setKnowledge([...(knowledge || []), {
      title: '',
      content: '',
      category: '',
      tags: [],
      source_type: 'general',
      is_active: true
    }]);
  };

  const updateKnowledgeEntry = (index: number, field: keyof KnowledgeEntry, value: any) => {
    const updated = [...(knowledge || [])];
    updated[index] = { ...updated[index], [field]: value };
    setKnowledge(updated);
  };

  const removeKnowledgeEntry = (index: number) => {
    setKnowledge((knowledge || []).filter((_, i) => i !== index));
  };

  const addTag = (index: number) => {
    if (newTag.trim()) {
      const updated = [...(knowledge || [])];
      updated[index].tags = [...(updated[index].tags || []), newTag.trim()];
      setKnowledge(updated);
      setNewTag('');
    }
  };

  const removeTag = (entryIndex: number, tagIndex: number) => {
    const updated = [...(knowledge || [])];
    updated[entryIndex].tags = updated[entryIndex].tags.filter((_, i) => i !== tagIndex);
    setKnowledge(updated);
  };

  const saveKnowledge = async () => {
    if (!configId) {
      toast({
        title: 'Error',
        description: 'Please save general settings first',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      // Delete existing knowledge entries
      await supabase.from('ai_chatbot_knowledge').delete().eq('config_id', configId);
      
      // Insert new knowledge entries
      if (knowledge && knowledge.length > 0) {
        const { error } = await supabase.from('ai_chatbot_knowledge').insert(
          knowledge.map(entry => ({ ...entry, config_id: configId }))
        );
        if (error) throw error;
      }

      // Train the AI with the new knowledge
      await trainAI();

      toast({
        title: 'Success',
        description: 'Knowledge base saved and AI trained successfully'
      });
    } catch (error) {
      console.error('Error saving knowledge base:', error);
      toast({
        title: 'Error',
        description: 'Failed to save knowledge base',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const trainAI = async () => {
    try {
      const { error } = await supabase.functions.invoke('train-ai-chatbot', {
        body: { configId, knowledge }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error training AI:', error);
    }
  };

  const importBulkContent = () => {
    if (!bulkContent.trim()) return;

    const lines = bulkContent.split('\n').filter(line => line.trim());
    const newEntries: KnowledgeEntry[] = [];

    let currentEntry: Partial<KnowledgeEntry> | null = null;

    lines.forEach(line => {
      if (line.startsWith('##')) {
        if (currentEntry && currentEntry.title && currentEntry.content) {
          newEntries.push({
            title: currentEntry.title,
            content: currentEntry.content,
            category: currentEntry.category || '',
            tags: [],
            source_type: 'general',
            is_active: true
          });
        }
        currentEntry = { title: line.replace('##', '').trim(), content: '' };
      } else if (currentEntry) {
        currentEntry.content = (currentEntry.content || '') + '\n' + line;
      }
    });

    if (currentEntry && currentEntry.title && currentEntry.content) {
      newEntries.push({
        title: currentEntry.title,
        content: currentEntry.content,
        category: '',
        tags: [],
        source_type: 'general',
        is_active: true
      });
    }

    setKnowledge([...(knowledge || []), ...newEntries]);
    setBulkContent('');
    setShowBulkImport(false);
    toast({
      title: 'Success',
      description: `Imported ${newEntries.length} knowledge entries`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Knowledge Base
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkImport(!showBulkImport)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </CardTitle>
          <CardDescription>
            Train your AI on specific company information and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showBulkImport && (
            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Bulk Import Content</Label>
                  <Textarea
                    value={bulkContent}
                    onChange={(e) => setBulkContent(e.target.value)}
                    placeholder="Paste your content here. Use ## for titles, followed by content."
                    rows={8}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Format: ## Title followed by content. Each ## starts a new entry.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={importBulkContent} size="sm">
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowBulkImport(false);
                      setBulkContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {(knowledge || []).map((entry, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={entry.title}
                      onChange={(e) => updateKnowledgeEntry(index, 'title', e.target.value)}
                      placeholder="Knowledge entry title"
                    />
                  </div>
                  <div>
                    <Label>Source Type</Label>
                    <Select
                      value={entry.source_type}
                      onValueChange={(value) => updateKnowledgeEntry(index, 'source_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="policy">Policy</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={entry.content}
                    onChange={(e) => updateKnowledgeEntry(index, 'content', e.target.value)}
                    placeholder="Detailed information about this topic"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Input
                    value={entry.category}
                    onChange={(e) => updateKnowledgeEntry(index, 'category', e.target.value)}
                    placeholder="e.g., Services, Products, Policies"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {entry.tags?.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                        <button
                          onClick={() => removeTag(index, tagIndex)}
                          className="ml-2 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(index);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addTag(index)}
                    >
                      Add Tag
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={entry.is_active}
                      onCheckedChange={(checked) => updateKnowledgeEntry(index, 'is_active', checked)}
                    />
                    <Label>Active</Label>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeKnowledgeEntry(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex gap-4">
            <Button onClick={addKnowledgeEntry} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge Entry
            </Button>
            <Button onClick={saveKnowledge} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save & Train AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}