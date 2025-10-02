import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, MessageSquare, Quote, Bot, User, Menu, X, Moon, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Quran', icon: Book, href: '/quran' },
    { name: 'Hadith', icon: MessageSquare, href: '/hadith' },
    { name: 'About Dev', icon: User, href: '/about' }, // Added "About Dev" link
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 rounded-lg bg-gradient-islamic">
                <Moon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-arabic">HidayahAI</h1>
                <p className="text-xs text-muted-foreground">Your Islamic Companion</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} to={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-primary'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="space-y-2 pt-4 border-t border-border/20">
                {navItems.map((item) => (
                  <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ x: 10 }}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                        location.pathname === item.href
                          ? 'text-primary bg-secondary/50'
                          : 'text-foreground/80 hover:text-primary hover:bg-secondary/50'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;