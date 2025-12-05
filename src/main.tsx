import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import App from './App';
import './index.css';
import ClientApp from './ClientApp';

const RoleBasedApp = () => {
  const [userRole, setUserRole] = useState<'admin' | 'client' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserRole(null);
          return;
        }

        // Check user metadata for role
        const userType = user.user_metadata?.user_type;
        setUserRole(userType === 'client' ? 'client' : 'admin');
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check
    checkUserRole();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const userType = session?.user?.user_metadata?.user_type;
        setUserRole(userType === 'client' ? 'client' : 'admin');
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render appropriate app based on user role
  return userRole === 'client' ? <ClientApp /> : <App />;
};

createRoot(document.getElementById('root')!).render(<RoleBasedApp />);


