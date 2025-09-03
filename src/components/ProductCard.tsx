import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Product } from '@/store/useProductStore';
import { categoryIcons } from '@/lib/mockData';
import { Calendar, AlertTriangle, CheckCircle, Trash2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
  onDonate?: (product: Product) => void;
  index?: number;
}

const ProductCard = ({ product, onDelete, onDonate, index = 0 }: ProductCardProps) => {
  const getStatusIcon = () => {
    switch (product.status) {
      case 'expired':
        return <AlertTriangle className="h-4 w-4" />;
      case 'soon-expiring':
        return <Calendar className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (product.status) {
      case 'expired':
        return 'status-expired';
      case 'soon-expiring':
        return 'status-warning';
      default:
        return 'status-active';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysText = (days: number) => {
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `${days} days left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <div className="glass-card p-5 hover:shadow-glow-primary transition-all duration-300 relative overflow-hidden">
        {/* Scan Effect on Hover */}
        <div className="scan-effect absolute inset-0 opacity-0 group-hover:opacity-100" />
        
        {/* Product Image */}
        <div className="relative mb-4 aspect-video rounded-xl overflow-hidden bg-muted/20">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {categoryIcons[product.category]}
            </div>
          )}
          
          {/* Status Badge */}
          <div className={cn(
            'absolute top-2 right-2 status-pill flex items-center gap-1',
            getStatusColor()
          )}>
            {getStatusIcon()}
            <span className="capitalize">{product.status.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {product.category}
            </p>
          </div>

          {/* Expiry Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Expires:</span>
              <span className="font-medium">{formatDate(product.expiryDate)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className={cn(
                'font-medium',
                product.status === 'expired' && 'text-destructive',
                product.status === 'soon-expiring' && 'text-warning',
                product.status === 'active' && 'text-success'
              )}>
                {getDaysText(product.daysUntilExpiry)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {product.status !== 'expired' && onDonate && (
              <Button
                variant="glass"
                size="sm"
                onClick={() => onDonate(product)}
                className="flex-1 group/btn"
              >
                <Heart className="h-4 w-4 group-hover/btn:text-primary transition-colors" />
                Donate
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(product.id)}
                className="px-3 hover:text-destructive group/btn"
              >
                <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              </Button>
            )}
          </div>
        </div>

        {/* Animated Progress Bar for Expiry */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/20">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
            className={cn(
              'h-full origin-left',
              product.status === 'expired' && 'bg-destructive',
              product.status === 'soon-expiring' && 'bg-warning',
              product.status === 'active' && 'bg-success'
            )}
            style={{
              width: product.status === 'expired' ? '100%' : 
                     product.status === 'soon-expiring' ? '70%' : '30%'
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;