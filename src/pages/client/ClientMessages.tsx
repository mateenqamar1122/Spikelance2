import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_type: 'client' | 'freelancer';
  created_at: string;
  freelancer?: {
    name: string;
    avatar_url?: string;
  };
}

const ClientMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [freelancerName, setFreelancerName] = useState("");
  const [freelancerAvatar, setFreelancerAvatar] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a mock function since we don't have the actual messages table yet
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would fetch from the database
        // For now, we'll use mock data
        const mockMessages: Message[] = [
          {
            id: "1",
            content: "Hi there! How's the project coming along?",
            sender_type: "freelancer",
            created_at: "2023-06-01T10:00:00Z",
            freelancer: {
              name: "John Designer",
              avatar_url: ""
            }
          },
          {
            id: "2",
            content: "I've been reviewing the designs you sent over. They look great!",
            sender_type: "client",
            created_at: "2023-06-01T10:05:00Z"
          },
          {
            id: "3",
            content: "Thanks! I'm glad you like them. Do you have any feedback or changes you'd like to make?",
            sender_type: "freelancer",
            created_at: "2023-06-01T10:10:00Z",
            freelancer: {
              name: "John Designer",
              avatar_url: ""
            }
          },
          {
            id: "4",
            content: "Just a few minor tweaks to the color scheme. Could we make the blue a bit darker?",
            sender_type: "client",
            created_at: "2023-06-01T10:15:00Z"
          }
        ];
        
        setMessages(mockMessages);
        setFreelancerName("John Designer");
      } catch (error: any) {
        toast.error(`Failed to load messages: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // In a real implementation, you would send to the database
      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender_type: "client",
        created_at: new Date().toISOString()
      };

      setMessages([...messages, newMsg]);
      setNewMessage("");
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with your freelancer
        </p>
      </div>

      <Card className="flex flex-col h-[calc(100%-5rem)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={freelancerAvatar} />
                <AvatarFallback>{freelancerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{freelancerName}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_type === "client" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender_type === "client"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_type === "client"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}>
                        {formatMessageTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientMessages;