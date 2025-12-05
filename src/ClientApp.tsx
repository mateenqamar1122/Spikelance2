import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";


//client realted imports 
import ClientLayout from "@/components/client/ClientLayout";
import AcceptInvitation from "@/pages/client/AcceptInvitation";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientLogin from "@/pages/client/ClientLogin";
import ClientProjects from "@/pages/client/ClientProjects";
import ClientInvoices from "@/pages/client/ClientInvoices";
import ClientMessages from "@/pages/client/ClientMessages";
import ClientAppointments from "@/pages/client/ClientAppointments";
// import ClientProfile from "@/pages/client/Profile";
////


const queryClient = new QueryClient();

const ClientApp = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SidebarProvider>
            <BrowserRouter>
              
              // Add these routes to your existing routes
<Route path="/client/accept-invitation" element={<AcceptInvitation />} />
<Route path="/client/login" element={<ClientLogin />} />
<Route path="/client" element={<ClientLayout />}>
  <Route path="dashboard" element={<ClientDashboard />} />
  <Route path="projects" element={<ClientProjects />} />
  <Route path="invoices" element={<ClientInvoices />} />
  <Route path="messages" element={<ClientMessages />} />
  <Route path="appointments" element={<ClientAppointments />} />
  {/* <Route path="profile" element={<ClientProfile />} /> */}
</Route>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default ClientApp;