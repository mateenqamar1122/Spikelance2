import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Headphones,
  Users,
  Building,
  Send,
  CheckCircle
} from "lucide-react";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get help with your account or technical issues",
      contact: "support@spikelance.com",
      availability: "24/7 response within 2 hours"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available in-app",
      availability: "Mon-Fri, 9 AM - 6 PM EST"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak directly with our support specialists",
      contact: "+1 (555) 123-4567",
      availability: "Mon-Fri, 9 AM - 6 PM EST"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Premium Support",
      description: "Priority support for Business plan subscribers",
      contact: "Dedicated account manager",
      availability: "24/7 priority response"
    }
  ];

  const offices = [
    {
      city: "San Francisco, CA",
      address: "123 Market Street, Suite 400",
      phone: "+1 (555) 123-4567",
      email: "sf@spikelance.com"
    },
    {
      city: "New York, NY",
      address: "456 Broadway, Floor 12",
      phone: "+1 (555) 987-6543",
      email: "ny@spikelance.com"
    },
    {
      city: "London, UK",
      address: "789 Oxford Street, Level 5",
      phone: "+44 20 1234 5678",
      email: "london@spikelance.com"
    }
  ];

  const faqs = [
    {
      question: "How quickly can I get started?",
      answer: "You can start using Spikelance immediately after signing up. Our onboarding process takes less than 5 minutes."
    },
    {
      question: "Do you offer training or onboarding?",
      answer: "Yes! We provide free onboarding sessions for all new users, plus comprehensive documentation and video tutorials."
    },
    {
      question: "Can I migrate my existing data?",
      answer: "Absolutely. We offer free data migration assistance for users switching from other platforms."
    },
    {
      question: "What integrations do you support?",
      answer: "We integrate with 100+ tools including Stripe, PayPal, QuickBooks, Slack, and many more popular business apps."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-28 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/30%),transparent_30%),radial-gradient(circle_at_70%_60%,hsl(var(--secondary)/20%),transparent_30%)]"></div>
        <div className="absolute top-1/4 left-0 w-64 h-64 -z-10 bg-primary/20 rounded-full blur-3xl animate-float opacity-80"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 -z-10 bg-brand-blue/20 rounded-full blur-3xl animate-float-delay opacity-80"></div>

        <div className="container relative px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-primary/30 to-brand-blue/30 backdrop-blur-sm px-5 py-2 text-sm font-medium">
              <MessageCircle className="mr-2 h-4 w-4" />
              <span className="bg-gradient-to-r from-primary to-brand-blue bg-clip-text text-transparent font-bold">
                Get in Touch
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl xl:text-7xl/none">
              We're Here to Help
              <span className="relative block">
                <span className="bg-gradient-to-r from-brand-cyan via-primary to-brand-blue bg-clip-text text-transparent drop-shadow-lg font-black">
                  Your Success
                </span>
                <span className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-gradient-to-r from-brand-cyan via-primary to-brand-blue rounded-full opacity-80 blur-sm"></span>
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              Have questions about Spikelance? Need help getting started? Want to share feedback?
              We'd love to hear from you. Our team is standing by to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="w-full py-12 md:py-20 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2">Contact Options</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the contact method that works best for you. We're committed to providing excellent support.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((method, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 text-center">
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-brand-blue/10 text-primary mx-auto mb-4">
                    {method.icon}
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardDescription className="text-sm">
                    {method.description}
                  </CardDescription>
                  <p className="font-medium text-primary">{method.contact}</p>
                  <div className="flex items-center justify-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {method.availability}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="w-full py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <div className="space-y-4 mb-8">
                <h2 className="text-3xl font-bold tracking-tighter">Send Us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {!isSubmitted ? (
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input
                          id="company"
                          placeholder="Your company name"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="sales">Sales & Pricing</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help you..."
                          className="min-h-[120px]"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan"
                        size="lg"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Information & FAQ */}
            <div className="space-y-8">
              {/* Office Locations */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Our Offices</h3>
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold">{office.city}</h4>
                            <p className="text-sm text-muted-foreground">{office.address}</p>
                            <div className="flex flex-col space-y-1 mt-2">
                              <p className="text-sm">{office.phone}</p>
                              <p className="text-sm text-primary">{office.email}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick FAQ */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Common Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Contact */}
      <section className="w-full py-12 md:py-20 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-8">
                <div className="grid gap-8 md:grid-cols-2 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Building className="h-8 w-8 text-primary" />
                      <h3 className="text-2xl font-bold">Enterprise Sales</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Looking for a custom solution for your agency or team?
                      Our enterprise sales team can help you find the perfect plan.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Custom onboarding & training</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Dedicated account manager</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Priority support</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold">Let's Talk</div>
                    <p className="text-muted-foreground">
                      Schedule a demo with our sales team
                    </p>
                    <Button size="lg" className="bg-gradient-to-r from-primary to-brand-blue hover:from-brand-blue hover:to-primary text-white">
                      <Phone className="mr-2 h-4 w-4" />
                      Schedule Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
