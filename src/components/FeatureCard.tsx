import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  delay?: number;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient = 'from-primary to-accent',
  delay = 0 
}: FeatureCardProps) => {
  const cardRef = useScrollAnimation();

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      className="group relative"
    >
      <div className="glass-card p-6 h-full hover:shadow-glow-primary transition-all duration-500 relative overflow-hidden">
        {/* Animated Border */}
        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl" 
             style={{ backgroundImage: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))` }} />
        
        {/* Icon Container */}
        <div className="relative mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} p-3 group-hover:shadow-glow-primary transition-all duration-300`}>
            <Icon className="w-full h-full text-primary-foreground" />
          </div>
          <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r opacity-20 blur-lg rounded-xl"
               style={{ backgroundImage: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))` }} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {description}
        </p>

        {/* Hover Effect Lines */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </motion.div>
  );
};

export default FeatureCard;