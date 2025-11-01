import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/useProductStore';
import AuthModal from '@/components/AuthModal';
import AppFeedbackModal from '@/components/AppFeedbackModal';
import {
  Home,
  LayoutDashboard,
  Plus,
  Heart,
  Settings,
  Menu,
  X,
  Shield,
  User,
  LogOut,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme, user, signOut, showAuthModal, setShowAuthModal } = useProductStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/add', label: 'Add Product', icon: Plus },
    { href: '/donations', label: 'Donations', icon: Heart },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'glass-card backdrop-blur-xl bg-card-glass/90 border-b border-border-glass/50' 
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                <div className="absolute inset-0 h-8 w-8 bg-primary/20 blur-lg group-hover:bg-accent/20 transition-all duration-300" />
              </div>
              <span className="text-xl font-bold gradient-text">FreshGuard</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={isActive(item.href) ? 'glass' : 'ghost'}
                      size="sm"
                      className={cn(
                        'relative',
                        isActive(item.href) && 'shadow-glow-primary'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {isActive(item.href) && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 border border-primary/50 rounded-lg"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle & Auth & Mobile Menu */}
            <div className="flex items-center space-x-2">
              {/* User Actions */}
              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {user.email?.split('@')[0]}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-1"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="neon"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:flex gap-1"
                >
                  <User className="h-3 w-3" />
                  Sign In
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden md:flex relative overflow-hidden group w-12 h-12 rounded-full border border-border-glass/50 backdrop-blur-sm bg-card-glass/30 hover:bg-card-glass/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                <motion.div
                  initial={{ rotate: 0, scale: 1 }}
                  animate={{
                    rotate: theme === 'light' ? 180 : 0,
                    scale: theme === 'light' ? 1.1 : 1
                  }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 15 }}
                  className="relative z-10 flex items-center justify-center"
                >
                  <motion.div
                    animate={{
                      background: theme === 'dark'
                        ? 'radial-gradient(circle, hsl(217, 91%, 60%) 0%, hsl(217, 91%, 60%) 50%, transparent 70%)'
                        : 'radial-gradient(circle, hsl(45, 93%, 58%) 0%, hsl(45, 93%, 58%) 50%, transparent 70%)'
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-full blur-sm opacity-60"
                  />
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-blue-400 drop-shadow-lg" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-500 drop-shadow-lg" />
                  )}
                </motion.div>
                <motion.div
                  animate={{
                    x: theme === 'light' ? 20 : 0,
                    opacity: theme === 'light' ? 0 : 1
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                </motion.div>
                <motion.div
                  animate={{
                    x: theme === 'dark' ? -20 : 0,
                    opacity: theme === 'dark' ? 0 : 1
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
                </motion.div>
              </Button>

              {/* Feedback Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFeedbackModal(true)}
                className="hidden md:flex relative overflow-hidden group w-12 h-12 rounded-full border border-border-glass/50 backdrop-blur-sm bg-card-glass/30 hover:bg-card-glass/50 transition-all duration-300"
                title="Feedback"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                <MessageSquare className="h-5 w-5 text-blue-400 drop-shadow-lg relative z-10" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
          >
            <div className="glass-card m-4 p-4 border border-border-glass/50">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive(item.href) ? 'glass' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                
                {/* Auth buttons in mobile menu */}
                {user ? (
                  <>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 px-3 py-2">
                      <User className="h-4 w-4" />
                      {user.email}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="justify-start"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="neon"
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="justify-start group"
                >
                  <motion.div
                    animate={{ rotate: theme === 'light' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mr-2"
                  >
                    {theme === 'dark' ? (
                      <Moon className="h-4 w-4 text-blue-400" />
                    ) : (
                      <Sun className="h-4 w-4 text-amber-500" />
                    )}
                  </motion.div>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <AppFeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </>
  );
};

export default Navbar;