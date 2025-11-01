import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/store/useProductStore';
import { X, Calendar, Package, Barcode, Sparkles, MessageSquare, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailsModal = ({ product, isOpen, onClose }: ProductDetailsModalProps) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const { toast } = useToast();

  if (!product) return null;

  const getStatusColor = () => {
    switch (product.status) {
      case 'expired': return 'text-destructive';
      case 'soon-expiring': return 'text-warning';
      default: return 'text-success';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      toast({
        title: "Feedback required",
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit feedback.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          feedbackText: feedbackText.trim(),
          brand: product.brand || 'Unknown Brand',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Feedback submitted",
          description: `Thank you for your feedback! Sentiment: ${result.sentimentAnalysis.label}`,
        });
        setFeedbackText('');
        setShowFeedbackForm(false);
      } else {
        const error = await response.json();
        toast({
          title: "Submission failed",
          description: error.error || "Failed to submit feedback.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "An error occurred while submitting feedback.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const canSubmitFeedback = product.status === 'expired' || product.daysUntilExpiry <= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                {product.brand && (
                  <p className="text-muted-foreground">{product.brand}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-destructive/20 hover:text-destructive"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Image */}
              {product.imageUrl && (
                <div className="space-y-2">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg border border-border-glass/50"
                  />
                </div>
              )}

              {/* Product Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Category</div>
                    <div className="capitalize font-medium">{product.category}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <div className={cn("font-medium capitalize", getStatusColor())}>
                      {product.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Expiry Date
                  </div>
                  <div className="font-medium">{formatDate(product.expiryDate)}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.daysUntilExpiry < 0
                      ? `Expired ${Math.abs(product.daysUntilExpiry)} days ago`
                      : `${product.daysUntilExpiry} days remaining`
                    }
                  </div>
                </div>

                {product.barcode && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Barcode className="h-4 w-4" />
                      Barcode
                    </div>
                    <div className="font-mono text-sm bg-muted/20 p-2 rounded">
                      {product.barcode}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nutritional Information */}
            {product.nutrients && (
              <div className="mt-6">
                <div className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Nutritional Information
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(product.nutrients)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => (
                      <div key={key} className="bg-background-glass/50 p-3 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground capitalize mb-1">
                          {key}
                        </div>
                        <div className="font-semibold">{value}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div className="mt-6">
                <div className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Ingredients
                </div>
                <div className="bg-background-glass/30 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{product.ingredients}</p>
                </div>
              </div>
            )}

            {/* Feedback Section */}
            {canSubmitFeedback && (
              <div className="mt-6 pt-4 border-t border-border-glass/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Share Your Experience</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  >
                    {showFeedbackForm ? 'Cancel' : 'Leave Feedback'}
                  </Button>
                </div>

                {showFeedbackForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Textarea
                      placeholder="Tell us about your experience with this product... (e.g., quality, taste, packaging, etc.)"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFeedbackForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSubmitFeedback}
                        disabled={isSubmittingFeedback || !feedbackText.trim()}
                        className="gap-2"
                      >
                        {isSubmittingFeedback ? (
                          'Submitting...'
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                <div className="text-xs text-muted-foreground mt-2">
                  Your feedback helps us identify trends and improve product quality monitoring.
                </div>
              </div>
            )}

            {/* Added Date */}
            <div className="mt-6 pt-4 border-t border-border-glass/50">
              <div className="text-sm text-muted-foreground">
                Added on {formatDate(product.addedDate)}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;
