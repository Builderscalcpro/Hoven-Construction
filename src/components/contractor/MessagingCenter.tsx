import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Paperclip, AlertCircle, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  message: string;
  message_type: string;
  is_read: boolean;
  is_urgent: boolean;
  created_at: string;
  sender_id: string;
  job_assignment?: any;
  sender?: any;
}

export default function MessagingCenter({ contractorId }: { contractorId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (contractorId) {
      fetchJobs();
      fetchMessages();
      subscribeToMessages();
    }
  }, [contractorId, selectedJob]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('job_assignments')
      .select('*')
      .eq('contractor_id', contractorId)
      .in('status', ['accepted', 'in_progress']);

    setJobs(data || []);
    if (data && data.length > 0 && !selectedJob) {
      setSelectedJob(data[0].id);
    }
  };

  const fetchMessages = async () => {
    if (!selectedJob) return;

    const { data } = await supabase
      .from('contractor_messages')
      .select('*, sender:auth.users(email)')
      .eq('job_assignment_id', selectedJob)
      .order('created_at', { ascending: true });

    setMessages(data || []);
    setLoading(false);

    // Mark messages as read
    await supabase
      .from('contractor_messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('job_assignment_id', selectedJob)
      .eq('contractor_id', contractorId)
      .eq('is_read', false);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages-${contractorId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contractor_messages',
          filter: `contractor_id=eq.${contractorId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedJob) return;

    try {
      await supabase.from('contractor_messages').insert({
        job_assignment_id: selectedJob,
        contractor_id: contractorId,
        sender_id: user?.id,
        message: newMessage,
        message_type: 'text',
      });

      setNewMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="space-y-4">
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Messages</CardTitle>
            {jobs.length > 0 && (
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {selectedJob ? (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isOwnMessage = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {isOwnMessage ? 'You' : 'PM'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                isOwnMessage
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              {msg.is_urgent && (
                                <div className="flex items-center gap-1 mb-1">
                                  <AlertCircle className="h-3 w-3" />
                                  <span className="text-xs font-semibold">Urgent</span>
                                </div>
                              )}
                              <p className="text-sm">{msg.message}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {format(new Date(msg.created_at), 'h:mm a')}
                              </span>
                              {isOwnMessage && (
                                <span className="text-xs">
                                  {msg.is_read ? (
                                    <CheckCheck className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <Check className="h-3 w-3 text-gray-400" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>No active jobs to message about</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}