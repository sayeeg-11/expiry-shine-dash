import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product, useProductStore } from '@/store/useProductStore';

interface SuggestionsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SuggestionsModal({ product, isOpen, onClose }: SuggestionsModalProps) {
  const { getSuggestions, markAsDiscarded, reportSpoilage } = useProductStore();

  if (!product) return null;

  const suggestions = getSuggestions(product);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suggestions for {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {suggestions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">💡 Recommendations:</h3>
              <ul className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm">• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={() => markAsDiscarded(product.id)}
            >
              🗑️ Discard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => reportSpoilage(product.id)}
            >
              ⚠️ Report Spoiled
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}