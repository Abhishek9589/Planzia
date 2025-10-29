import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useDialogState } from '@/contexts/DialogContext';

export default function ScrollToTopBottom() {
  const { isAnyDialogOpen } = useDialogState();
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;

      // Show button after scrolling a bit
      setShowButton(currentScrollY > 100);

      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleClick = () => {
    if (scrollDirection === 'down') {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Don't show when any dialog is open
  if (isAnyDialogOpen || !showButton) {
    return null;
  }

  const isScrollingDown = scrollDirection === 'down';

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleClick}
        className="fixed bottom-8 right-8 z-[100] w-12 h-12 rounded-full bg-gradient-to-r from-venue-indigo to-venue-indigo/80 text-white shadow-lg hover:shadow-xl hover:from-venue-indigo/90 hover:to-venue-indigo/70 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-venue-indigo/50 focus:ring-offset-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isScrollingDown ? "Scroll to bottom" : "Scroll to top"}
        aria-label={isScrollingDown ? "Scroll to bottom of page" : "Scroll to top of page"}
      >
        <motion.div
          key={scrollDirection}
          initial={{ rotate: isScrollingDown ? -180 : 180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: isScrollingDown ? 180 : -180, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isScrollingDown ? (
            <ArrowDown className="h-5 w-5" />
          ) : (
            <ArrowUp className="h-5 w-5" />
          )}
        </motion.div>
      </motion.button>
    </AnimatePresence>
  );
}
