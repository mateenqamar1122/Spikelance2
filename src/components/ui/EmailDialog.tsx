
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (email: string, subject: string, message: string) => void;
  defaultEmail?: string;
  invoiceNumber?: string;
  loading?: boolean;
}

const EmailDialog = ({ 
  open, 
  onOpenChange, 
  onSend, 
  defaultEmail = "", 
  invoiceNumber = "",
  loading = false 
}: EmailDialogProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState(`Invoice ${invoiceNumber} - Payment Required`);
  const [message, setMessage] = useState(
    `Dear Client,\n\nPlease find attached invoice ${invoiceNumber} for your review and payment.\n\nThank you for your business!\n\nBest regards`
  );

  const handleSend = () => {
    if (!email.trim()) return;
    onSend(email, subject, message);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Invoice via Email</DialogTitle>
          <DialogDescription>
            Send invoice {invoiceNumber} to your client via email
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!email.trim() || loading}>
            <Send className="mr-2 h-4 w-4" />
            {loading ? 'Sending...' : 'Send Invoice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;