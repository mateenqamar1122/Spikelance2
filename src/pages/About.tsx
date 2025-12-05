import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Heart,
  Users,
  Award,
  TrendingUp,
  Globe,
  Lightbulb,
  Shield,
  Clock,
  Star
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Mission-Driven",
      description: "We're on a mission to empower freelancers with the tools they need to succeed and grow their businesses."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "User-Centric",
      description: "Every feature we build starts with our users. We listen, learn, and create solutions that truly matter."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation First",
      description: "We constantly push the boundaries of what's possible to bring cutting-edge solutions to freelancers."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Trust & Security",
      description: "Your data and your clients' data are sacred to us. We maintain the highest standards of security and privacy."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Freelancers", icon: <Users className="h-6 w-6" /> },
    { number: "$50M+", label: "Invoices Processed", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "150+", label: "Countries Served", icon: <Globe className="h-6 w-6" /> },
    { number: "99.9%", label: "Uptime Guarantee", icon: <Clock className="h-6 w-6" /> }
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-founder",
      bio: "Former freelance designer with 10+ years of experience building digital products for startups and enterprises.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Marcus Chen",
      role: "CTO & Co-founder",
      bio: "Full-stack engineer passionate about creating tools that solve real problems for creative professionals.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "Product strategist with a background in UX design and a deep understanding of freelancer workflows.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "David Thompson",
      role: "Head of Engineering",
      bio: "Software architect focused on building scalable, secure, and user-friendly platforms.",
      image: "/api/placeholder/150/150"
    }
  ];

  const milestones = [
    {
      year: "2022",
      title: "The Beginning",
      description: "Founded by two freelancers who were tired of juggling multiple tools to manage their businesses."
    },
    {
      year: "2023",
      title: "First 1,000 Users",
      description: "Reached our first milestone with freelancers from 25 countries joining our platform."
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Launched AI-powered features to help freelancers automate repetitive tasks and generate content."
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Serving 50,000+ freelancers worldwide with localized payment processing and multi-language support."
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
              <Heart className="mr-2 h-4 w-4" />
              <span className="bg-gradient-to-r from-primary to-brand-blue bg-clip-text text-transparent font-bold">
                Our Story
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl xl:text-7xl/none">
              Empowering Freelancers
              <span className="relative block">
                <span className="bg-gradient-to-r from-brand-cyan via-primary to-brand-blue bg-clip-text text-transparent drop-shadow-lg font-black">
                  Around the World
                </span>
                <span className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-gradient-to-r from-brand-cyan via-primary to-brand-blue rounded-full opacity-80 blur-sm"></span>
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              We're building the future of freelance work. Our mission is to provide freelancers with
              powerful, intuitive tools that help them focus on what they do best - their craft.
            </p>

            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan">
                <Link to="/auth">Join Our Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-20 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-brand-blue/10 text-primary mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="w-full py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2">Our Values</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Drives Us Forward
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our core values shape everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 text-center">
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-brand-blue/10 text-primary mx-auto mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="w-full py-12 md:py-20 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2">Our Journey</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Building Something Special
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From a simple idea to a global platform serving thousands of freelancers worldwide.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="flex-1 px-8">
                      <Card className={`${index % 2 === 0 ? 'ml-auto mr-0' : 'ml-0 mr-auto'} max-w-md`}>
                        <CardHeader>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-primary text-primary-foreground">{milestone.year}</Badge>
                            <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{milestone.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Timeline dot */}
                    <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary border-4 border-background shadow-lg">
                      <div className="w-3 h-3 rounded-full bg-primary-foreground"></div>
                    </div>

                    <div className="flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2">Meet the Team</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              The People Behind Spikelance
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A diverse team of creators, builders, and problem-solvers united by our passion for empowering freelancers.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-brand-blue/20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="w-full py-12 md:py-20 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="px-4 py-2">Recognition</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Awards & Recognition
            </h2>

            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Best SaaS Startup 2024</h3>
                  <p className="text-muted-foreground text-sm">TechCrunch Startup Awards</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Star className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Top Freelance Tool</h3>
                  <p className="text-muted-foreground text-sm">ProductHunt #1 Product of the Day</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Fastest Growing</h3>
                  <p className="text-muted-foreground text-sm">Inc. 5000 Fastest Growing Companies</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-20 bg-gradient-to-br from-primary/10 to-brand-blue/10">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Join Our Community?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Become part of a global community of freelancers who are building successful businesses with Spikelance.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan">
                <Link to="/auth">Get Started Today</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
