import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockDonations } from '@/lib/mockData';
import { 
  Search, 
  Heart, 
  MapPin, 
  Mail, 
  Clock, 
  Filter,
  Star,
  Users,
  Package,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Donations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'medicine' | 'cosmetic'>('all');

  const filteredDonations = mockDonations.filter(donation => {
    const matchesSearch = donation.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || donation.product.category === activeFilter;
    return matchesSearch && matchesFilter && donation.isAvailable;
  });

  const stats = [
    { label: 'Total Donations', value: '1,234', icon: Heart, color: 'text-primary' },
    { label: 'Active Donors', value: '567', icon: Users, color: 'text-accent' },
    { label: 'Items Saved', value: '2,891', icon: Package, color: 'text-secondary' },
    { label: 'Community Rating', value: '4.9', icon: Star, color: 'text-warning' }
  ];

  const filters = [
    { key: 'all', label: 'All Categories' },
    { key: 'food', label: 'Food & Beverages' },
    { key: 'medicine', label: 'Medicine & Health' },
    { key: 'cosmetic', label: 'Beauty & Cosmetics' }
  ] as const;

  const handleClaim = (donationId: string) => {
    console.log('Claiming donation:', donationId);
    // Handle donation claim logic
  };

  const getDaysLeft = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const getUrgencyColor = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'text-destructive';
    if (diffDays <= 3) return 'text-warning';
    if (diffDays <= 7) return 'text-primary';
    return 'text-success';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Community <span className="gradient-text">Donations</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help reduce waste by claiming products that others are donating before they expire. 
            Together, we can build a more sustainable community.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-card p-4 text-center hover:shadow-glow-primary transition-all duration-300 group"
              >
                <Icon className={cn('h-6 w-6 mx-auto mb-2', stat.color, 'group-hover:scale-110 transition-transform')} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donations or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-card border-border-glass/50 focus:border-primary/50"
              />
            </div>
            <Button variant="glass" size="lg">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? 'neon' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  'transition-all duration-300',
                  activeFilter === filter.key && 'shadow-glow-primary'
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Donations Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {filteredDonations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="glass-card p-6 hover:shadow-glow-primary transition-all duration-300 relative overflow-hidden">
                    {/* Scan Effect on Hover */}
                    <div className="scan-effect absolute inset-0 opacity-0 group-hover:opacity-100" />
                    
                    {/* Product Image */}
                    <div className="relative mb-4 aspect-video rounded-xl overflow-hidden bg-muted/20">
                      {donation.product.imageUrl ? (
                        <img
                          src={donation.product.imageUrl}
                          alt={donation.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📦
                        </div>
                      )}
                      
                      {/* Urgency Badge */}
                      <div className={cn(
                        'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border',
                        getDaysLeft(donation.product.expiryDate) === 'Expired' 
                          ? 'bg-destructive/20 text-destructive border-destructive/30'
                          : donation.product.daysUntilExpiry <= 3
                          ? 'bg-warning/20 text-warning border-warning/30'
                          : 'bg-success/20 text-success border-success/30'
                      )}>
                        <Clock className="h-3 w-3 inline mr-1" />
                        {getDaysLeft(donation.product.expiryDate)}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300 mb-1">
                          {donation.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {donation.product.category}
                        </p>
                      </div>

                      {/* Donor & Location Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Donated by {donation.donatedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{donation.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{donation.contactInfo}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="neon"
                        className="w-full group/btn"
                        onClick={() => handleClaim(donation.id)}
                      >
                        <Heart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        Claim This Item
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="glass-card p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">💝</div>
                <h3 className="text-xl font-semibold mb-2">No donations found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || activeFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Be the first to share with your community'
                  }
                </p>
                <Button variant="neon">
                  <Heart className="h-4 w-4" />
                  Share Your Items
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold mb-8">
            How <span className="gradient-text">Donations</span> Work
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Browse', description: 'Find items in your area that are about to expire' },
              { step: '2', title: 'Claim', description: 'Contact the donor and arrange pickup or delivery' },
              { step: '3', title: 'Enjoy', description: 'Use the product and help reduce community waste' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="glass-card p-6"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Donations;