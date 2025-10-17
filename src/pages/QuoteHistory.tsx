import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign } from 'lucide-react';

export default function QuoteHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, [user]);

  const loadQuotes = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('quote_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setQuotes(data);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Quote History</h1>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : quotes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No quotes yet. Request a quote to get started!</p>
              <Button onClick={() => navigate('/')} className="mt-4">Get a Quote</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card key={quote.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{quote.project_type}</CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(quote.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {quote.services && (
                      <p className="text-sm"><strong>Services:</strong> {quote.services.join(', ')}</p>
                    )}
                    {quote.estimated_cost && (
                      <div className="flex items-center gap-2 text-lg font-semibold text-amber-600">
                        <DollarSign className="h-5 w-5" />
                        {parseFloat(quote.estimated_cost).toLocaleString()}
                      </div>
                    )}
                    {quote.timeline && <p className="text-sm"><strong>Timeline:</strong> {quote.timeline}</p>}
                    {quote.notes && <p className="text-sm text-gray-600">{quote.notes}</p>}
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
