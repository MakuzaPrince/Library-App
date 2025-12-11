import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, BarChart3, Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/20" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-accent blur-3xl" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-24 text-center text-primary-foreground">
          <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-8 animate-fade-in">
            <BookOpen className="w-10 h-10 text-accent-foreground" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            LibraryHub
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-slide-up stagger-1" style={{ animationFillMode: 'forwards', opacity: 0 }}>
            A modern library management system designed for seamless book tracking, borrowing, and administrative control.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-2" style={{ animationFillMode: 'forwards', opacity: 0 }}>
            <Button asChild size="xl" variant="accent">
              <Link to="/login">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in stagger-3" style={{ animationFillMode: 'forwards', opacity: 0 }}>
            <div>
              <p className="text-4xl font-bold">10K+</p>
              <p className="text-sm text-primary-foreground/60">Books</p>
            </div>
            <div>
              <p className="text-4xl font-bold">5K+</p>
              <p className="text-sm text-primary-foreground/60">Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold">99%</p>
              <p className="text-sm text-primary-foreground/60">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage your library efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Book Management',
                description: 'Add, edit, and organize your entire book collection with ease.',
              },
              {
                icon: Users,
                title: 'User Management',
                description: 'Manage students, librarians, and administrators with role-based access.',
              },
              {
                icon: BarChart3,
                title: 'Analytics & Reports',
                description: 'Track borrowing trends, overdue books, and generate detailed reports.',
              },
              {
                icon: Shield,
                title: 'Secure Access',
                description: 'Role-based authentication ensures data security and proper access control.',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl p-6 shadow-md border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-muted">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of libraries already using LibraryHub to streamline their operations.
          </p>
          <Button asChild size="xl" variant="accent">
            <Link to="/login">
              Start Managing Your Library
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6" />
            <span className="font-serif font-bold text-lg">LibraryHub</span>
          </div>
          <p className="text-sm text-primary-foreground/60">
            © 2024 LibraryHub. A modern library management solution.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
