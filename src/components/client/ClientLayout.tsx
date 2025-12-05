import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ClientSidebar from "./ClientSidebar";
import { isUserClient } from "@/services/clientAuthService";

const ClientLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkClientAuth = async () => {
      const isClient = await isUserClient();
      if (!isClient) {
        navigate("/client/login");
      }
    };

    checkClientAuth();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-muted/10">
      <ClientSidebar />
      <div className="flex-1 flex flex-col overflow-hidden pt-16 lg:pt-0">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;