import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, Settings, List, Clock, Plus, AlertCircle, Edit, Trash2, RefreshCw, CalendarRange, MessageSquare } from 'lucide-react';

import CalendarGrid from '@/components/calendar/CalendarGrid';
import EventListView from '@/components/calendar/EventListView';
import AvailabilityManager from '@/components/calendar/AvailabilityManager';
import WorkingHoursSettings from '@/components/calendar/WorkingHoursSettings';
import CalendarConnectionsManager from '@/components/CalendarConnectionsManager';
import CalendarProviderToggle from '@/components/CalendarProviderToggle';
import CalendarProviderConnect from '@/components/CalendarProviderConnect';
import CalendarPicker from '@/components/calendar/CalendarPicker';
import GoogleCalendarDiagnostics from '@/components/GoogleCalendarDiagnostics';
import { CalendarConnectionDiagnostics } from '@/components/CalendarConnectionDiagnostics';
import { GoogleCalendarQuickConnect } from '@/components/GoogleCalendarQuickConnect';
import UnifiedCalendarView from '@/components/calendar/UnifiedCalendarView';
import { AppointmentReminderSystem } from '@/components/AppointmentReminderSystem';

import { CalendarSyncStatusDashboard } from '@/components/CalendarSyncStatusDashboard';
import { CalendarSyncConflicts } from '@/components/CalendarSyncConflicts';
import { CalendarSyncHistory } from '@/components/CalendarSyncHistory';

import { EventCreationForm } from '@/components/calendar/EventCreationForm';
import { EventEditForm } from '@/components/calendar/EventEditForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { multiCalendarService } from '@/lib/multiCalendarService';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  summary: string;
  start_time: string;
  end_time: string;
  provider: string;
  description?: string;
  location?: string;
  attendees?: string[];
  is_recurring?: boolean;
}


