import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Camera, BookOpen, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Leaf,
      title: 'Smart Ingredient Tracking',
      description: 'Add ingredients manually or upload photos for automatic detection.',
    },
    {
      icon: BookOpen,
      title: 'AI-Powered Recipes',
      description: 'Get personalized recipe suggestions based on what you have.',
    },
    {
      icon: Shield,
      title: 'Safety & Storage Tips',
      description: 'Learn best practices to keep your food fresh and safe.',
    },
    {
      icon: Camera,
      title: 'Photo Recognition',
      description: 'Simply snap a photo and let AI identify your ingredients.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8 md:p-12">
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Leaf className="w-4 h-4" />
              Reduce Food Waste
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Turn Your Ingredients Into{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Delicious Meals
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stop wasting food and start creating amazing recipes with what you already have. 
              Our AI-powered platform helps you make the most of every ingredient.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/ingredients">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/recipes">
                <Button size="lg" variant="outline" className="gap-2">
                  View Recipes
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl">
            <img
              src="/ahmet-koc-ewXGkFeh2FI-unsplash.jpg"
              alt="Top-down view of fresh produce, bread, and pantry items on a kitchen counter"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">
            Simple steps to reduce waste and discover new recipes
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent p-8 md:p-12 text-center">
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready to Start Cooking?
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of users who are reducing food waste and discovering amazing recipes every day.
          </p>
          <Link to="/ingredients">
            <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
              Add Your Ingredients
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
