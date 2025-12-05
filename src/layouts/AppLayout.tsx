
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>
        <pre className="mb-4 text-sm text-gray-600">{error.message}</pre>
        <button
          onClick={resetErrorBoundary}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Memoize the resize handler
  const handleResize = useCallback(() => {
    try {
      const width = window.innerWidth;
      setIsSidebarOpen(width >= 1024);
    } catch (error) {
      console.error('Resize handler error:', error);
    }
  }, []);

  useEffect(() => {
    // Set initial state
    handleResize();

    // Add event listener with error handling
    try {
      window.addEventListener('resize', handleResize);
      
      // Cleanup function
      return () => {
        try {
          window.removeEventListener('resize', handleResize);
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      };
    } catch (error) {
      console.error('Effect error:', error);
    }
  }, [handleResize]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <div className="relative flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-[72px] lg:ml-72' : 'ml-[72px]'
          }`}
        >
          {/* <div className="flex h-14 lg:h-[60px] items-center gap-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4">
            <div className="lg:hidden">
              <SidebarTrigger onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div> */}
            {/* <div className="flex-1 font-medium">Dashboard</div> */}
          {/* </div> */}
          <div className="p-6 pb-24">
            <Outlet />
          </div>
        </main>
        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

export default AppLayout;