import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Comment {
  id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
  user_id: string;
}

export function ProjectComments({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [projectId]);

  const loadComments = async () => {
    const { data } = await supabase
      .from('project_comments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (data) setComments(data);
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('project_comments').insert({
        project_id: projectId,
        user_id: user?.id,
        author_name: user?.email || 'Client',
        comment_text: newComment
      });
      if (error) throw error;
      toast({ title: 'Comment posted' });
      setNewComment('');
      loadComments();
    } catch (error) {
      toast({ title: 'Error posting comment', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Textarea
          placeholder="Add a comment or question..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <Button onClick={handleSubmit} disabled={loading} className="mt-2">
          <Send className="w-4 h-4 mr-2" />
          Post Comment
        </Button>
      </Card>

      <div className="space-y-3">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">{comment.author_name}</span>
              <span className="text-sm text-gray-500">
                {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
            <p className="text-gray-700">{comment.comment_text}</p>
          </Card>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
