import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    token: searchParams.get("token") || ""
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        const { data, error } = await supabase
          .from('client_invitations')
          .select('email, freelancer_id')
          .eq('token', formData.token)
          .eq('status', 'pending')
          .single();

        if (error || !data) {
          toast.error("Invalid or expired invitation");
          navigate("/");
          return;
        }

        setFormData(prev => ({ ...prev, email: data.email }));
      } catch (error) {
        toast.error("Failed to validate invitation");
        navigate("/");
      }
    };

    if (formData.token) {
      validateToken();
    }
  }, [formData.token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get invitation details
      const { data: invitation } = await supabase
        .from('client_invitations')
        .select('*')
        .eq('token', formData.token)
        .single();

      if (!invitation) throw new Error("Invalid invitation");

      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            user_type: 'client',
            freelancer_id: invitation.freelancer_id
          }
        }
      });

      if (error) throw error;

      // Create client profile
      await supabase.from('client_profiles').insert({
        id: data.user?.id,
        email: formData.email,
        name: formData.name,
        freelancer_id: invitation.freelancer_id
      });

      // Update invitation status
      await supabase
        .from('client_invitations')
        .update({ status: 'accepted' })
        .eq('token', formData.token);

      toast.success("Account created successfully!");
      navigate("/client/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Accept Invitation</CardTitle>
          <CardDescription>Create your client account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;