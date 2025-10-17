import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export default function AvailabilityManager() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (user) loadSlots();
  }, [user]);

  const loadSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('user_id', user!.id)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const addSlot = async (dayOfWeek: number) => {
    try {
      const { data, error } = await supabase
        .from('availability_slots')
        .insert({
          user_id: user!.id,
          day_of_week: dayOfWeek,
          start_time: '09:00',
          end_time: '17:00',
          is_available: true
        })
        .select()
        .single();

      if (error) throw error;
      setSlots([...slots, data]);
      toast.success('Availability slot added');
    } catch (error) {
      toast.error('Failed to add slot');
    }
  };

  const updateSlot = async (id: string, updates: Partial<AvailabilitySlot>) => {
    try {
      const { error } = await supabase
        .from('availability_slots')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setSlots(slots.map(s => s.id === id ? { ...s, ...updates } : s));
    } catch (error) {
      toast.error('Failed to update slot');
    }
  };

  const deleteSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('availability_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSlots(slots.filter(s => s.id !== id));
      toast.success('Slot removed');
    } catch (error) {
      toast.error('Failed to remove slot');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {daysOfWeek.map((day, index) => {
        const daySlots = slots.filter(s => s.day_of_week === index);
        
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{day}</CardTitle>
                <Button size="sm" onClick={() => addSlot(index)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slot
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {daySlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No availability set</p>
              ) : (
                daySlots.map(slot => (
                  <div key={slot.id} className="flex items-center gap-3">
                    <Input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) => updateSlot(slot.id!, { start_time: e.target.value })}
                      className="w-32"
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) => updateSlot(slot.id!, { end_time: e.target.value })}
                      className="w-32"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSlot(slot.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
