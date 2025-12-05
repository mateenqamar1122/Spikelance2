import { useEffect, useState } from "react";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Save, ArrowLeft, Download, Send } from "lucide-react";
import { toast } from "sonner";
import { Invoice, InvoiceItem, Client, Project } from "@/types/database";
import { invoiceService } from "@/services/invoiceService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unit_price: z.coerce.number().min(0, "Unit price must be a positive number"),
  total_amount: z.coerce.number().optional(),
});

const invoiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  client_id: z.string().optional(),
  project_id: z.string().optional(),
  issue_date: z.string().min(1, "Issue date is required"),
  due_date: z.string().min(1, "Due date is required"),
  currency: z.string().default("USD"),
  tax_rate: z.coerce.number().min(0, "Tax rate must be a positive number").default(0),
  discount_amount: z.coerce.number().min(0, "Discount must be a positive number").default(0),
  notes: z.string().optional(),
  terms_conditions: z.string().optional(),
  payment_instructions: z.string().optional(),
  company_name: z.string().optional(),
  company_email: z.string().email().optional().or(z.literal("")),
  company_phone: z.string().optional(),
  company_address: z.string().optional(),
  template_style: z.enum(['modern', 'classic', 'minimal', 'creative']).default('modern'),
  brand_color: z.string().default('#3b82f6'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
});

type InvoiceItemForm = z.infer<typeof invoiceItemSchema>;
type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
  previewRef?: React.RefObject<HTMLDivElement>;
}

const InvoiceBuilder = ({ open, onOpenChange, invoice, previewRef }: InvoiceBuilderProps) => {
  const { user } = useAuth();
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemForm[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      title: "Invoice",
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      currency: "USD",
      tax_rate: 0,
      discount_amount: 0,
      template_style: 'modern',
      brand_color: '#3b82f6',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (open) {
      loadClients();
      loadProjects();
      
      if (invoice) {
        // Populate form with existing invoice data
        form.reset({
          title: invoice.title,
          client_id: invoice.client_id || undefined,
          project_id: invoice.project_id || undefined,
          issue_date: invoice.issue_date,
          due_date: invoice.due_date,
          currency: invoice.currency,
          tax_rate: invoice.tax_rate || 0,
          discount_amount: invoice.discount_amount || 0,
          notes: invoice.notes || "",
          terms_conditions: invoice.terms_conditions || "",
          payment_instructions: invoice.payment_instructions || "",
          company_name: invoice.company_name || "",
          company_email: invoice.company_email || "",
          company_phone: invoice.company_phone || "",
          company_address: invoice.company_address || "",
          template_style: invoice.template_style || 'modern',
          brand_color: invoice.brand_color || '#3b82f6',
          status: invoice.status || 'draft',
        });
        
        if (invoice.invoice_items) {
          setInvoiceItems(invoice.invoice_items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_amount: item.total_amount,
          })));
        }
      } else {
        // Reset for new invoice
        form.reset();
        setInvoiceItems([]);
      }
    }
  }, [open, invoice]);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setClients((data || []).map(client => ({
        ...client,
        status: client.status as 'active' | 'inactive' | 'lead'
      })));
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProjects((data || []).map(project => ({
        ...project,
        notes: project.description,
        status: project.status as 'pending' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled',
        priority: project.priority as 'low' | 'medium' | 'high'
      })));
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };
  
  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { description: "", quantity: 1, unit_price: 0, total_amount: 0 },
    ]);
  };
  
  const handleRemoveItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };
  
  const handleItemChange = (index: number, field: keyof InvoiceItemForm, value: any) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate total_amount
    if (field === 'quantity' || field === 'unit_price') {
      updatedItems[index].total_amount = updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    
    setInvoiceItems(updatedItems);
  };
  
  const calculateSubtotal = () => {
    return invoiceItems.reduce((total, item) => total + (item.total_amount || 0), 0);
  };
  
  const calculateTax = () => {
    const taxRate = form.watch("tax_rate") || 0;
    return calculateSubtotal() * (taxRate / 100);
  };
  
  const calculateTotal = () => {
    const discount = form.watch("discount_amount") || 0;
    return calculateSubtotal() + calculateTax() - discount;
  };
  
  const handleSaveInvoice = async (data: InvoiceFormValues) => {
    if (invoiceItems.length === 0) {
      toast.error("Please add at least one item to the invoice");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create invoices");
      return;
    }
    
    try {
      setLoading(true);
      
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTax();
      const totalAmount = calculateTotal();
      
      const invoiceData = {
        title: data.title,
        client_id: data.client_id || null,
        project_id: data.project_id || null,
        issue_date: data.issue_date,
        due_date: data.due_date,
        currency: data.currency,
        tax_rate: data.tax_rate,
        discount_amount: data.discount_amount,
        notes: data.notes || null,
        terms_conditions: data.terms_conditions || null,
        payment_instructions: data.payment_instructions || null,
        company_name: data.company_name || null,
        company_email: data.company_email || null,
        company_phone: data.company_phone || null,
        company_address: data.company_address || null,
        template_style: data.template_style,
        brand_color: data.brand_color,
        status: data.status,
        user_id: user.id,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        invoice_items: invoiceItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_amount: item.total_amount || 0,
          id: '',
          invoice_id: '',
          created_at: new Date().toISOString()
        })),
      };
      
      if (invoice) {
        // Update existing invoice
        await invoiceService.updateInvoice(invoice.id, invoiceData);
        toast.success("Invoice updated successfully!");
      } else {
        // Create new invoice
        await invoiceService.createInvoice(invoiceData);
        toast.success("Invoice created successfully!");
      }
      
      handleCloseBuilder();
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error("Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreviewInvoice = () => {
    if (invoiceItems.length === 0) {
      toast.error("Please add at least one item to the invoice");
      return;
    }
    
    if (!form.formState.isValid) {
      form.trigger();
      toast.error("Please fill all required fields");
      return;
    }
    
    setPreviewMode(true);
  };
  
  const handleCloseBuilder = () => {
    setPreviewMode(false);
    onOpenChange(false);
    // Reset form when dialog closes
    setTimeout(() => {
      form.reset();
      setInvoiceItems([]);
    }, 300);
  };
  
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "INR": return "₹";
      case "JPY": return "¥";
      default: return "$";
    }
  };
  
  const formatCurrency = (amount: number) => {
    const currency = form.watch("currency") || "USD";
    return `${getCurrencySymbol(currency)}${amount.toFixed(2)}`;
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto" side="right">
        <SheetHeader className="mb-6">
          <SheetTitle>{invoice ? 'Edit Invoice' : 'Create Invoice'}</SheetTitle>
          <SheetDescription>
            {invoice ? 'Update your invoice details' : 'Create a new invoice for your client'}
          </SheetDescription>
        </SheetHeader>
        
        {previewMode ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setPreviewMode(false)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Edit
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button variant="default" size="sm" onClick={form.handleSubmit(handleSaveInvoice)} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </div>
            
            {/* Enhanced Invoice Preview */}
            <div 
              ref={previewRef} 
              className="border rounded-lg p-8 space-y-8 bg-white text-black min-h-[800px]" 
              style={{ 
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.6',
                color: '#333'
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">INVOICE</h1>
                  <p className="text-lg text-gray-600">{form.watch("title")}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-semibold">Invoice #:</span> {invoice?.invoice_number || 'INV-XXXX-XXXX'}</p>
                    <p><span className="font-semibold">Issue Date:</span> {form.watch("issue_date")}</p>
                    <p><span className="font-semibold">Due Date:</span> {form.watch("due_date")}</p>
                  </div>
                </div>
              </div>
              
              {/* Company and Client Info */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 text-lg">From</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-lg">{form.watch("company_name") || "Your Company Name"}</p>
                    <p>{form.watch("company_email") || "your@email.com"}</p>
                    <p>{form.watch("company_phone") || "Your Phone"}</p>
                    <div className="whitespace-pre-line">{form.watch("company_address") || "Your Address"}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 text-lg">Bill To</h3>
                  <div className="space-y-1 text-sm">
                    {form.watch("client_id") ? (
                      <>
                        <p className="font-semibold text-lg">{clients.find(c => c.id === form.watch("client_id"))?.name}</p>
                        <p>{clients.find(c => c.id === form.watch("client_id"))?.email}</p>
                        <p>{clients.find(c => c.id === form.watch("client_id"))?.company}</p>
                        <div className="whitespace-pre-line">{clients.find(c => c.id === form.watch("client_id"))?.address}</div>
                      </>
                    ) : (
                      <p className="text-gray-500">No client selected</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Items Table */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-lg">Invoice Items</h3>
                <div className="overflow-hidden border rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Qty</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Unit Price</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoiceItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{item.description}</td>
                          <td className="px-6 py-4 text-sm text-right">{item.quantity}</td>
                          <td className="px-6 py-4 text-sm text-right">{formatCurrency(item.unit_price)}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-right">{formatCurrency(item.total_amount || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm font-semibold">{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  {form.watch("tax_rate") > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Tax ({form.watch("tax_rate")}%):</span>
                      <span className="text-sm font-semibold">{formatCurrency(calculateTax())}</span>
                    </div>
                  )}
                  {form.watch("discount_amount") > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Discount:</span>
                      <span className="text-sm font-semibold">-{formatCurrency(form.watch("discount_amount"))}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-t-2 border-gray-800">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-lg font-bold">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              {(form.watch("notes") || form.watch("terms_conditions") || form.watch("payment_instructions")) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t">
                  {form.watch("notes") && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{form.watch("notes")}</p>
                    </div>
                  )}
                  {form.watch("terms_conditions") && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Terms & Conditions</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{form.watch("terms_conditions")}</p>
                    </div>
                  )}
                  {form.watch("payment_instructions") && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Payment Instructions</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{form.watch("payment_instructions")}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="issue_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name} - {client.company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="template_style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="classic">Classic</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="company_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Invoice Items</h3>
                  <Button type="button" onClick={handleAddItem} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>
                
                {invoiceItems.length === 0 ? (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <p className="text-gray-500">No items added yet</p>
                    <Button
                      type="button"
                      onClick={handleAddItem}
                      variant="outline"
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoiceItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                        <div className="col-span-5">
                          <label className="text-sm font-medium mb-1 block">Description</label>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                            placeholder="Item description"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium mb-1 block">Quantity</label>
                          <Input
                            type="number"
                            min="1"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium mb-1 block">Unit Price</label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium mb-1 block">Total</label>
                          <div className="px-3 py-2 bg-gray-50 rounded text-sm font-medium">
                            {formatCurrency(item.total_amount || (item.quantity * item.unit_price))}
                          </div>
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {invoiceItems.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Subtotal:</span>
                          <span className="text-sm font-medium">{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        {form.watch("tax_rate") > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm">Tax ({form.watch("tax_rate")}%):</span>
                            <span className="text-sm font-medium">{formatCurrency(calculateTax())}</span>
                          </div>
                        )}
                        {form.watch("discount_amount") > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm">Discount:</span>
                            <span className="text-sm font-medium">-{formatCurrency(form.watch("discount_amount"))}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold">{formatCurrency(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tax_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discount_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Amount</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="terms_conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Terms and conditions..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="payment_instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Payment instructions..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleCloseBuilder}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handlePreviewInvoice}>
                    Preview
                  </Button>
                  <Button type="button" onClick={form.handleSubmit(handleSaveInvoice)} disabled={loading}>
                    {loading ? 'Saving...' : (invoice ? 'Update Invoice' : 'Save Invoice')}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default InvoiceBuilder;