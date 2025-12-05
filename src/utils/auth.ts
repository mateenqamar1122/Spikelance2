import { supabase } from '@/integrations/supabase/client';

export const getUserRole = async (): Promise<'admin' | 'client' | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return user.user_metadata?.user_type === 'client' ? 'client' : 'admin';
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const isClient = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'client';
};

export const isAdmin = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'admin';
};

export const requireAdmin = async (): Promise<void> => {
  const role = await getUserRole();
  if (role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
};

export const requireClient = async (): Promise<void> => {
  const role = await getUserRole();
  if (role !== 'client') {
    throw new Error('Unauthorized: Client access required');
  }
};