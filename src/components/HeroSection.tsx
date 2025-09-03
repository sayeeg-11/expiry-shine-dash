import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-3d.jpg';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const buttons = buttonsRef.current;
    const image = imageRef.current;
    const particles = particlesRef.current;

    if (!hero || !title || !subtitle || !buttons || !image || !particles) return;

    // Initial animation timeline
    const tl = gsap.timeline();

    tl.fromTo(title, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )
    .fromTo(subtitle,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(buttons,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(image,
      { opacity: 0, scale: 0.8, rotateY: 20 },
      { opacity: 1, scale: 1, rotateY: 0, duration: 1.2, ease: 'back.out(1.7)' },
      '-=0.8'
    );

    // Parallax effect for the hero image
    gsap.to(image, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Floating animation for particles
    gsap.to(particles.children, {
      y: 'random(-20, 20)',
      x: 'random(-10, 10)',
      rotation: 'random(-180, 180)',
      duration: 'random(3, 6)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: {
        amount: 2,
        from: 'random'
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Smart Protection',
      description: 'AI-powered expiry tracking'
    },
    {
      icon: Clock,
      title: 'Real-time Alerts',
      description: 'Never miss an expiration date'
    },
    {
      icon: Sparkles,
      title: 'Zero Waste',
      description: 'Donate before it expires'
    },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-glass to-background opacity-90" />
      
      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            >
              <Sparkles className="h-4 w-4" />
              Smart Expiry Management
            </motion.div>

            <h1 
              ref={titleRef}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Never Let
              <span className="gradient-text block">Food Expire</span>
              Again
            </h1>

            <p 
              ref={subtitleRef}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0"
            >
              FreshGuard uses AI to track your products, send smart alerts, and help you donate excess items to reduce waste while helping your community.
            </p>

            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="hero" 
                size="hero" 
                onClick={() => navigate('/dashboard')}
                className="group"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="glass" 
                size="hero"
                onClick={() => navigate('/donations')}
              >
                View Donations
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + features.indexOf(feature) * 0.1 }}
                    className="glass-card px-4 py-3 flex items-center gap-3 hover:shadow-glow-primary transition-all duration-300"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold text-sm">{feature.title}</div>
                      <div className="text-xs text-muted-foreground">{feature.description}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 3D Hero Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div 
              ref={imageRef}
              className="relative w-full max-w-lg aspect-square"
            >
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <div className="relative glass-card p-8 float-animation hover:shadow-glow-primary transition-all duration-500">
                <img
                  src={heroImage}
                  alt="3D Product Management Interface"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl" />
              </div>
              
              {/* Floating UI Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: 'spring' }}
                className="absolute -top-4 -right-4 glass-card p-3 text-sm font-semibold text-success"
              >
                📱 12 Items Tracked
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, type: 'spring' }}
                className="absolute -bottom-4 -left-4 glass-card p-3 text-sm font-semibold text-warning"
              >
                ⚡ 3 Expiring Soon
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;