export default function CalendarDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [showEditEventDialog, setShowEditEventDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recurringOption, setRecurringOption] = useState<'this' | 'all'>('this');



  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      loadEvents();
    }
  }, [user, navigate]);

  const loadEvents = async () => {
    if (!user) return;
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2);

      const data = await multiCalendarService.getAggregatedAvailability(
        user.id,
        startDate,
        endDate
      );
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleDateClick = (date: Date) => {
    toast.info(`Selected: ${date.toLocaleDateString()}`);
  };

  const handleCreateEvent = async (eventData: any) => {
    if (!user) return;
    try {
      const results = await multiCalendarService.createEventInAllCalendars(user.id, eventData);
      
      const successCount = [results.google, results.outlook, results.apple].filter(r => r).length;
      const errorCount = results.errors.length;
      
      if (successCount > 0) {
        toast.success(`Event created in ${successCount} calendar(s)`);
        if (errorCount > 0) {
          toast.warning(`Failed to sync to ${errorCount} calendar(s)`);
        }
        setShowCreateEventDialog(false);
        loadEvents();
      } else {
        toast.error('Failed to create event in any calendar');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  const handleEditEvent = async (eventData: any) => {
    if (!user || !selectedEvent) return;
    try {
      const results = await multiCalendarService.updateEventInAllCalendars(
        user.id,
        selectedEvent.id,
        selectedEvent.provider,
        eventData,
        selectedEvent.is_recurring ? recurringOption : undefined
      );
      
      const successCount = [results.google, results.outlook, results.apple].filter(r => r).length;
      
      if (successCount > 0) {
        toast.success('Event updated successfully');
        setShowEditEventDialog(false);
        setShowEventDialog(false);
        loadEvents();
      } else {
        toast.error('Failed to update event');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async () => {
    if (!user || !selectedEvent) return;
    try {
      const results = await multiCalendarService.deleteEventFromAllCalendars(
        user.id,
        selectedEvent.id,
        selectedEvent.provider,
        selectedEvent.is_recurring ? recurringOption : undefined
      );
      
      const successCount = [results.google, results.outlook, results.apple].filter(r => r).length;
      
      if (successCount > 0) {
        toast.success('Event deleted successfully');
        setShowDeleteDialog(false);
        setShowEventDialog(false);
        loadEvents();
      } else {
        toast.error('Failed to delete event');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };



  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p>Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Calendar Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your schedule and availability</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setShowCreateEventDialog(true)} variant="default" size="sm" className="sm:size-default flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
          <Button onClick={() => setShowConnectDialog(true)} variant="outline" size="sm" className="sm:size-default flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            Connect Calendar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="unified" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 sm:grid-cols-9 overflow-x-auto h-auto">
          <TabsTrigger value="unified" className="text-xs sm:text-sm px-2 sm:px-4"><CalendarRange className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /><span className="hidden sm:inline">Unified</span></TabsTrigger>
          <TabsTrigger value="sync-status" className="text-xs sm:text-sm px-2 sm:px-4"><RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /><span className="hidden sm:inline">Sync</span></TabsTrigger>
          <TabsTrigger value="sms-reminders" className="text-xs sm:text-sm px-2 sm:px-4"><MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /><span className="hidden sm:inline">SMS</span></TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs sm:text-sm px-2 sm:px-4"><Calendar className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /><span className="hidden sm:inline">Calendar</span></TabsTrigger>
          <TabsTrigger value="events" className="text-xs sm:text-sm px-2 sm:px-4"><List className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /><span className="hidden sm:inline">Events</span></TabsTrigger>
          <TabsTrigger value="availability" className="hidden sm:flex text-xs sm:text-sm px-2 sm:px-4"><Clock className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /><span className="hidden sm:inline">Availability</span></TabsTrigger>
          <TabsTrigger value="settings" className="hidden sm:flex text-xs sm:text-sm px-2 sm:px-4"><Settings className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /><span className="hidden sm:inline">Settings</span></TabsTrigger>
          <TabsTrigger value="connections" className="hidden sm:flex text-xs sm:text-sm px-2 sm:px-4"><Settings className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /><span className="hidden sm:inline">Connections</span></TabsTrigger>
          <TabsTrigger value="diagnostics" className="hidden sm:flex text-xs sm:text-sm px-2 sm:px-4"><AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /><span className="hidden sm:inline">Diagnostics</span></TabsTrigger>
        </TabsList>

        <TabsContent value="unified">
          <UnifiedCalendarView userId={user.id} />
        </TabsContent>


        <TabsContent value="sync-status">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <CalendarSyncStatusDashboard />
              <CalendarSyncConflicts />
            </div>
            <CalendarSyncHistory />
          </div>
        </TabsContent>

        <TabsContent value="sms-reminders">
          <AppointmentReminderSystem />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarGrid events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />
        </TabsContent>

        <TabsContent value="events">
          <EventListView events={events} onEventClick={handleEventClick} />
        </TabsContent>

        <TabsContent value="availability">
          <AvailabilityManager />
        </TabsContent>

        <TabsContent value="settings">
          <WorkingHoursSettings />
        </TabsContent>

        <TabsContent value="connections">
          <div className="space-y-6">
            <CalendarProviderToggle onProviderChange={() => loadEvents()} />
            <CalendarConnectionsManager />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <CalendarPicker provider="google" userId={user.id} />
              <CalendarPicker provider="outlook" userId={user.id} />
              <CalendarPicker provider="apple" userId={user.id} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="diagnostics">
          <div className="space-y-6">
            <GoogleCalendarQuickConnect />
            <CalendarConnectionDiagnostics />
            <GoogleCalendarDiagnostics />
          </div>
        </TabsContent>

      </Tabs>


      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.summary}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <>
              <div className="space-y-3">
                <p><strong>Start:</strong> {new Date(selectedEvent.start_time).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(selectedEvent.end_time).toLocaleString()}</p>
                <p><strong>Provider:</strong> {selectedEvent.provider}</p>
                {selectedEvent.description && <p><strong>Description:</strong> {selectedEvent.description}</p>}
                {selectedEvent.location && <p><strong>Location:</strong> {selectedEvent.location}</p>}
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => { setShowEventDialog(false); setShowEditEventDialog(true); }} variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={() => { setShowEventDialog(false); setShowDeleteDialog(true); }} variant="destructive" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>


      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Calendar</DialogTitle>
          </DialogHeader>
          <CalendarProviderConnect onSuccess={() => {
            setShowConnectDialog(false);
            loadEvents();
          }} />
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Event will be synced to all connected calendars (Google, Outlook, Apple)
            </DialogDescription>
          </DialogHeader>
          <EventCreationForm 
            onSubmit={handleCreateEvent}
            onCancel={() => setShowCreateEventDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditEventDialog} onOpenChange={setShowEditEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              {selectedEvent?.is_recurring && 'This is a recurring event. Choose whether to update this occurrence or all occurrences.'}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent?.is_recurring && (
            <RadioGroup value={recurringOption} onValueChange={(value: 'this' | 'all') => setRecurringOption(value)} className="mb-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="this" id="this" />
                <Label htmlFor="this">This event only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All events in series</Label>
              </div>
            </RadioGroup>
          )}
          {selectedEvent && (
            <EventEditForm 
              event={selectedEvent}
              onSubmit={handleEditEvent}
              onCancel={() => setShowEditEventDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedEvent?.summary}"? This action cannot be undone.
              {selectedEvent?.is_recurring && ' Choose whether to delete this occurrence or all occurrences.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedEvent?.is_recurring && (
            <RadioGroup value={recurringOption} onValueChange={(value: 'this' | 'all') => setRecurringOption(value)} className="my-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="this" id="delete-this" />
                <Label htmlFor="delete-this">This event only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="delete-all" />
                <Label htmlFor="delete-all">All events in series</Label>
              </div>
            </RadioGroup>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
