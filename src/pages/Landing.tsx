import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import { 
  Shield, 
  Clock, 
  Heart, 
  Bell, 
  Zap, 
  Globe,
  ArrowRight,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const featuresRef = useStaggerAnimation();
  const statsRef = useStaggerAnimation();

  const features = [
    {
      icon: Shield,
      title: 'Smart Tracking',
      description: 'AI-powered expiry date monitoring with intelligent alerts and recommendations for optimal product management.',
      gradient: 'from-primary to-accent'
    },
    {
      icon: Clock,
      title: 'Real-time Notifications',
      description: 'Get instant alerts before products expire, with customizable timing and multiple notification channels.',
      gradient: 'from-accent to-secondary'
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Intelligent reminder system that learns your usage patterns and adapts to your lifestyle.',
      gradient: 'from-secondary to-primary'
    },
    {
      icon: Heart,
      title: 'Community Donations',
      description: 'Connect with local community members to donate excess items before they expire, reducing waste.',
      gradient: 'from-primary to-secondary'
    },
    {
      icon: Zap,
      title: 'Instant Scanning',
      description: 'Quick barcode and photo scanning to automatically add products with expiry date recognition.',
      gradient: 'from-accent to-primary'
    },
    {
      icon: Globe,
      title: 'Eco-Friendly Impact',
      description: 'Track your environmental impact and see how much waste you\'ve prevented through smart management.',
      gradient: 'from-secondary to-accent'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Products Tracked', icon: '📦' },
    { number: '89%', label: 'Waste Reduction', icon: '♻️' },
    { number: '1000+', label: 'Donations Made', icon: '❤️' },
    { number: '24/7', label: 'Smart Monitoring', icon: '🔔' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-glass/20 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Powerful Features for
              <span className="gradient-text block">Smart Management</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how FreshGuard's innovative features help you reduce waste, save money, and contribute to a sustainable future.
            </p>
          </motion.div>

          <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-glass opacity-40" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Making a Real <span className="gradient-text">Impact</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of users making a difference
            </p>
          </motion.div>

          <div ref={statsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center hover:shadow-glow-primary transition-all duration-300 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to <span className="gradient-text">Start Saving?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join FreshGuard today and become part of the zero-waste movement. Track, manage, and donate with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="hero"
                onClick={() => navigate('/dashboard')}
                className="group"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="glass" 
                size="hero"
                onClick={() => navigate('/donations')}
              >
                Explore Community
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm">Trusted by 50,000+ users</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-glass/50 bg-background-glass/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold gradient-text">FreshGuard</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Making the world a fresher, greener place, one product at a time.
            </p>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
              <a href="#" className="hover:text-primary transition-colors">About</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;