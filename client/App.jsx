import React, { useEffect } from "react";
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import { DialogProvider } from "./contexts/DialogContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTopBottom from "./components/ScrollToTopBottom";
import ErrorBoundary from "./components/ui/error-boundary";
import TokenExpiredNotice from "./components/TokenExpiredNotice";
import ErrorDialog from "./components/ErrorDialog";
import Index from "./pages/Index";
import Venues from "./pages/Venues";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import VenueDetail from "./pages/VenueDetail";
import Favorites from "./pages/Favorites";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Careers from "./pages/Careers";
import WhyPlanzia from "./pages/WhyPlanzia";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AccountSettings from "./pages/AccountSettings";
import Developers from "./pages/Developers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Shell = () => {
  const location = useLocation();
  const authPaths = new Set(["/signin", "/signup", "/verify-otp", "/forgot-password"]);
  const isVenueDetailPage = location.pathname.match(/^\/venue\/[^/]+$/);
  const isAccountPage = location.pathname === "/account-settings" || location.pathname.startsWith("/admin");
  const hideFooter = authPaths.has(location.pathname) || !!isVenueDetailPage || isAccountPage || location.pathname === "/venues";

  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex="-1" className="outline-none focus:ring-2 focus:ring-ring">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Index />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venue/:id" element={<VenueDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/why-Planzia" element={<WhyPlanzia />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      {!hideFooter && <Footer />}
      <TokenExpiredNotice />
      <ScrollToTopBottom />
    </>
  );
};

const App = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DialogProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ErrorDialog />
              <BrowserRouter>
                <Shell />
              </BrowserRouter>
            </TooltipProvider>
          </DialogProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

createRoot(document.getElementById("root")).render(<App />);
