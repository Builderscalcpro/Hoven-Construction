import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AppointmentStatusManager() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });
    setAppointments(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated successfully');
      loadAppointments();
    }
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      scheduled: { icon: Clock, variant: 'secondary', label: 'Scheduled' },
      completed: { icon: CheckCircle, variant: 'default', label: 'Completed' },
      cancelled: { icon: XCircle, variant: 'destructive', label: 'Cancelled' }
    };
    const { icon: Icon, variant, label } = config[status] || config.scheduled;
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Status Manager</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="space-y-3">
            {appointments.map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{apt.client_name}</h4>
                  <p className="text-sm text-gray-600">
                    {apt.appointment_date} at {apt.appointment_time} - {apt.service_type}
                  </p>
                  <p className="text-xs text-gray-500">{apt.client_email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(apt.status)}
                  <Select value={apt.status} onValueChange={(v) => updateStatus(apt.id, v)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}