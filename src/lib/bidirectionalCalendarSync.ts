import { supabase } from './supabase';
import { googleCalendarService } from './googleCalendarService';

export interface SyncStatus {
  id: string;
  user_id: string;
  last_sync: string;
  sync_direction: 'local_to_google' | 'google_to_local' | 'bidirectional';
  status: 'success' | 'error' | 'in_progress';
  events_synced: number;
  conflicts_resolved: number;
  error_message?: string;
}

export interface SyncConflict {
  event_id: string;
  local_version: any;
  google_version: any;
  conflict_type: 'time' | 'title' | 'description' | 'deleted';
  resolution?: 'use_local' | 'use_google' | 'merge';
}

class BidirectionalCalendarSync {
  private syncInProgress = false;

  async performFullSync(userId: string): Promise<SyncStatus> {
    if (this.syncInProgress) {
      throw new Error('Sync already in progress');
    }

    this.syncInProgress = true;
    const startTime = new Date().toISOString();
    let eventsSynced = 0;
    let conflictsResolved = 0;
    const conflicts: SyncConflict[] = [];

    try {
      // Create sync status record
      const { data: syncRecord } = await supabase
        .from('calendar_sync_status')
        .insert({
          user_id: userId,
          last_sync: startTime,
          sync_direction: 'bidirectional',
          status: 'in_progress',
          events_synced: 0,
          conflicts_resolved: 0
        })
        .select()
        .single();

      // Step 1: Fetch local events
      const { data: localEvents } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId);

      // Step 2: Fetch Google Calendar events
      const googleEvents = await googleCalendarService.listEvents(userId);

      // Step 3: Compare and sync
      const localMap = new Map(localEvents?.map(e => [e.google_event_id, e]) || []);
      const googleMap = new Map(googleEvents.map(e => [e.id, e]));

      // Sync Google -> Local (new or updated events)
      for (const [googleId, googleEvent] of googleMap) {
        const localEvent = localMap.get(googleId);
        
        if (!localEvent) {
          // New event from Google
          await this.createLocalEvent(userId, googleEvent);
          eventsSynced++;
        } else {
          // Check for conflicts
          const conflict = this.detectConflict(localEvent, googleEvent);
          if (conflict) {
            conflicts.push(conflict);
            await this.resolveConflict(conflict, userId);
            conflictsResolved++;
          }
        }
      }

      // Sync Local -> Google (new events not in Google)
      for (const [localId, localEvent] of localMap) {
        if (!localEvent.google_event_id || !googleMap.has(localEvent.google_event_id)) {
          const newGoogleEvent = await googleCalendarService.createEvent(userId, {
            summary: localEvent.title,
            start: { dateTime: localEvent.start_time },
            end: { dateTime: localEvent.end_time },
            description: localEvent.notes
          });
          
          await supabase
            .from('appointments')
            .update({ google_event_id: newGoogleEvent.id })
            .eq('id', localEvent.id);
          
          eventsSynced++;
        }
      }

      // Update sync status
      await supabase
        .from('calendar_sync_status')
        .update({
          status: 'success',
          events_synced: eventsSynced,
          conflicts_resolved: conflictsResolved
        })
        .eq('id', syncRecord.id);

      return {
        id: syncRecord.id,
        user_id: userId,
        last_sync: startTime,
        sync_direction: 'bidirectional',
        status: 'success',
        events_synced: eventsSynced,
        conflicts_resolved: conflictsResolved
      };
    } catch (error: any) {
      console.error('Sync error:', error);
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  private detectConflict(localEvent: any, googleEvent: any): SyncConflict | null {
    const localUpdated = new Date(localEvent.updated_at);
    const googleUpdated = new Date(googleEvent.updated);

    if (Math.abs(localUpdated.getTime() - googleUpdated.getTime()) < 1000) {
      return null; // Same update time, no conflict
    }

    if (localEvent.title !== googleEvent.summary) {
      return {
        event_id: localEvent.id,
        local_version: localEvent,
        google_version: googleEvent,
        conflict_type: 'title'
      };
    }

    return null;
  }

  private async resolveConflict(conflict: SyncConflict, userId: string) {
    // Default: Use most recent version (Google)
    const resolution = 'use_google';
    
    if (resolution === 'use_google') {
      await this.createLocalEvent(userId, conflict.google_version);
    }
  }

  private async createLocalEvent(userId: string, googleEvent: any) {
    await supabase.from('appointments').upsert({
      user_id: userId,
      title: googleEvent.summary,
      start_time: googleEvent.start.dateTime,
      end_time: googleEvent.end.dateTime,
      notes: googleEvent.description,
      google_event_id: googleEvent.id
    });
  }
}

export const bidirectionalCalendarSync = new BidirectionalCalendarSync();
