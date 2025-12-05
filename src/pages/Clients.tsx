
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Edit,
  Trash, 
  Mail,
  Phone,
  Building,
  FileText,
  Filter,
  ExternalLink
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent,
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types/database";
import { getClients, createClient, updateClient, deleteClient } from "@/services/clientService";
import ClientForm from "@/components/ClientForm";
import ClientDetail from "@/components/ClientDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const Clients = () => {
  // Add missing state declarations
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Add useEffect to fetch clients
  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch clients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientsData();
  }, []);

  // Add useEffect for filtering clients
  useEffect(() => {
    let filtered = [...clients];
    
    if (searchQuery) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchQuery, statusFilter]);

  // Add missing handler functions
  const handleViewClientDetail = (client: Client) => {
    setSelectedClient(client);
    // Add your view detail logic here
  };

  const handleAddClient = async (clientData: Omit<Client, "id">) => {
    try {
      await createClient(clientData);
      toast.success("Client added successfully");
      setIsAddClientOpen(false);
      // Refresh clients list
      const updatedClients = await getClients();
      setClients(updatedClients);
    } catch (error: any) {
      toast.error(error.message || "Failed to add client");
    }
  };

  const handleEditClient = async (clientData: Client) => {
    try {
      await updateClient(clientData);
      toast.success("Client updated successfully");
      setIsEditClientOpen(false);
      // Refresh clients list
      const updatedClients = await getClients();
      setClients(updatedClients);
    } catch (error: any) {
      toast.error(error.message || "Failed to update client");
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      await deleteClient(clientId);
      toast.success("Client deleted successfully");
      // Refresh clients list
      const updatedClients = await getClients();
      setClients(updatedClients);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete client");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create invitation record
      const { data, error } = await supabase
        .from('client_invitations')
        .insert({
          email: email,
          freelancer_id: user.id,
          token: crypto.randomUUID(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days expiry
        })
        .select()
        .single();

      if (error) throw error;

      // Send invitation email using Supabase Edge Function
      const { error: emailError } = await supabase.functions.invoke('send-client-invitation', {
        body: {
          email: email,
          invitationToken: data.token,
          freelancerName: user.user_metadata?.full_name || 'Your Freelancer'
        }
      });

      if (emailError) throw emailError;

      toast.success("Invitation sent successfully!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">
            Manage your clients and their associated projects
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 md:min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "cards" | "table")} className="hidden sm:block">
            <TabsList>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
          <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
            <Button className="gap-1" onClick={() => setIsAddClientOpen(true)}>
              <UserPlus className="size-4" />
              <span className="hidden sm:inline">Add Client</span>
            </Button>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Enter the details of the new client to add them to your roster.
                </DialogDescription>
              </DialogHeader>
              <ClientForm 
                onSubmit={handleAddClient}
                onCancel={() => setIsAddClientOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-2">
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <Card key={client.id} className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleViewClientDetail(client)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{client.name}</CardTitle>
                      <CardDescription className="mt-1">{client.company || "No company"}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient(client);
                          setIsEditClientOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClient(client.id);
                        }}>
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="mr-2 h-4 w-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.industry && (
                      <div className="flex items-center text-muted-foreground">
                        <Building className="mr-2 h-4 w-4" />
                        <span>{client.industry}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-2">
                  <div>
                    <Badge variant={client.status === "active" ? "cyan" : client.status === "lead" ? "blue" : "secondary"}>
                      {client.status}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">
                      {client.projects?.length || 0} {client.projects?.length === 1 ? "project" : "projects"}
                    </span>
                    <ExternalLink className="ml-1 h-3 w-3 text-muted-foreground" />
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Users className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No clients found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "We couldn't find any clients matching your filters."
                  : "Get started by adding your first client."}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button onClick={() => setIsAddClientOpen(true)} className="mt-4">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Client
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Client List</CardTitle>
            <CardDescription>A comprehensive view of all your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {filteredClients.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Company</th>
                      <th className="text-left py-3 px-4 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Projects</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => handleViewClientDetail(client)}>
                        <td className="py-3 px-4 font-medium">{client.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{client.company || "-"}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Email</span>
                            <span className="text-sm">{client.email}</span>
                            {client.phone && (
                              <>
                                <span className="text-xs text-muted-foreground mt-1">Phone</span>
                                <span className="text-sm">{client.phone}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={client.status === "active" ? "cyan" : client.status === "lead" ? "blue" : "secondary"}>
                            {client.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {client.projects?.length || 0} {client.projects?.length === 1 ? "project" : "projects"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClient(client);
                                setIsEditClientOpen(true);
                              }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClient(client.id);
                              }}>
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No clients found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery || statusFilter !== "all" 
                      ? "We couldn't find any clients matching your filters."
                      : "Get started by adding your first client."}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <Button onClick={() => setIsAddClientOpen(true)} className="mt-4">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add New Client
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update the client's information.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <ClientForm 
              initialData={selectedClient}
              onSubmit={handleEditClient}
              onCancel={() => setIsEditClientOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
