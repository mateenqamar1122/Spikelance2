import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getClientProfile } from "@/services/clientAuthService";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText,  
  MessageSquare, 
  Calendar, 
  FileCheck, 
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ClientSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [clientName, setClientName] = useState("");
  const [clientInitials, setClientInitials] = useState("");
  const location = useLocation();

  useEffect(() => {
    const loadClientProfile = async () => {
      const profile = await getClientProfile();
      if (profile) {
        setClientName(profile.name);
        setClientInitials(profile.name.split(" ").map(n => n[0]).join("").toUpperCase());
      }
    };
    
    loadClientProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/client/login";
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/client/dashboard",
      icon: <FileCheck className="h-5 w-5" />,
    },
    {
      title: "Projects",
      path: "/client/projects",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Invoices",
      path: "/client/invoices",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Messages",
      path: "/client/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Appointments",
      path: "/client/appointments",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Profile",
      path: "/client/profile",
      icon: <User className="h-5 w-5" />,
    }
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between bg-background border-b p-4 lg:hidden">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <span className="ml-2 font-semibold">Client Portal</span>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback>{clientInitials}</AvatarFallback>
        </Avatar>
      </div>

      <div className={`fixed inset-0 z-10 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${isOpen ? "lg:w-64" : "lg:w-20"} flex-shrink-0`}>
        <div className="flex flex-col h-full bg-background border-r shadow-sm overflow-y-auto">
          <div className="p-4 flex flex-col items-center justify-center border-b">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src="" />
              <AvatarFallback>{clientInitials}</AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="text-center">
                <p className="font-medium">{clientName}</p>
                <p className="text-sm text-muted-foreground">Client Portal</p>
              </div>
            )}
          </div>

          <div className="flex-1 py-6">
            <nav className="px-2 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center justify-center w-6">
                      {item.icon}
                    </span>
                    {isOpen && <span className="ml-3">{item.title}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              {isOpen && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientSidebar;