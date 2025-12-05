// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { format } from "date-fns";
// import { v4 as uuidv4 } from "uuid";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// import { CalendarIcon, Plus, Trash2, FileText, Edit, Eye, Download, Search, Filter, ArrowUpDown, Loader2 } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import { cn } from "@/lib/utils";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { getInvoices, createInvoice, Invoice } from "@/services/invoiceService";
// import { getClientById, getClients } from "@/services/clientService";
// import { Client } from "@/types/database";
// import { ColorPicker } from "@/components/ui/color-picker";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { FormDescription } from "@/components/ui/form";


// const formSchema = z.object({
//   clientId: z.string().min(1, { message: "Client is required" }),
//   projectId: z.string().optional(),
//   invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
//   issueDate: z.date(),
//   dueDate: z.date(),
//   status: z.string().default("draft"),
//   notes: z.string().optional(),
//   items: z.array(
//     z.object({
//       id: z.string(),
//       description: z.string().min(1, { message: "Description is required" }),
//       quantity: z.number().min(0.01, { message: "Quantity must be greater than 0" }),
//       rate: z.number().min(0, { message: "Rate must be a positive number" }),
//       amount: z.number(),
//     })
//   ).min(1, { message: "At least one item is required" }),
//   branding: z.object({
//     primaryColor: z.string().default("#0ea5e9"),
//     accentColor: z.string().default("#8b5cf6"),
//     logo: z.string().optional(),
//     companyName: z.string().default("Your Company"),
//     showLogo: z.boolean().default(true),
//     showFooter: z.boolean().default(true),
//     footerText: z.string().default("Thank you for your business!"),
//     template: z.string().default("modern"),
//   }),
// });

// type FormData = z.infer<typeof formSchema>;

// const InvoiceCreate = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [activeTab, setActiveTab] = useState("create");
//   const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
//   const [previewMode, setPreviewMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("issueDate");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
//   const [clients, setClients] = useState<Client[]>([]);
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null);

//   useEffect(() => {
//     const loadClients = async () => {
//       try {
//         const clientsData = await getClients();
//         setClients(clientsData);
//       } catch (error) {
//         console.error('Error loading clients:', error);
//         toast({
//           title: "Error",
//           description: "Failed to load clients",
//           variant: "destructive",
//         });
//       }
//     };
//     loadClients();
//   }, []);
  
//   const [projects, setProjects] = useState([
//     { id: "1", name: "Project 1", clientId: "1" },
//     { id: "2", name: "Project 2", clientId: "1" },
//     // This would be populated from your API
//   ]);

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       invoiceNumber: `INV-${format(new Date(), "yyyyMMdd")}-${Math.floor(Math.random() * 1000)}`,
//       issueDate: new Date(),
//       dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//       status: "draft",
//       items: [
//         {
//           id: uuidv4(),
//           description: "",
//           quantity: 1,
//           rate: 0,
//           amount: 0,
//         },
//       ],
//       branding: {
//         primaryColor: "#0ea5e9",
//         accentColor: "#8b5cf6",
//         companyName: "Your Company",
//         showLogo: true,
//         showFooter: true,
//         footerText: "Thank you for your business!",
//         template: "modern",
//       }
//     },
//   });

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   const fetchInvoices = async () => {
//     setIsLoading(true);
//     try {
//       const data = await getInvoices();
//       setInvoices(data);
//     } catch (error) {
//       console.error("Failed to fetch invoices:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load invoices",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const items = form.watch("items");
//   const selectedClientId = form.watch("clientId");
//   const branding = form.watch("branding");

//   const filteredProjects = projects.filter(
//     (project) => project.clientId === selectedClientId
//   );

//   const calculateItemAmount = (quantity: number, rate: number) => {
//     return quantity * rate;
//   };

//   const calculateTotal = () => {
//     return items.reduce((total, item) => total + item.amount, 0);
//   };

//   const addItem = () => {
//     const currentItems = form.getValues("items");
//     form.setValue("items", [
//       ...currentItems,
//       {
//         id: uuidv4(),
//         description: "",
//         quantity: 1,
//         rate: 0,
//         amount: 0,
//       },
//     ]);
//   };

//   const removeItem = (index: number) => {
//     const currentItems = form.getValues("items");
//     if (currentItems.length > 1) {
//       form.setValue(
//         "items",
//         currentItems.filter((_, i) => i !== index)
//       );
//     } else {
//       toast({
//         title: "Cannot remove item",
//         description: "Invoice must have at least one item",
//         variant: "destructive",
//       });
//     }
//   };

//   const onSubmit = async (data: FormData) => {
//     setIsLoading(true);
//     try {
//       const result = await createInvoice(data);
//       if (result) {
//         toast({
//           title: "Invoice created",
//           description: "Your invoice has been created successfully",
//         });
//         fetchInvoices();
//         setActiveTab("list");
//       }
//     } catch (error) {
//       console.error("Error creating invoice:", error);
//       toast({
//         title: "Error",
//         description: "Failed to create invoice. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredInvoices = searchQuery
//     ? invoices.filter(
//         invoice =>
//           invoice.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : invoices;

//   const handleSort = (field: string) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortOrder("desc");
//     }
//   };

//   const handlePreview = () => {
//     setPreviewMode(!previewMode);
//   };

//   const handleEditInvoice = (invoice: Invoice) => {
//     form.reset({
//       clientId: invoice.clientId,
//       projectId: invoice.projectId,
//       invoiceNumber: invoice.invoiceNumber,
//       issueDate: new Date(invoice.issueDate),
//       dueDate: new Date(invoice.dueDate),
//       status: invoice.status,
//       notes: invoice.notes,
//       items: invoice.items,
//       branding: invoice.branding || {
//         primaryColor: "#0ea5e9",
//         accentColor: "#8b5cf6",
//         companyName: "Your Company",
//         showLogo: true,
//         showFooter: true,
//         footerText: "Thank you for your business!",
//         template: "modern",
//       }
//     });
//     setSelectedInvoice(invoice);
//     setActiveTab("create");
//   };

//   return (
//     <div className="container py-6">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-magenta">Invoice Management</h1>
//         <Button variant="outline" onClick={() => navigate("/payments")}>
//           Back to Payments
//         </Button>
//       </div>

//       <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full grid-cols-2 mb-6">
//           <TabsTrigger value="create">Create Invoice</TabsTrigger>
//           <TabsTrigger value="list">Saved Invoices</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="create">
//           {previewMode ? (
//             <div className="space-y-6">
//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={handlePreview}>
//                   Back to Edit
//                 </Button>
//                 <Button>
//                   <Download className="mr-2 h-4 w-4" /> Download PDF
//                 </Button>
//               </div>
              
//               <div className="border rounded-lg p-8 bg-white" style={{
//                 "--primary-color": branding.primaryColor,
//                 "--accent-color": branding.accentColor,
//               } as React.CSSProperties}>
//                 {/* Invoice Preview */}
//                 <div className="flex justify-between items-start mb-8">
//                   <div>
//                     {branding.showLogo && (
//                       <div className="w-40 h-20 bg-gray-100 flex items-center justify-center mb-4 rounded">
//                         {branding.logo ? (
//                           <img src={branding.logo} alt="Company Logo" className="max-w-full max-h-full" />
//                         ) : (
//                           <span className="text-gray-400">Your Logo</span>
//                         )}
//                       </div>
//                     )}
//                     <h1 className="text-2xl font-bold" style={{ color: branding.primaryColor }}>{branding.companyName}</h1>
//                     <p className="text-gray-500">123 Business Street</p>
//                     <p className="text-gray-500">City, State 12345</p>
//                     <p className="text-gray-500">contact@example.com</p>
//                   </div>
                  
//                   <div className="text-right">
//                     <h2 className="text-3xl font-bold mb-4" style={{ color: branding.primaryColor }}>INVOICE</h2>
//                     <p><span className="font-medium">Invoice #:</span> {form.getValues("invoiceNumber")}</p>
//                     <p><span className="font-medium">Issue Date:</span> {format(form.getValues("issueDate"), "MMM dd, yyyy")}</p>
//                     <p><span className="font-medium">Due Date:</span> {format(form.getValues("dueDate"), "MMM dd, yyyy")}</p>
//                     <p><span className="font-medium">Status:</span> <span className="uppercase px-2 py-1 rounded text-xs font-bold" style={{
//                       backgroundColor: form.getValues("status") === "paid" ? "#dcfce7" : 
//                                       form.getValues("status") === "pending" ? "#fef9c3" : "#f3f4f6",
//                       color: form.getValues("status") === "paid" ? "#166534" : 
//                              form.getValues("status") === "pending" ? "#854d0e" : "#4b5563"
//                     }}>{form.getValues("status")}</span></p>
//                   </div>
//                 </div>
                
//                 <div className="mb-8">
//                   <h3 className="text-lg font-bold mb-2" style={{ color: branding.primaryColor }}>Bill To:</h3>
//                   <p className="font-medium">{selectedClient?.name || "Client Name"}</p>
//                   <p className="text-gray-500">{selectedClient?.address || "Client Address"}</p>
//                   <p className="text-gray-500">{selectedClient?.city}, {selectedClient?.state} {selectedClient?.postal_code}</p>
//                   <p className="text-gray-500">{selectedClient?.email || "client@example.com"}</p>
//                 </div>
                
//                 <div className="mb-8">
//                   <table className="w-full">
//                     <thead>
//                       <tr style={{ backgroundColor: branding.primaryColor, color: "white" }}>
//                         <th className="text-left py-2 px-4 rounded-tl-lg">Description</th>
//                         <th className="text-right py-2 px-4">Quantity</th>
//                         <th className="text-right py-2 px-4">Rate</th>
//                         <th className="text-right py-2 px-4 rounded-tr-lg">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {items.map((item, index) => (
//                         <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
//                           <td className="py-2 px-4">{item.description}</td>
//                           <td className="text-right py-2 px-4">{item.quantity}</td>
//                           <td className="text-right py-2 px-4">${item.rate.toFixed(2)}</td>
//                           <td className="text-right py-2 px-4">${item.amount.toFixed(2)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     <tfoot>
//                       <tr>
//                         <td colSpan={3} className="text-right py-4 px-4 font-bold">Total:</td>
//                         <td className="text-right py-4 px-4 font-bold" style={{ color: branding.primaryColor }}>
//                           ${calculateTotal().toFixed(2)}
//                         </td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
                
//                 {form.getValues("notes") && (
//                   <div className="mb-8">
//                     <h3 className="text-lg font-bold mb-2" style={{ color: branding.primaryColor }}>Notes:</h3>
//                     <p className="text-gray-600">{form.getValues("notes")}</p>
//                   </div>
//                 )}
                
//                 {branding.showFooter && (
//                   <div className="text-center pt-8 border-t">
//                     <p className="text-gray-600">{branding.footerText}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                 <div className="flex justify-between">
//                   <h2 className="text-xl font-semibold mb-4">{selectedInvoice ? "Edit Invoice" : "Create New Invoice"}</h2>
//                   <div className="space-x-2">
//                     <Button type="button" variant="outline" onClick={handlePreview}>
//                       <Eye className="mr-2 h-4 w-4" /> Preview
//                     </Button>
//                     <Button type="submit" disabled={isLoading}>
//                       {isLoading ? "Saving..." : selectedInvoice ? "Update Invoice" : "Create Invoice"}
//                     </Button>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Client Information</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <FormField
//                         control={form.control}
//                         name="clientId"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Client</FormLabel>
//                             <Select
//                               onValueChange={async (value) => {
//                                 field.onChange(value);
//                                 const client = await getClientById(value);
//                                 if (client) {
//                                   // Auto-populate client details in the preview
//                                   setSelectedClient(client);
//                                 }
//                               }}
//                               defaultValue={field.value}
//                             >
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select a client" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 {clients.map((client) => (
//                                   <SelectItem key={client.id} value={client.id}>
//                                     {client.name}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="projectId"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Project (Optional)</FormLabel>
//                             <Select
//                               onValueChange={field.onChange}
//                               defaultValue={field.value}
//                               disabled={!selectedClientId}
//                             >
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select a project" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 {filteredProjects.map((project) => (
//                                   <SelectItem key={project.id} value={project.id}>
//                                     {project.name}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Invoice Details</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <FormField
//                         control={form.control}
//                         name="invoiceNumber"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Invoice Number</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <div className="grid grid-cols-2 gap-4">
//                         <FormField
//                           control={form.control}
//                           name="issueDate"
//                           render={({ field }) => (
//                             <FormItem className="flex flex-col">
//                               <FormLabel>Issue Date</FormLabel>
//                               <Popover>
//                                 <PopoverTrigger asChild>
//                                   <FormControl>
//                                     <Button
//                                       variant={"outline"}
//                                       className={cn(
//                                         "pl-3 text-left font-normal",
//                                         !field.value && "text-muted-foreground"
//                                       )}
//                                     >
//                                       {field.value ? (
//                                         format(field.value, "PPP")
//                                       ) : (
//                                         <span>Pick a date</span>
//                                       )}
//                                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                                     </Button>
//                                   </FormControl>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="w-auto p-0" align="start">
//                                   <Calendar
//                                     mode="single"
//                                     selected={field.value}
//                                     onSelect={field.onChange}
//                                     initialFocus
//                                   />
//                                 </PopoverContent>
//                               </Popover>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name="dueDate"
//                           render={({ field }) => (
//                             <FormItem className="flex flex-col">
//                               <FormLabel>Due Date</FormLabel>
//                               <Popover>
//                                 <PopoverTrigger asChild>
//                                   <FormControl>
//                                     <Button
//                                       variant={"outline"}
//                                       className={cn(
//                                         "pl-3 text-left font-normal",
//                                         !field.value && "text-muted-foreground"
//                                       )}
//                                     >
//                                       {field.value ? (
//                                         format(field.value, "PPP")
//                                       ) : (
//                                         <span>Pick a date</span>
//                                       )}
//                                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                                     </Button>
//                                   </FormControl>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="w-auto p-0" align="start">
//                                   <Calendar
//                                     mode="single"
//                                     selected={field.value}
//                                     onSelect={field.onChange}
//                                     initialFocus
//                                   />
//                                 </PopoverContent>
//                               </Popover>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>

//                       <FormField
//                         control={form.control}
//                         name="status"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Status</FormLabel>
//                             <Select
//                               onValueChange={field.onChange}
//                               defaultValue={field.value}
//                             >
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select status" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 <SelectItem value="draft">Draft</SelectItem>
//                                 <SelectItem value="pending">Pending</SelectItem>
//                                 <SelectItem value="sent">Sent</SelectItem>
//                                 <SelectItem value="paid">Paid</SelectItem>
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Invoice Items</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-12 gap-4 font-medium text-sm">
//                         <div className="col-span-6">Description</div>
//                         <div className="col-span-2">Quantity</div>
//                         <div className="col-span-2">Rate</div>
//                         <div className="col-span-1">Amount</div>
//                         <div className="col-span-1"></div>
//                       </div>

//                       {items.map((item, index) => (
//                         <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
//                           <div className="col-span-6">
//                             <FormField
//                               control={form.control}
//                               name={`items.${index}.description`}
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormControl>
//                                     <Input {...field} placeholder="Item description" />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </div>
//                           <div className="col-span-2">
//                             <FormField
//                               control={form.control}
//                               name={`items.${index}.quantity`}
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormControl>
//                                     <Input
//                                       type="number"
//                                       min="0.01"
//                                       step="0.01"
//                                       {...field}
//                                       onChange={(e) => {
//                                         const value = parseFloat(e.target.value);
//                                         field.onChange(value);
//                                         const rate = form.getValues(`items.${index}.rate`);
//                                         const amount = calculateItemAmount(value, rate);
//                                         form.setValue(`items.${index}.amount`, amount);
//                                       }}
//                                     />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </div>
//                           <div className="col-span-2">
//                             <FormField
//                               control={form.control}
//                               name={`items.${index}.rate`}
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormControl>
//                                     <Input
//                                       type="number"
//                                       min="0"
//                                       step="0.01"
//                                       {...field}
//                                       onChange={(e) => {
//                                         const value = parseFloat(e.target.value);
//                                         field.onChange(value);
//                                         const quantity = form.getValues(`items.${index}.quantity`);
//                                         const amount = calculateItemAmount(quantity, value);
//                                         form.setValue(`items.${index}.amount`, amount);
//                                       }}
//                                     />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </div>
//                           <div className="col-span-1">
//                             <FormField
//                               control={form.control}
//                               name={`items.${index}.amount`}
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormControl>
//                                     <Input
//                                       type="number"
//                                       disabled
//                                       {...field}
//                                       className="bg-muted"
//                                     />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </div>
//                           <div className="col-span-1 flex justify-center">
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => removeItem(index)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       ))}

//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         className="mt-2"
//                         onClick={addItem}
//                       >
//                         <Plus className="h-4 w-4 mr-2" /> Add Item
//                       </Button>

//                       <div className="flex justify-end mt-4">
//                         <div className="w-1/3 space-y-2">
//                           <div className="flex justify-between">
//                             <span className="font-medium">Total:</span>
//                             <span className="font-bold">
//                               ${calculateTotal().toFixed(2)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Branding & Customization</CardTitle>
//                     <CardDescription>Customize the look and feel of your invoice</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-4">
//                         <FormField
//                           control={form.control}
//                           name="branding.companyName"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Company Name</FormLabel>
//                               <FormControl>
//                                 <Input {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
                        
//                         <FormField
//                           control={form.control}
//                           name="branding.logo"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Logo URL</FormLabel>
//                               <FormControl>
//                                 <Input {...field} placeholder="https://example.com/logo.png" />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
                        
//                         <FormField
//                           control={form.control}
//                           name="branding.showLogo"
//                           render={({ field }) => (
//                             <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
//                               <div className="space-y-0.5">
//                                 <FormLabel>Show Logo</FormLabel>
//                                 <FormDescription>
//                                   Display your company logo on the invoice
//                                 </FormDescription>
//                               </div>
//                               <FormControl>
//                                 <Switch
//                                   checked={field.value}
//                                   onCheckedChange={field.onChange}
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
                        
//                         <FormField
//                           control={form.control}
//                           name="branding.template"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Invoice Template</FormLabel>
//                               <Select
//                                 onValueChange={field.onChange}
//                                 defaultValue={field.value}
//                               >
//                                 <FormControl>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select template" />
//                                   </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                   <SelectItem value="modern">Modern</SelectItem>
//                                   <SelectItem value="classic">Classic</SelectItem>
//                                   <SelectItem value="minimal">Minimal</SelectItem>
//                                   <SelectItem value="professional">Professional</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
                      
//                       <div className="space-y-4">
//                         <FormField
//                           control={form.control}
//                           name="branding.primaryColor"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Primary Color</FormLabel>
//                               <div className="flex gap-2 items-center">
//                                 <div 
//                                   className="w-8 h-8 rounded-md border"
//                                   style={{ backgroundColor: field.value }}
//                                 />
//                                 <FormControl>
//                                   <Input {...field} type="color" className="w-12 h-8 p-0 overflow-hidden" />
//                                 </FormControl>
//                               </div>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
                        
//                         <FormField
//                           control={form.control}
//                           name="branding.accentColor"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Accent Color</FormLabel>
//                               <div className="flex gap-2 items-center">
//                                 <div 
//                                   className="w-8 h-8 rounded-md border"
//                                   style={{ backgroundColor: field.value }}
//                                 />
//                                 <FormControl>
//                                   <Input {...field} type="color" className="w-12 h-8 p-0 overflow-hidden" />
//                                 </FormControl>
//                               </div>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                     </div>
                    
//                     <Separator className="my-6" />
                    
//                     <div className="space-y-4">
//                       <FormField
//                         control={form.control}
//                         name="branding.showFooter"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
//                             <div className="space-y-0.5">
//                               <FormLabel>Show Footer</FormLabel>
//                               <FormDescription>
//                                 Display a footer message on the invoice
//                               </FormDescription>
//                             </div>
//                             <FormControl>
//                               <Switch
//                                 checked={field.value}
//                                 onCheckedChange={field.onChange}
//                               />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
                      
//                       {form.watch("branding.showFooter") && (
//                         <FormField
//                           control={form.control}
//                           name="branding.footerText"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Footer Text</FormLabel>
//                               <FormControl>
//                                 <Input {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Additional Information</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <FormField
//                       control={form.control}
//                       name="notes"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Notes</FormLabel>
//                           <FormControl>
//                             <Textarea
//                               placeholder="Add any additional notes or payment instructions"
//                               className="min-h-[100px]"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </CardContent>
//                 </Card>

//                 <div className="flex justify-end space-x-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => navigate("/payments")}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={isLoading}>
//                     {isLoading ? "Creating..." : "Create Invoice"}
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           )}
//         </TabsContent>
        
//         <TabsContent value="list">
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold">Saved Invoices</h2>
//               <div className="flex gap-2">
//                 <div className="relative">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input 
//                     placeholder="Search invoices..." 
//                     className="pl-9 w-[200px]"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <Button variant="outline" onClick={() => handleSort('issueDate')}>
//                   <ArrowUpDown className="h-4 w-4 mr-2" />
//                   Sort by Date {sortBy === 'issueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
//                 </Button>
//               </div>
//             </div>
            
//             {isLoading ? (
//               <div className="flex justify-center items-center py-20">
//                 <Loader2 className="h-8 w-8 animate-spin text-brand-magenta" />
//               </div>
//             ) : invoices.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {invoices.map((invoice) => (
//                   <Card key={invoice.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
//                     <CardHeader className="pb-2">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <CardTitle className="text-lg">{invoice.invoiceNumber}</CardTitle>
//                           <CardDescription>
//                             {invoice.clientName || "Client Name"}
//                           </CardDescription>
//                         </div>
//                         <div className="px-2 py-1 rounded text-xs font-bold uppercase" style={{
//                           backgroundColor: 
//                             invoice.status === "paid" ? "#dcfce7" : 
//                             invoice.status === "pending" ? "#fef9c3" : 
//                             invoice.status === "sent" ? "#e0f2fe" : "#f3f4f6",
//                           color: 
//                             invoice.status === "paid" ? "#166534" : 
//                             invoice.status === "pending" ? "#854d0e" : 
//                             invoice.status === "sent" ? "#0369a1" : "#4b5563"
//                         }}>
//                           {invoice.status}
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Issue Date:</span>
//                           <span>{format(new Date(invoice.issueDate), "MMM dd, yyyy")}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Due Date:</span>
//                           <span>{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</span>
//                         </div>
//                         <div className="flex justify-between font-medium">
//                           <span>Total:</span>
//                           <span>${invoice.total?.toFixed(2) || "0.00"}</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                     <CardFooter className="flex justify-between bg-muted/20 pt-2">
//                       <Button variant="ghost" size="sm" onClick={() => handleEditInvoice(invoice)}>
//                         <Edit className="h-4 w-4 mr-1" /> Edit
//                       </Button>
//                       <Button variant="ghost" size="sm" onClick={() => {
//                         setSelectedInvoice(invoice);
//                         setPreviewMode(true);
//                         setActiveTab("create");
//                       }}>
//                         <Eye className="h-4 w-4 mr-1" /> Preview
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Download className="h-4 w-4 mr-1" /> PDF
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
//                 <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
//                 <h3 className="mt-4 text-lg font-medium">No invoices found</h3>
//                 <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
//                   {searchQuery ? "Try adjusting your search criteria." : "Start creating invoices to keep track of your payments."}
//                 </p>
//                 <Button className="mt-6" onClick={() => setActiveTab("create")}>
//                   <Plus className="mr-2 h-4 w-4" /> Create Invoice
//                 </Button>
//               </div>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default InvoiceCreate;