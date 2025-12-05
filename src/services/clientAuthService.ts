import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClientInvitation {
  id: string;
  email: string;
  token: string;
  freelancer_id: string;
  created_at: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'expired';
}

export interface ClientUser {
  id: string;
  email: string;
  name: string;
  company_name?: string;
  phone?: string;
  freelancer_id: string;
  created_at: string;
}

export const sendClientInvitation = async (email: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Generate a unique token
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { error } = await supabase
      .from('client_invitations')
      .insert({
        email,
        token,
        freelancer_id: userData.user.id,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      });

    if (error) throw error;

    // Send email with invitation link
    const inviteUrl = `${window.location.origin}/client/accept-invitation?token=${token}`;
    
    const { error: emailError } = await supabase.functions.invoke('send-client-invitation', {
      body: { 
        email, 
        inviteUrl,
        freelancerName: userData.user.user_metadata?.name || 'Your freelancer'
      }
    });

    if (emailError) throw emailError;

    toast.success(`Invitation sent to ${email}`);
    return true;
  } catch (error: any) {
    console.error('Error sending client invitation:', error);
    toast.error(`Failed to send invitation: ${error.message || 'Unknown error'}`);
    return false;
  }
};

export const verifyInvitationToken = async (token: string): Promise<ClientInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('client_invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (error) throw error;

    // Check if invitation has expired
    if (new Date(data.expires_at) < new Date()) {
      await supabase
        .from('client_invitations')
        .update({ status: 'expired' })
        .eq('id', data.id);
      
      throw new Error('Invitation has expired');
    }

    return data;
  } catch (error: any) {
    console.error('Error verifying invitation token:', error);
    return null;
  }
};

export const registerClient = async (
  token: string, 
  name: string, 
  password: string,
  companyName?: string,
  phone?: string
): Promise<boolean> => {
  try {
    // Verify token first
    const invitation = await verifyInvitationToken(token);
    if (!invitation) throw new Error('Invalid or expired invitation');

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: {
        data: {
          name,
          company_name: companyName,
          phone,
          user_type: 'client',
          freelancer_id: invitation.freelancer_id
        }
      }
    });

    if (authError) throw authError;

    // Create client profile
    const { error: profileError } = await supabase
      .from('client_profiles')
      .insert({
        id: authData.user?.id,
        email: invitation.email,
        name,
        company_name: companyName,
        phone,
        freelancer_id: invitation.freelancer_id
      });

    if (profileError) throw profileError;

    // Update invitation status
    await supabase
      .from('client_invitations')
      .update({ status: 'accepted' })
      .eq('id', invitation.id);

    toast.success('Registration successful! You can now log in to your client portal.');
    return true;
  } catch (error: any) {
    console.error('Error registering client:', error);
    toast.error(`Registration failed: ${error.message || 'Unknown error'}`);
    return false;
  }
};

export const getClientProfile = async (): Promise<ClientUser | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching client profile:', error);
    return null;
  }
};

export const isUserClient = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return false;
    
    return data.user?.user_metadata?.user_type === 'client';
  } catch {
    return false;
  }
};