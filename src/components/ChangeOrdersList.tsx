import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ChangeOrder {
  id: string;
  order_number: string;
  title: string;
  description: string;
  status: string;
  cost_impact: number;
  time_impact_days: number;
  created_at: string;
  approved_at?: string;
}

export function ChangeOrdersList({ projectId }: { projectId: string }) {
  const [orders, setOrders] = useState<ChangeOrder[]>([]);

  useEffect(() => {
    loadOrders();
  }, [projectId]);

  const loadOrders = async () => {
    const { data } = await supabase
      .from('change_orders')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className="font-semibold">{order.title}</span>
            </div>
            <Badge>{order.status}</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">{order.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>Order: {order.order_number}</span>
            <span>{format(new Date(order.created_at), 'MMM d, yyyy')}</span>
            {order.cost_impact > 0 && <span>+${order.cost_impact}</span>}
            {order.time_impact_days > 0 && <span>+{order.time_impact_days} days</span>}
          </div>
        </Card>
      ))}
      {orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No change orders</p>
        </div>
      )}
    </div>
  );
}
