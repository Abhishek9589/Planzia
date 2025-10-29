import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

import { scrollToTop } from '@/lib/navigation';
import { Button } from './ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isVenueOwner, isLoggedIn } = useAuth();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.'
    });
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Venues', path: '/venues' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const userNavLinks = [
    ...navLinks,
    { name: 'Account', path: '/account-settings' },
  ];

  const currentNavLinks = isLoggedIn ? userNavLinks : navLinks;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-white/70 backdrop-blur-lg'
      }`}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-venue-indigo text-white px-3 py-2 rounded-md">Skip to content</a>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Planzia Logo"
              className="h-16 object-contain"
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-12">
            {currentNavLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <div key={link.name} className="relative">
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      active ? 'text-venue-indigo' : 'text-gray-700 hover:text-venue-indigo'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-venue-indigo rounded-full"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Auth Buttons - Right */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-venue-indigo text-venue-indigo hover:bg-venue-lavender/30 hover:text-venue-dark transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="border-venue-indigo text-venue-indigo hover:bg-venue-lavender/30 hover:text-venue-dark transition-colors"
                  onClick={scrollToTop}
                >
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white transition-all duration-200"
                  onClick={scrollToTop}
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-venue-indigo hover:bg-venue-lavender/30"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed top-16 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-venue-lavender/30 shadow-lg"
            >
              <div className="px-4 pt-4 pb-6 space-y-4">
                {currentNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => {
                      setIsMenuOpen(false);
                      scrollToTop();
                    }}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                      isActive(link.path)
                        ? 'text-venue-indigo bg-venue-lavender/50'
                        : 'text-gray-700 hover:text-venue-indigo hover:bg-venue-lavender/30'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-venue-lavender/30 space-y-3">
                  {isLoggedIn ? (
                    <>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-venue-indigo text-venue-indigo hover:bg-venue-lavender/30 hover:text-venue-dark"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-venue-indigo text-venue-indigo hover:bg-venue-lavender/30 hover:text-venue-dark"
                        onClick={scrollToTop}
                      >
                        <Link to="/signin">Sign In</Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-venue-indigo to-venue-indigo/80 text-white"
                        onClick={scrollToTop}
                      >
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </nav>
  );
}
