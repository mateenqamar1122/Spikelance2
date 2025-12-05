// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { format } from "date-fns";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardFooter
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { toast } from "sonner";
// import {
//   ArrowLeft,
//   Download,
//   Edit,
//   Send,
//   Printer,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Loader2,
//   Copy,
//   Share2
// } from "lucide-react";

// import { getInvoiceById, Invoice, updateInvoice } from "@/services/invoiceService";
// import { handleDownloadPDF, handleSendToClient, handleCopyPaymentLink } from "@/utils/invoiceDetailActions";

// const InvoiceDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [invoice, setInvoice] = useState<Invoice | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const safeFormatDate = (
//     dateInput: string | Date | undefined | null,
//     formatStr: string
//   ): string => {
//     if (!dateInput) return "N/A";
//     const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
//     return isNaN(date.getTime()) ? "N/A" : format(date, formatStr);
//   };

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       if (!id) return;

//       setIsLoading(true);
//       try {
//         const data = await getInvoiceById(id);
//         setInvoice(data);
//       } catch (error) {
//         console.error("Failed to fetch invoice:", error);
//         toast.error("Could not load invoice details");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInvoice();
//   }, [id]);

//   const handleStatusChange = async (newStatus: string) => {
//     if (!invoice || !id) return;

//     try {
//       const updatedInvoice = await updateInvoice(id, { status: newStatus });
//       if (updatedInvoice) {
//         setInvoice(updatedInvoice);
//         toast.success(`Invoice status updated to ${newStatus}`);
//       }
//     } catch (error) {
//       console.error("Failed to update invoice status:", error);
//       toast.error("Could not update invoice status");
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "paid":
//         return "bg-green-100 text-green-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "overdue":
//         return "bg-red-100 text-red-800";
//       case "draft":
//         return "bg-gray-100 text-gray-800";
//       case "sent":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-[calc(100vh-200px)]">
//         <div className="relative">
//           <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-cyan to-brand-magenta opacity-30 blur-md animate-pulse"></div>
//           <Loader2 className="h-8 w-8 animate-spin text-brand-magenta relative z-10" />
//         </div>
//       </div>
//     );
//   }

//   if (!invoice) {
//     return (
//       <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
//         <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
//           <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
//           <h3 className="mt-4 text-lg font-medium">Invoice not found</h3>
//           <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
//             The invoice you're looking for doesn't exist or has been deleted.
//           </p>
//           <Button className="mt-6" onClick={() => navigate("/invoices")}>
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-8">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <Button variant="outline" size="icon" onClick={() => navigate("/invoices")}>
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h1>
//             <p className="text-muted-foreground">View and manage invoice details</p>
//           </div>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <Button variant="outline" className="gap-2" onClick={() => handleDownloadPDF(invoice)}>
//             <Download className="h-4 w-4" /> Download PDF
//           </Button>
//           <Button variant="outline" className="gap-2">
//             <Printer className="h-4 w-4" /> Print
//           </Button>
//           <Button variant="outline" className="gap-2">
//             <Share2 className="h-4 w-4" /> Share
//           </Button>
//           <Button className="gap-2" onClick={() => navigate(`/invoices/edit/${invoice.id}`)}>
//             <Edit className="h-4 w-4" /> Edit
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <Card className="border-border/50 shadow-md">
//             <CardHeader className="pb-2 flex flex-row items-start justify-between">
//               <div>
//                 <CardTitle>Invoice Details</CardTitle>
//                 <CardDescription>
//                   Created on {safeFormatDate(invoice.createdAt, "MMMM dd, yyyy")}
//                 </CardDescription>
//               </div>
//               <Badge className={`${getStatusColor(invoice.status)} capitalize px-3 py-1`}>
//                 {invoice.status}
//               </Badge>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-muted-foreground">From</p>
//                   <p className="font-medium">{invoice.branding?.companyName || "Your Company"}</p>
//                   <p className="text-sm">123 Business Street</p>
//                   <p className="text-sm">City, State 12345</p>
//                   <p className="text-sm">contact@yourcompany.com</p>
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-muted-foreground">Bill To</p>
//                   <p className="font-medium">{invoice.clientName || "Client Name"}</p>
//                   <p className="text-sm">{invoice.clientAddress || "Client Address"}</p>
//                   <p className="text-sm">{invoice.clientEmail || "client@example.com"}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
//                 <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
//                   <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
//                   <p className="font-medium">{invoice.invoiceNumber}</p>
//                 </div>
//                 <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
//                   <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
//                   <p className="font-medium">{safeFormatDate(invoice.issueDate, "MMMM dd, yyyy")}</p>
//                 </div>
//                 <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
//                   <p className="text-sm font-medium text-muted-foreground">Due Date</p>
//                   <p className="font-medium">{safeFormatDate(invoice.dueDate, "MMMM dd, yyyy")}</p>
//                 </div>
//               </div>

