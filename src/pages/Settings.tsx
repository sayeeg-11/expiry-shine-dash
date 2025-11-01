import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useProductStore } from '@/store/useProductStore';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun,
  Mail,
  Smartphone,
  Heart,
  Zap,
  Globe,
  Save,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { theme, toggleTheme } = useProductStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    expiring: true,
    donations: true,
    community: false
  });
  
  const { user, updateProfile, loading } = useProductStore();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    healthConditions: [] as string[],
    allergies: [] as string[],
    dietaryPreferences: [] as string[]
  });

  // Update profile state when user data changes
  React.useEffect(() => {
    console.log('Full user object:', JSON.stringify(user, null, 2));
    console.log('User profile:', user?.profile);
    console.log('User email:', user?.email);
    if (user) {
      const newProfile = {
        name: user.profile?.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        dateOfBirth: user.profile?.dateOfBirth || '',
        healthConditions: user.profile?.healthConditions || [],
        allergies: user.profile?.allergies || [],
        dietaryPreferences: user.profile?.dietaryPreferences || []
      };
      console.log('Setting profile to:', newProfile);
      setProfile(newProfile);
    }
  }, [user]);

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

  const [preferences, setPreferences] = useState({
    reminderDays: 3,
    autoShare: true,
    publicProfile: false,
    ecoMode: true
  });

  const settingSections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: User,
      description: 'Manage your personal information'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Configure alerts and reminders'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: SettingsIcon,
      description: 'Customize your experience'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your data and privacy'
    }
  ];

  const [activeSection, setActiveSection] = useState('profile');

  const handleSave = async () => {
    if (!profile.name.trim()) {
      alert('Please enter your name');
      return;
    }
    
    try {
      await updateProfile({
        name: profile.name,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        healthConditions: profile.healthConditions,
        allergies: profile.allergies,
        dietaryPreferences: profile.dietaryPreferences,
        isProfileComplete: true
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array.filter(i => i !== 'None'), item]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              App <span className="gradient-text">Settings</span>
            </h1>
            <p className="text-muted-foreground">
              Customize your FreshGuard experience
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-4 sticky top-24">
                <nav className="space-y-2">
                  {settingSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          'w-full text-left p-3 rounded-xl transition-all duration-300 group',
                          activeSection === section.id
                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow-primary'
                            : 'hover:bg-muted/20 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium text-sm">{section.title}</div>
                            <div className="text-xs opacity-70">{section.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Theme Toggle */}
                <div className="mt-6 p-3 border-t border-border-glass/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      <span className="text-sm font-medium">Theme</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTheme}
                      className="p-2"
                    >
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: theme === 'light' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {theme === 'dark' ? '🌙' : '☀️'}
                      </motion.div>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="glass-card p-8">
                {/* Profile Settings */}
                {activeSection === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <User className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Profile Settings</h2>
                      </div>
                      {user?.profile?.isProfileComplete && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm text-success font-medium">Profile Complete</span>
                        </div>
                      )}
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                            className="glass-card border-border-glass/50"
                            placeholder={user?.profile?.name ? '' : 'Enter your full name'}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            disabled
                            className="glass-card border-border-glass/50 opacity-60"
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
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <Heart className="h-4 w-4 text-primary" />
                          Health Conditions
                        </Label>
                        <p className="text-sm text-muted-foreground">Select any health conditions for personalized alerts</p>
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
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          Allergies & Intolerances
                        </Label>
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
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <Zap className="h-4 w-4 text-accent" />
                          Dietary Preferences
                        </Label>
                        <p className="text-sm text-muted-foreground">Your dietary lifestyle for better product recommendations</p>
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
                  </motion.div>
                )}

                {/* Notification Settings */}
                {activeSection === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Bell className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold">Notification Settings</h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Notification Channels</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">Email Notifications</div>
                                <div className="text-sm text-muted-foreground">Receive alerts via email</div>
                              </div>
                            </div>
                            <Switch
                              checked={notifications.email}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                            <div className="flex items-center gap-3">
                              <Smartphone className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">Push Notifications</div>
                                <div className="text-sm text-muted-foreground">Get instant alerts on your device</div>
                              </div>
                            </div>
                            <Switch
                              checked={notifications.push}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Alert Types</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                            <div className="flex items-center gap-3">
                              <AlertTriangle className="h-5 w-5 text-warning" />
                              <div>
                                <div className="font-medium">Expiring Items</div>
                                <div className="text-sm text-muted-foreground">Alert when items are about to expire</div>
                              </div>
                            </div>
                            <Switch
                              checked={notifications.expiring}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, expiring: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                            <div className="flex items-center gap-3">
                              <Heart className="h-5 w-5 text-secondary" />
                              <div>
                                <div className="font-medium">Donation Opportunities</div>
                                <div className="text-sm text-muted-foreground">Notify about items to donate or claim</div>
                              </div>
                            </div>
                            <Switch
                              checked={notifications.donations}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, donations: checked }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Preferences */}
                {activeSection === 'preferences' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <SettingsIcon className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold">Preferences</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="reminderDays">Default Reminder Days</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="reminderDays"
                            type="number"
                            min="1"
                            max="30"
                            value={preferences.reminderDays}
                            onChange={(e) => setPreferences(prev => ({ ...prev, reminderDays: parseInt(e.target.value) || 3 }))}
                            className="glass-card border-border-glass/50 w-20"
                          />
                          <span className="text-muted-foreground">days before expiry</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                          <div className="flex items-center gap-3">
                            <Heart className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Auto-Share Expiring Items</div>
                              <div className="text-sm text-muted-foreground">Automatically list items for donation when close to expiry</div>
                            </div>
                          </div>
                          <Switch
                            checked={preferences.autoShare}
                            onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoShare: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                          <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-accent" />
                            <div>
                              <div className="font-medium">Eco Mode</div>
                              <div className="text-sm text-muted-foreground">Show environmental impact and sustainability tips</div>
                            </div>
                          </div>
                          <Switch
                            checked={preferences.ecoMode}
                            onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, ecoMode: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Privacy Settings */}
                {activeSection === 'privacy' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold">Privacy & Security</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="p-6 glass-card rounded-xl border border-primary/20">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle className="h-6 w-6 text-success" />
                          <h3 className="font-semibold">Data Protection</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Your data is encrypted and stored securely. We never share your personal information without consent.
                        </p>
                        <div className="flex gap-3">
                          <Button variant="glass" size="sm">View Privacy Policy</Button>
                          <Button variant="outline" size="sm">Export Data</Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                        <div>
                          <div className="font-medium">Public Profile</div>
                          <div className="text-sm text-muted-foreground">Allow others to see your donation activity</div>
                        </div>
                        <Switch
                          checked={preferences.publicProfile}
                          onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, publicProfile: checked }))}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-8 border-t border-border-glass/50 mt-8">
                  <Button 
                    variant="neon" 
                    size="lg" 
                    onClick={handleSave} 
                    disabled={loading || !profile.name}
                    className="group"
                  >
                    {loading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    )}
                    {loading ? 'Saving...' : user?.profile?.isProfileComplete ? 'Update Profile' : 'Save Profile'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;