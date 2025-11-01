import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProductStore } from '@/store/useProductStore';
import { User, Heart, AlertTriangle, Zap, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProfileSetupModal = () => {
  const { user, updateProfile, loading, showProfileSetup, setShowProfileSetup } = useProductStore();
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    healthConditions: [] as string[],
    allergies: [] as string[],
    dietaryPreferences: [] as string[]
  });

  const healthConditionOptions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Kidney Disease', 
    'Liver Disease', 'Celiac Disease', 'Lactose Intolerance', 'None'
  ];

  const allergyOptions = [
    'Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat/Gluten', 'Shellfish', 
    'Fish', 'Sesame', 'Sulfites', 'None'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Low Sodium', 
    'Low Sugar', 'Halal', 'Kosher', 'None'
  ];

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array.filter(i => i !== 'None'), item]);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        ...profile,
        isProfileComplete: true
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleSkip = () => {
    setShowProfileSetup(false);
  };

  if (!showProfileSetup || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground">
            Help us provide personalized alerts and recommendations for your health and safety
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="glass-card border-border-glass/50"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="glass-card border-border-glass/50"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="glass-card border-border-glass/50"
              />
            </div>
          </div>

          {/* Health Conditions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Health Conditions</h3>
            </div>
            <p className="text-sm text-muted-foreground">Select any conditions for personalized alerts</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {healthConditionOptions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleArrayItem(
                    profile.healthConditions, 
                    condition, 
                    (arr) => setProfile(prev => ({ ...prev, healthConditions: arr }))
                  )}
                  className={cn(
                    'p-3 text-sm rounded-lg border transition-all duration-200',
                    profile.healthConditions.includes(condition)
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'glass-card border-border-glass/50 hover:border-primary/50'
                  )}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="text-lg font-semibold">Allergies & Intolerances</h3>
            </div>
            <p className="text-sm text-muted-foreground">Help us alert you about potentially harmful ingredients</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allergyOptions.map((allergy) => (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => toggleArrayItem(
                    profile.allergies, 
                    allergy, 
                    (arr) => setProfile(prev => ({ ...prev, allergies: arr }))
                  )}
                  className={cn(
                    'p-3 text-sm rounded-lg border transition-all duration-200',
                    profile.allergies.includes(allergy)
                      ? 'bg-warning/10 border-warning text-warning'
                      : 'glass-card border-border-glass/50 hover:border-warning/50'
                  )}
                >
                  {allergy}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Dietary Preferences</h3>
            </div>
            <p className="text-sm text-muted-foreground">Your dietary lifestyle for better recommendations</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {dietaryOptions.map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => toggleArrayItem(
                    profile.dietaryPreferences, 
                    diet, 
                    (arr) => setProfile(prev => ({ ...prev, dietaryPreferences: arr }))
                  )}
                  className={cn(
                    'p-3 text-sm rounded-lg border transition-all duration-200',
                    profile.dietaryPreferences.includes(diet)
                      ? 'bg-accent/10 border-accent text-accent'
                      : 'glass-card border-border-glass/50 hover:border-accent/50'
                  )}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-8 border-t border-border-glass/50 mt-8">
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="flex-1"
          >
            Skip for Now
          </Button>
          <Button 
            variant="neon" 
            onClick={handleSave}
            disabled={loading || !profile.name}
            className="flex-1 group"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
            )}
            {loading ? 'Saving...' : 'Complete Profile'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetupModal;