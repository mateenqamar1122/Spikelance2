import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FolderOpen,
  FileText,
  DollarSign,
  Clock,
  BarChart3,
  Zap,
  Shield,
  Cloud,
  Smartphone,
  Bot,
  Calendar
} from "lucide-react";

const Features = () => {
  const coreFeatures = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Client Management",
      description: "Keep track of all your clients with detailed profiles, contact information, and project history.",
      color: "text-blue-500"
    },
    {
      icon: <FolderOpen className="h-8 w-8" />,
      title: "Project Organization",
      description: "Organize your work with project templates, milestones, and progress tracking.",
      color: "text-green-500"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Smart Invoicing",
      description: "Create professional invoices with automated reminders and payment tracking.",
      color: "text-purple-500"
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Payment Processing",
      description: "Accept payments online with integrated payment gateways and automated receipts.",
      color: "text-emerald-500"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Time Tracking",
      description: "Track time spent on projects with detailed reporting and billable hours calculation.",
      color: "text-orange-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics & Reports",
      description: "Get insights into your business with detailed analytics and customizable reports.",
      color: "text-red-500"
    }
  ];

  const advancedFeatures = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Assistant",
      description: "AI-powered content generation, proposal writing, and business insights."
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Appointment Scheduling",
      description: "Built-in calendar system for client meetings and project deadlines."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure File Sharing",
      description: "Share files securely with clients using encrypted links and access controls."
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud Storage",
      description: "Store and access your files from anywhere with unlimited cloud storage."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Responsive",
      description: "Access your business on the go with our fully responsive mobile interface."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automation Tools",
      description: "Automate repetitive tasks like follow-ups, reminders, and status updates."
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
              <Zap className="mr-2 h-4 w-4" />
              <span className="bg-gradient-to-r from-primary to-brand-blue bg-clip-text text-transparent font-bold">
                Powerful Features
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl xl:text-7xl/none">
              Everything You Need to
              <span className="relative block">
                <span className="bg-gradient-to-r from-brand-cyan via-primary to-brand-blue bg-clip-text text-transparent drop-shadow-lg font-black">
                  Grow Your Business
                </span>
                <span className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-gradient-to-r from-brand-cyan via-primary to-brand-blue rounded-full opacity-80 blur-sm"></span>
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              From client management to invoicing, time tracking to analytics - Spikelance provides all the tools
              you need to run a successful freelance business.
            </p>

            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan">
                <Link to="/auth">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="w-full py-12 md:py-20 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2">Core Features</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Essential Tools for Freelancers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The fundamental features that every freelancer needs to manage their business effectively.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-background to-muted mb-4 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="w-full py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2 bg-gradient-to-r from-brand-cyan/20 to-brand-blue/20">
              Advanced Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Go Beyond the Basics
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Advanced tools and automation to help you scale your freelance business to the next level.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {advancedFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-brand-blue/10 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-20 bg-gradient-to-br from-primary/10 to-brand-blue/10">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Transform Your Freelance Business?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of freelancers who are already using Spikelance to grow their business.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan">
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