//               <Separator />

//               <div>
//                 <h3 className="font-medium mb-3">Invoice Items</h3>
//                 <div className="overflow-hidden rounded-lg border border-border/50">
//                   <table className="w-full text-sm">
//                     <thead className="bg-muted/50">
//                       <tr>
//                         <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
//                         <th className="px-4 py-3 text-right font-medium text-muted-foreground">Quantity</th>
//                         <th className="px-4 py-3 text-right font-medium text-muted-foreground">Rate</th>
//                         <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-border/50">
//                       {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
//                         invoice.items.map((item, index) => (
//                           <tr key={index} className="bg-background hover:bg-muted/20 transition-colors">
//                             <td className="px-4 py-3">{item.description}</td>
//                             <td className="px-4 py-3 text-right">{item.quantity}</td>
//                             <td className="px-4 py-3 text-right">${typeof item.rate === 'number' ? item.rate.toFixed(2) : '0.00'}</td>
//                             <td className="px-4 py-3 text-right font-medium">${typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00'}</td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr className="bg-background">
//                           <td colSpan={4} className="px-4 py-3 text-center text-muted-foreground">No items found</td>
//                         </tr>
//                       )}
//                     </tbody>
//                     <tfoot className="bg-muted/20">
//                       <tr>
//                         <td colSpan={3} className="px-4 py-3 text-right font-medium">Total</td>
//                         <td className="px-4 py-3 text-right font-bold">${invoice.total.toFixed(2)}</td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               </div>

//               {invoice.notes && (
//                 <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
//                   <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
//                   <p className="text-sm">{invoice.notes}</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         <div className="space-y-6">
//           <Card className="border-border/50 shadow-md">
//             <CardHeader>
//               <CardTitle>Payment Status</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="font-medium">Amount Due</p>
//                   <p className="font-bold">${invoice.total.toFixed(2)}</p>
//                 </div>
//                 <div className="flex justify-between items-center text-sm">
//                   <p className="text-muted-foreground">Due Date</p>
//                   <p>{safeFormatDate(invoice.dueDate, "MMM dd, yyyy")}</p>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <p className="text-sm font-medium">Update Status</p>
//                 <div className="grid grid-cols-2 gap-2">
//                   <Button
//                     variant="outline"
//                     className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
//                     onClick={() => handleStatusChange("pending")}
//                     disabled={invoice.status === "pending"}
//                   >
//                     <Clock className="mr-2 h-4 w-4" /> Mark Pending
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
//                     onClick={() => handleStatusChange("paid")}
//                     disabled={invoice.status === "paid"}
//                   >
//                     <CheckCircle className="mr-2 h-4 w-4" /> Mark Paid
//                   </Button>
//                 </div>
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <p className="text-sm font-medium">Payment Options</p>
//                 <Button className="w-full gap-2" onClick={() => handleSendToClient(invoice, invoice.clientName ? `${invoice.clientName.replace(/\s+/g, '').toLowerCase()}@example.com` : 'client@example.com')}>
//                   <Send className="h-4 w-4" /> Send to Client
//                 </Button>
//                 <Button variant="outline" className="w-full gap-2" onClick={() => handleCopyPaymentLink(invoice)}>
//                   <Copy className="h-4 w-4" /> Copy Payment Link
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-border/50 shadow-md">
//             <CardHeader>
//               <CardTitle>Activity Log</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-3">
//                 {[
//                   { action: "Invoice created", date: invoice.createdAt },
//                   { action: "Invoice sent to client", date: invoice.createdAt },
//                   { action: "Client viewed invoice", date: invoice.createdAt }
//                 ].map((activity, i) => (
//                   <div
//                     key={i}
//                     className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0 last:pb-0"
//                   >
//                     <div className="h-2 w-2 rounded-full bg-brand-magenta mt-2"></div>
//                     <div>
//                       <p className="text-sm font-medium">{activity.action}</p>
//                       <p className="font-medium">{safeFormatDate(activity.date, "MMMM dd, yyyy")}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceDetail;
