
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BarChart2, 
  CreditCard, 
  Briefcase, 
  Settings, 
  Users,
  Folder,
  Brain,
  Wand2,
  FolderTree,
  ListTodo,
  SquareCode,
  FileText,
  WalletCards,
  Zap,
  Plus,
  X,
  Edit3
} from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export interface DockLink {
  id: string;
  title: string;
  path: string;
  icon: React.ComponentType<any>;
}

const availablePages: DockLink[] = [
  { id: "dashboard", title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { id: "analytics", title: "Analytics", path: "/analytics", icon: BarChart2 },
  { id: "payments", title: "Payments", path: "/payments", icon: CreditCard },
  { id: "invoices", title: "Invoices", path: "/invoices", icon: FileText },
  { id: "expenses", title: "Expenses", path: "/expenses", icon: WalletCards },
  { id: "portfolio", title: "Portfolio", path: "/portfolio", icon: Briefcase },
  { id: "clients", title: "Clients", path: "/clients", icon: Users },
  { id: "projects", title: "Projects", path: "/projects", icon: Folder },
  { id: "team", title: "Teams", path: "/team", icon: Users },
  { id: "ai-assistant", title: "AI Assistant", path: "/ai-assistant", icon: Brain },
  { id: "content-generator", title: "Content Generator", path: "/content-generator", icon: Wand2 },
  { id: "file-manager", title: "File Manager", path: "/file-manager", icon: FolderTree },
  { id: "productivity", title: "Productivity", path: "/productivity", icon: Zap },
  { id: "task-manager", title: "Task Manager", path: "/task-manager", icon: ListTodo },
  { id: "code-snippets", title: "Code Snippets", path: "/code-snippets", icon: SquareCode },
  { id: "settings", title: "Settings", path: "/settings", icon: Settings },
];

const defaultDockLinks: DockLink[] = [
  { id: "dashboard", title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { id: "projects", title: "Projects", path: "/projects", icon: Folder },
  { id: "clients", title: "Clients", path: "/clients", icon: Users },
  { id: "ai-assistant", title: "AI Assistant", path: "/ai-assistant", icon: Brain },
  { id: "analytics", title: "Analytics", path: "/analytics", icon: BarChart2 },
  { id: "settings", title: "Settings", path: "/settings", icon: Settings },
];

const FloatingDock = () => {
  const location = useLocation();
  const [dockLinks, setDockLinks] = useState<DockLink[]>(defaultDockLinks);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>("");

  // Load saved dock configuration from localStorage
  useEffect(() => {
    const savedDockLinks = localStorage.getItem('dockLinks');
    if (savedDockLinks) {
      try {
        const parsed = JSON.parse(savedDockLinks);
        setDockLinks(parsed);
      } catch (error) {
        console.error('Error loading dock links:', error);
      }
    }
  }, []);

  // Save dock configuration to localStorage
  const saveDockLinks = (links: DockLink[]) => {
    setDockLinks(links);
    localStorage.setItem('dockLinks', JSON.stringify(links));
    toast.success('Dock configuration saved');
  };

  const addLink = () => {
    if (!selectedPage) return;
    
    const pageToAdd = availablePages.find(page => page.id === selectedPage);
    if (!pageToAdd) return;
    
    // Check if page is already in dock
    if (dockLinks.some(link => link.id === pageToAdd.id)) {
      toast.error('Page is already in the dock');
      return;
    }
    
    const newLinks = [...dockLinks, pageToAdd];
    saveDockLinks(newLinks);
    setSelectedPage("");
  };

  const removeLink = (linkId: string) => {
    const newLinks = dockLinks.filter(link => link.id !== linkId);
    saveDockLinks(newLinks);
  };

  const resetToDefault = () => {
    saveDockLinks(defaultDockLinks);
    setIsCustomizing(false);
  };

  const availablePagesToAdd = availablePages.filter(
    page => !dockLinks.some(link => link.id === page.id)
  );

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <Dock className="items-end pb-3 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg">
        {dockLinks.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <DockItem
              key={item.id}
              className={`aspect-square rounded-full transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25' 
                  : 'bg-gray-200/80 dark:bg-neutral-800/80 hover:bg-gray-300/80 dark:hover:bg-neutral-700/80'
              }`}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>
                <Link to={item.path} className="w-full h-full flex items-center justify-center">
                  <item.icon 
                    className={`h-full w-full transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : 'text-neutral-600 dark:text-neutral-300'
                    }`} 
                  />
                </Link>
              </DockIcon>
              {isCustomizing && (
                <button
                  onClick={() => removeLink(item.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </DockItem>
          );
        })}
        
        {/* Customize Button */}
        <DockItem className="aspect-square rounded-full bg-gray-300/80 dark:bg-neutral-700/80 hover:bg-gray-400/80 dark:hover:bg-neutral-600/80">
          <DockLabel>Customize Dock</DockLabel>
          <DockIcon>
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full h-full flex items-center justify-center">
                  <Edit3 className="h-full w-full text-neutral-600 dark:text-neutral-300" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Customize Dock</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Add Page</h3>
                    <div className="flex gap-2">
                      <Select value={selectedPage} onValueChange={setSelectedPage}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a page to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePagesToAdd.map((page) => (
                            <SelectItem key={page.id} value={page.id}>
                              {page.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={addLink} disabled={!selectedPage}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Current Pages</h3>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {dockLinks.map((link) => (
                        <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center gap-2">
                            <link.icon className="w-4 h-4" />
                            <span className="text-sm">{link.title}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeLink(link.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={resetToDefault}
                      className="flex-1"
                    >
                      Reset to Default
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </DockIcon>
        </DockItem>
      </Dock>
    </div>
  );
};

export default FloatingDock;