import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Download, Send, Eye, Edit, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Invoice } from "@/types/database";
import { invoiceService } from "@/services/invoiceService";
import InvoiceBuilder from "@/components/InvoiceBuilder";
import EmailDialog from "@/components/ui/EmailDialog";
import { format } from "date-fns";

const InvoiceGenerator = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [currentInvoiceForEmail, setCurrentInvoiceForEmail] = useState<Invoice | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      await invoiceService.deleteInvoice(id);
      toast.success('Invoice deleted successfully');
      loadInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    setCurrentInvoiceForEmail(invoice);
    setEmailDialogOpen(true);
  };

  const handleEmailSend = async (email: string, subject: string, message: string) => {
    if (!currentInvoiceForEmail) return;
    
    try {
      setEmailSending(true);
      // Use the invoice preview element if available
      const previewElement = previewRef.current;
      await invoiceService.sendInvoice(currentInvoiceForEmail.id, email, subject, message, previewElement);
      await invoiceService.updateInvoice(currentInvoiceForEmail.id, { status: 'sent' });
      toast.success('Invoice sent successfully via email with PDF attachment');
      setEmailDialogOpen(false);
      setCurrentInvoiceForEmail(null);
      loadInvoices();
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice via email');
    } finally {
      setEmailSending(false);
    }
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-generation' });
      // Use the invoice preview element if available
      const previewElement = previewRef.current;
      const filename = await invoiceService.downloadPDF(invoice.id, previewElement);
      toast.success('PDF generated and downloaded successfully', { id: 'pdf-generation' });
      console.log('Download PDF:', filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-generation' });
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusInfo = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return {
        color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        emoji: '📝',
        tooltip: 'Click to mark as sent',
        next: 'sent'
      };
      case 'sent': return {
        color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        emoji: '📤',
        tooltip: 'Click to mark as paid',
        next: 'paid'
      };
      case 'paid': return {
        color: 'bg-green-100 text-green-800 hover:bg-green-200',
        emoji: '💰',
        tooltip: 'Payment received!',
        next: 'paid'
      };
      case 'overdue': return {
        color: 'bg-red-100 text-red-800 hover:bg-red-200',
        emoji: '⚠️',
        tooltip: 'Payment overdue - click to mark as paid',
        next: 'paid'
      };
      case 'cancelled': return {
        color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        emoji: '❌',
        tooltip: 'Invoice cancelled',
        next: 'cancelled'
      };
      default: return {
        color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        emoji: '❓',
        tooltip: 'Unknown status',
        next: status
      };
    }
  };

  const handleStatusUpdate = async (invoice: Invoice) => {
    const currentStatus = getStatusInfo(invoice.status);
    if (currentStatus.next === invoice.status) return;
    
    try {
      await invoiceService.updateInvoice(invoice.id, { status: currentStatus.next });
      toast.success(`Invoice status updated to ${currentStatus.next}`);
      loadInvoices();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice Generator</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage professional invoices</p>
          </div>
          <Button onClick={() => setBuilderOpen(true)} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {invoices.length === 0 ? 'No invoices yet' : 'No invoices found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {invoices.length === 0 
                ? 'Create your first invoice to get started'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {invoices.length === 0 && (
              <Button onClick={() => setBuilderOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Invoice
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{invoice.invoice_number}</CardTitle>
                    <CardDescription>{invoice.title}</CardDescription>
                  </div>
                  <Badge 
                    className={`${getStatusInfo(invoice.status).color} cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center gap-1`}
                    onClick={() => handleStatusUpdate(invoice)}
                    title={getStatusInfo(invoice.status).tooltip}
                  >
                    <span className="animate-bounce-subtle">{getStatusInfo(invoice.status).emoji}</span>
                    <span className="capitalize">{invoice.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Client:</span>
                    <span className="font-medium">{invoice.client?.name || 'No client'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-bold text-lg">{invoice.currency} {invoice.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                    <span>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span>{format(new Date(invoice.created_at!), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(invoice)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSendInvoice(invoice)}>
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedInvoice(invoice);
                      setBuilderOpen(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteInvoice(invoice.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <InvoiceBuilder 
        open={builderOpen}
        onOpenChange={(open) => {
          setBuilderOpen(open);
          if (!open) {
            setSelectedInvoice(null);
            loadInvoices();
          }
        }}
        invoice={selectedInvoice}
        previewRef={previewRef}
      />

      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSend={handleEmailSend}
        defaultEmail={currentInvoiceForEmail?.client?.email || ""}
        invoiceNumber={currentInvoiceForEmail?.invoice_number || ""}
        loading={emailSending}
      />
    </div>
  );
};

export default InvoiceGenerator;