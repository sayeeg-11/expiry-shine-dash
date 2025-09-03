import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Camera, 
  Edit3, 
  Package, 
  Calendar,
  Tag,
  Image as ImageIcon,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AddProduct = () => {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [productData, setProductData] = useState({
    name: '',
    category: 'food',
    expiryDate: '',
    description: ''
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product data:', productData);
    console.log('Selected file:', selectedFile);
    // Here you would typically upload the file and save the product
    navigate('/dashboard');
  };

  const categories = [
    { value: 'food', label: 'Food & Beverages', icon: '🍎', color: 'from-green-500 to-emerald-500' },
    { value: 'medicine', label: 'Medicine & Health', icon: '💊', color: 'from-red-500 to-pink-500' },
    { value: 'cosmetic', label: 'Beauty & Cosmetics', icon: '🧴', color: 'from-purple-500 to-pink-500' },
    { value: 'other', label: 'Other Products', icon: '📦', color: 'from-blue-500 to-cyan-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Add New <span className="gradient-text">Product</span>
            </h1>
            <p className="text-muted-foreground">
              Track your products and never let them expire again
            </p>
          </div>

          <div className="glass-card p-8">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 glass-card p-1">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </TabsTrigger>
                <TabsTrigger value="scan" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Scan Barcode
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                {/* Upload Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    'border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 relative overflow-hidden group',
                    dragOver 
                      ? 'border-primary bg-primary/10 shadow-glow-primary' 
                      : 'border-border-glass/50 hover:border-primary/50 hover:bg-primary/5'
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="scan-effect absolute inset-0 opacity-0 group-hover:opacity-100" />
                  
                  <input
                    type="file"
                    id="file-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  
                  {selectedFile ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4"
                    >
                      <CheckCircle className="h-16 w-16 text-success mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-success">File uploaded successfully!</p>
                        <p className="text-muted-foreground">{selectedFile.name}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto group-hover:text-primary transition-colors duration-300" />
                        <div className="absolute inset-0 h-16 w-16 bg-primary/20 blur-xl mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold mb-2">
                          Drop your product image here
                        </p>
                        <p className="text-muted-foreground mb-4">
                          or click to browse from your device
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Sparkles className="h-4 w-4" />
                          AI will automatically detect expiry dates
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="scan" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-12 text-center"
                >
                  <Camera className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Barcode Scanner</h3>
                  <p className="text-muted-foreground mb-6">
                    Point your camera at the barcode to automatically detect product information
                  </p>
                  <Button variant="neon" size="lg" className="group">
                    <Camera className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Start Scanning
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Camera access required for barcode scanning
                  </p>
                </motion.div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-semibold">
                        Product Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter product name..."
                        value={productData.name}
                        onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                        className="glass-card border-border-glass/50 focus:border-primary/50"
                        required
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Category</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                          <motion.div
                            key={category.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              'p-4 rounded-xl border cursor-pointer transition-all duration-300 group',
                              productData.category === category.value
                                ? 'border-primary bg-primary/10 shadow-glow-primary'
                                : 'border-border-glass/50 hover:border-primary/50 glass-card'
                            )}
                            onClick={() => setProductData(prev => ({ ...prev, category: category.value }))}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-gradient-to-r',
                                category.color
                              )}>
                                {category.icon}
                              </div>
                              <div>
                                <div className="font-medium">{category.label}</div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Expiry Date */}
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-base font-semibold">
                        Expiry Date
                      </Label>
                      <Input
                        id="expiry"
                        type="date"
                        value={productData.expiryDate}
                        onChange={(e) => setProductData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="glass-card border-border-glass/50 focus:border-primary/50"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base font-semibold">
                        Description (Optional)
                      </Label>
                      <textarea
                        id="description"
                        placeholder="Add any additional notes..."
                        value={productData.description}
                        onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-3 rounded-xl glass-card border border-border-glass/50 focus:border-primary/50 bg-transparent resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="glass"
                        size="lg"
                        onClick={() => navigate('/dashboard')}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="neon"
                        size="lg"
                        className="flex-1 group"
                      >
                        <Package className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Add Product
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;