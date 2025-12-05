import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Check, Star, Zap, Crown, Rocket } from "lucide-react";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for new freelancers just getting started",
      icon: <Zap className="h-6 w-6" />,
      monthlyPrice: 0,
      yearlyPrice: 0,
      badge: "Free Forever",
      badgeColor: "bg-green-500",
      features: [
        "Up to 3 clients",
        "5 projects per month",
        "Basic invoicing",
        "Time tracking",
        "Email support",
        "Basic templates",
        "Mobile app access"
      ],
      popular: false,
      cta: "Get Started Free",
      ctaVariant: "outline" as const
    },
    {
      name: "Professional",
      description: "For growing freelancers who need more power",
      icon: <Star className="h-6 w-6" />,
      monthlyPrice: 19,
      yearlyPrice: 190,
      badge: "Most Popular",
      badgeColor: "bg-blue-500",
      features: [
        "Unlimited clients",
        "Unlimited projects",
        "Advanced invoicing",
        "Time tracking & reports",
        "Client portal access",
        "Custom branding",
        "Priority support",
        "AI assistant (50 queries/month)",
        "Automated workflows",
        "Payment processing",
        "Expense tracking"
      ],
      popular: true,
      cta: "Start Free Trial",
      ctaVariant: "default" as const
    },
    {
      name: "Business",
      description: "For established freelancers and small agencies",
      icon: <Crown className="h-6 w-6" />,
      monthlyPrice: 39,
      yearlyPrice: 390,
      badge: "Best Value",
      badgeColor: "bg-purple-500",
      features: [
        "Everything in Professional",
        "Team collaboration (up to 5 members)",
        "Advanced analytics",
        "White-label options",
        "API access",
        "AI assistant (200 queries/month)",
        "Advanced automations",
        "Custom integrations",
        "Phone support",
        "Dedicated account manager",
        "Advanced security features"
      ],
      popular: false,
      cta: "Start Free Trial",
      ctaVariant: "outline" as const
    }
  ];

  const enterpriseFeatures = [
    "Custom development",
    "Dedicated infrastructure",
    "Advanced security & compliance",
    "Custom integrations",
    "Priority support",
    "Training & onboarding"
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
              <Rocket className="mr-2 h-4 w-4" />
              <span className="bg-gradient-to-r from-primary to-brand-blue bg-clip-text text-transparent font-bold">
                Simple, Transparent Pricing
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl xl:text-7xl/none">
              Choose the Perfect Plan
              <span className="relative block">
                <span className="bg-gradient-to-r from-brand-cyan via-primary to-brand-blue bg-clip-text text-transparent drop-shadow-lg font-black">
                  for Your Business
                </span>
                <span className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-gradient-to-r from-brand-cyan via-primary to-brand-blue rounded-full opacity-80 blur-sm"></span>
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
              Cancel anytime with our 30-day money-back guarantee.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 bg-muted/50 rounded-full p-2 max-w-xs mx-auto">
              <span className={`text-sm font-medium ${!isYearly ? 'text-primary' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <span className={`text-sm font-medium ${isYearly ? 'text-primary' : 'text-muted-foreground'}`}>
                Yearly
              </span>
              {isYearly && (
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                  Save 17%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="w-full py-12 md:py-20 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-xl scale-105 bg-gradient-to-br from-background to-primary/5' 
                    : 'hover:shadow-lg transition-all duration-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-brand-blue/10 text-primary">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      <span className="text-lg font-normal text-muted-foreground">
                        {plan.monthlyPrice === 0 ? '' : isYearly ? '/year' : '/month'}
                      </span>
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <div className="text-sm text-muted-foreground">
                        ${Math.round(plan.yearlyPrice / 12)}/month billed annually
                      </div>
                    )}
                    <Badge className={`${plan.badgeColor} text-white`}>
                      {plan.badge}
                    </Badge>
                  </div>

                  <CardDescription className="text-base pt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant={plan.ctaVariant}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan text-white' 
                        : ''
                    }`}
                    size="lg"
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="w-full py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-8">
                <div className="grid gap-8 md:grid-cols-2 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-8 w-8 text-yellow-500" />
                      <h3 className="text-2xl font-bold">Enterprise</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Need a custom solution for your agency or large team?
                      We'll work with you to create the perfect plan.
                    </p>
                    <ul className="space-y-2">
                      {enterpriseFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold">Custom Pricing</div>
                    <p className="text-muted-foreground">
                      Tailored to your specific needs and usage
                    </p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white">
                      <Link to="/contact">Contact Sales</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-20 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Frequently Asked Questions
            </h2>

            <div className="grid gap-6 text-left">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Yes! All paid plans come with a 14-day free trial. No credit card required.
                    You can also use our Starter plan free forever.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Absolutely! You can upgrade, downgrade, or cancel your plan at any time.
                    Changes take effect immediately, and we'll prorate any charges.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.
                    All payments are processed securely through Stripe.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a money-back guarantee?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Yes! We offer a 30-day money-back guarantee on all paid plans.
                    If you're not satisfied, we'll refund your money, no questions asked.
                  </CardDescription>
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
              Ready to Grow Your Freelance Business?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of freelancers who trust Spikelance to manage their business.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan">
                <Link to="/auth">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
