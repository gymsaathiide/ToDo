import { CheckSquare, ArrowRight, CheckCircle, Shield, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: CheckCircle,
    title: "Simple & Intuitive",
    description: "Clean interface that gets out of your way so you can focus on what matters.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your tasks are protected with enterprise-grade security and user isolation.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant sync across all your devices with real-time updates.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild data-testid="button-login-header">
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm font-medium">
              <Zap className="mr-2 h-3.5 w-3.5 text-primary" />
              Now with real-time sync
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" data-testid="text-hero-title">
              Organize your life,
              <br />
              <span className="text-primary">one task at a time</span>
            </h1>
            
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl" data-testid="text-hero-description">
              TaskFlow is the modern todo app designed for focus and productivity. 
              Simple, beautiful, and incredibly fast.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2" data-testid="button-get-started">
                <Link href="/auth">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">
                Built for productivity
              </h2>
              <p className="text-muted-foreground">
                Everything you need to stay organized and get things done.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="border bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold" data-testid={`text-feature-title-${index}`}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-feature-description-${index}`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
            <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">
              Ready to get organized?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of users who have transformed their productivity.
            </p>
            <Button size="lg" asChild className="gap-2" data-testid="button-cta-bottom">
              <Link href="/auth">
                Start Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground md:px-8">
          <p data-testid="text-footer">TaskFlow - Built with care for productivity enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
}
