
export interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;
  };
  identities: [
    {
      id: string;
      user_id: string;
      identity_data: {
        avatar_url: string;
        email: string;
        email_verified: boolean;
        full_name: string;
        iss: string;
        name: string;
        phone_verified: boolean;
        picture: string;
        provider_id: string;
        sub: string;
      };
      provider: string;
      last_sign_in_at: string;
      created_at: string;
      updated_at: string;
    }
  ];
  created_at: string;
  updated_at: string;
}

export interface Client {
  updated_at: string | number | Date;
  id: string;
  created_at: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string |null;
  address: string | null;
  website: string | null;
  notes: string | null;
  city: string | null;
  state: string | null;
  postal_code:  string | null;
  
  country: string | null;
  industry: string | null;
  contact_name: string | null;
  contact_position: string | null;
  status: 'active' | 'inactive' | 'lead';
  auth_user_id: string | null;
  has_portal_access: boolean | null;
  temp_password: string | null;
  projects?: any[];
}

export interface Project {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  client_id: string | null;
  deadline: string | null;
  category: string | null;
  status: 'pending' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  progress: number;
  notes: string | null;
  start_date: string | null;
  budget: number | null;
  priority: 'low' | 'medium' | 'high';
  tags: string[] | null;
  manager_notes: string | null;
  banner_url: string | null;
  client?: Client;
  project_team?: ProjectTeam[];
  team?: TeamMember[];
  teamCount?: number;
}

export interface ProjectTeam {
  id: string;
  created_at: string;
  project_id: string;
  team_member_id: string;
  role: string;
  team_members?: TeamMember;
}

export interface ClientInvitation {
  id: string;
  project_id: string;
  client_id: string | null;
  email: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  role: string;
  created_at: string;
  expires_at: string;
  invited_by: string | null;
}

export interface ClientAccess {
  id: string;
  client_id: string;
  project_id: string;
  access_level: 'view' | 'comment' | 'edit';
  created_at: string;
  updated_at: string;
  last_access: string | null;
  clients?: Client;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  project_role?: string;
  email?: string;
  phone?: string;
  status?: string;
  location?: string;
  department?: string;
  bio?: string;
  avatar_url?: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id?: string;
  project_id?: string;
  invoice_number: string;
  title: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_rate?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount: number;
  currency: string;
  notes?: string;
  terms_conditions?: string;
  payment_instructions?: string;
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  logo_url?: string;
  template_style?: 'modern' | 'classic' | 'minimal' | 'creative';
  brand_color?: string;
  created_at?: string;
  updated_at?: string;
  client?: Client;
  project?: Project;
  invoice_items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  created_at?: string;
}

export interface TimeEntry {
  projects: any;
  id: string;
  user_id: string;
  project_id: string | null;
  task_id: string | null;
  description: string | null;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  hourly_rate: number | null;
  billable: boolean;
  billed: boolean;
  invoice_id: string | null;
  created_at: string;
  updated_at: string;
  project?: Project;
  task?: any;
}

export interface TimeTrackingSession {
  id: string;
  user_id: string;
  project_id: string | null;
  task_id: string | null;
  description: string | null;
  start_time: string;
  is_active: boolean;
  created_at: string;
  project?: Project;
  task?: any;
}

export interface Insight {
  id: string;
  entity_id: string;
  entity_type: string;
  key_metrics: any;
  total_revenue: number | null;
  active_projects: number | null;
  completed_projects: number | null;
  average_completion_time: number | null;
  total_time_spent: number | null;
  last_interaction: string | null;
  upcoming_deadlines: any[] | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  attachment_url?: string;
  created_at: string;
  updated_at: string;
  edited: boolean;
  reply_to_id?: string;
  sender?: {
    id: string;
    email: string;
    display_name?: string;
    avatar_url?: string;
  };
  reply_to?: Message;
}
