
import { supabase } from "@/integrations/supabase/client";
import { TimeEntry, TimeTrackingSession } from "@/types/database";
import { toast } from "sonner";

export const getTimeEntries = async (
  filters: {
    project_id?: string;
    start_date?: string;
    end_date?: string;
    billable?: boolean;
  } = {}
): Promise<TimeEntry[]> => {
  try {
    let query = supabase
      .from('time_entries')
      .select(`
        *,
        projects(id, name, client_id, clients(name)),
        tasks(id, title)
      `)
      .order('start_time', { ascending: false });

    if (filters.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    if (filters.start_date) {
      query = query.gte('start_time', filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte('start_time', filters.end_date);
    }

    if (filters.billable !== undefined) {
      query = query.eq('billable', filters.billable);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as TimeEntry[];
  } catch (error) {
    console.error('Error fetching time entries:', error);
    toast.error('Failed to load time entries');
    return [];
  }
};

export const createTimeEntry = async (
  entry: Omit<TimeEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<TimeEntry | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        ...entry,
        user_id: user.user.id
      })
      .select(`
        *,
        projects(id, name, client_id, clients(name)),
        tasks(id, title)
      `)
      .single();

    if (error) throw error;

    toast.success('Time entry created successfully');
    return data as TimeEntry;
  } catch (error) {
    console.error('Error creating time entry:', error);
    toast.error('Failed to create time entry');
    return null;
  }
};

export const updateTimeEntry = async (
  id: string,
  updates: Partial<TimeEntry>
): Promise<TimeEntry | null> => {
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        projects(id, name, client_id, clients(name)),
        tasks(id, title)
      `)
      .single();

    if (error) throw error;

    toast.success('Time entry updated successfully');
    return data as TimeEntry;
  } catch (error) {
    console.error('Error updating time entry:', error);
    toast.error('Failed to update time entry');
    return null;
  }
};

export const deleteTimeEntry = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast.success('Time entry deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting time entry:', error);
    toast.error('Failed to delete time entry');
    return false;
  }
};

export const getActiveTimeTrackingSession = async (): Promise<TimeTrackingSession | null> => {
  try {
    const { data, error } = await supabase
      .from('time_tracking_sessions')
      .select(`
        *,
        projects(id, name, client_id, clients(name)),
        tasks(id, title)
      `)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;

    return data as TimeTrackingSession | null;
  } catch (error) {
    console.error('Error fetching active session:', error);
    return null;
  }
};

export const startTimeTracking = async (
  session: Omit<TimeTrackingSession, 'id' | 'user_id' | 'start_time' | 'is_active' | 'created_at'>
): Promise<TimeTrackingSession | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    // Stop any existing active sessions
    await supabase
      .from('time_tracking_sessions')
      .update({ is_active: false })
      .eq('user_id', user.user.id)
      .eq('is_active', true);

    const { data, error } = await supabase
      .from('time_tracking_sessions')
      .insert({
        ...session,
        user_id: user.user.id
      })
      .select(`
        *,
        projects(id, name, client_id, clients(name)),
        tasks(id, title)
      `)
      .single();

    if (error) throw error;

    toast.success('Time tracking started');
    return data as TimeTrackingSession;
  } catch (error) {
    console.error('Error starting time tracking:', error);
    toast.error('Failed to start time tracking');
    return null;
  }
};

export const stopTimeTracking = async (
  sessionId: string,
  options: {
    description?: string;
    hourly_rate?: number;
    billable?: boolean;
  } = {}
): Promise<TimeEntry | null> => {
  try {
    // Get the session
    const { data: session, error: sessionError } = await supabase
      .from('time_tracking_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;

    const endTime = new Date().toISOString();

    // Create time entry
    const timeEntry = await createTimeEntry({
      project_id: session.project_id,
      task_id: session.task_id,
      description: options.description || session.description,
      start_time: session.start_time,
      end_time: endTime,
      duration_minutes: null, // Will be calculated by trigger
      hourly_rate: options.hourly_rate || null,
      billable: options.billable ?? true,
      billed: false,
      invoice_id: null
    });

    // Deactivate session
    await supabase
      .from('time_tracking_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    toast.success('Time tracking stopped');
    return timeEntry;
  } catch (error) {
    console.error('Error stopping time tracking:', error);
    toast.error('Failed to stop time tracking');
    return null;
  }
};

export const getTimeAnalytics = async (
  filters: {
    start_date?: string;
    end_date?: string;
    project_id?: string;
  } = {}
) => {
  try {
    let query = supabase
      .from('time_entries')
      .select(`
        *,
        projects(id, name, client_id, clients(name))
      `);

    if (filters.start_date) {
      query = query.gte('start_time', filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte('start_time', filters.end_date);
    }

    if (filters.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    const entries = data as TimeEntry[];

    // Calculate analytics
    const totalHours = entries.reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0) / 60;
    const billableHours = entries
      .filter(entry => entry.billable)
      .reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0) / 60;
    
    const totalRevenue = entries
      .filter(entry => entry.billable && entry.hourly_rate)
      .reduce((sum, entry) => {
        const hours = (entry.duration_minutes || 0) / 60;
        return sum + (hours * (entry.hourly_rate || 0));
      }, 0);

    const billedRevenue = entries
      .filter(entry => entry.billed && entry.hourly_rate)
      .reduce((sum, entry) => {
        const hours = (entry.duration_minutes || 0) / 60;
        return sum + (hours * (entry.hourly_rate || 0));
      }, 0);

    const projectBreakdown = entries.reduce((acc, entry) => {
      const projectId = entry.project_id || 'unassigned';
      const projectName = entry.project?.name || 'Unassigned';
      
      if (!acc[projectId]) {
        acc[projectId] = {
          name: projectName,
          hours: 0,
          billableHours: 0,
          revenue: 0
        };
      }
      
      const hours = (entry.duration_minutes || 0) / 60;
      acc[projectId].hours += hours;
      
      if (entry.billable) {
        acc[projectId].billableHours += hours;
        if (entry.hourly_rate) {
          acc[projectId].revenue += hours * entry.hourly_rate;
        }
      }
      
      return acc;
    }, {} as Record<string, any>);

    return {
      totalHours,
      billableHours,
      totalRevenue,
      billedRevenue,
      unbilledRevenue: totalRevenue - billedRevenue,
      projectBreakdown: Object.values(projectBreakdown),
      entries
    };
  } catch (error) {
    console.error('Error fetching time analytics:', error);
    toast.error('Failed to load analytics');
    return null;
  }
};