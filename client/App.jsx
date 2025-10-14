import React from "react";
import "./global.css";

import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
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
import AddVenue from "./pages/AddVenue";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import WhyVenueKart from "./pages/WhyVenueKart";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const pageTransition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1]
};

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

const Layout = ({ children }) => (
  <>
    <Navigation />
    <main id="main-content" tabIndex="-1" className="outline-none focus:ring-2 focus:ring-ring">
      {children}
    </main>
    <Footer />
    <TokenExpiredNotice />
  </>
);

const AuthLayout = ({ children }) => (
  <>
    <Navigation />
    <main id="main-content" tabIndex="-1" className="outline-none focus:ring-2 focus:ring-ring">
      {children}
    </main>
  </>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout><AnimatedPage><Index /></AnimatedPage></Layout>} />
        <Route path="/venues" element={<Layout><AnimatedPage><Venues /></AnimatedPage></Layout>} />
        <Route path="/venue/:id" element={<Layout><AnimatedPage><VenueDetail /></AnimatedPage></Layout>} />
        <Route path="/favorites" element={<Layout><AnimatedPage><Favorites /></AnimatedPage></Layout>} />
        <Route path="/dashboard" element={<Layout><AnimatedPage><UserDashboard /></AnimatedPage></Layout>} />
        <Route path="/about" element={<Layout><AnimatedPage><About /></AnimatedPage></Layout>} />
        <Route path="/contact" element={<Layout><AnimatedPage><Contact /></AnimatedPage></Layout>} />
        <Route path="/faq" element={<Layout><AnimatedPage><FAQ /></AnimatedPage></Layout>} />
        <Route path="/support" element={<Layout><AnimatedPage><Support /></AnimatedPage></Layout>} />
        <Route path="/blog" element={<Layout><AnimatedPage><Blog /></AnimatedPage></Layout>} />
        <Route path="/careers" element={<Layout><AnimatedPage><Careers /></AnimatedPage></Layout>} />
        <Route path="/why-venuekart" element={<Layout><AnimatedPage><WhyVenueKart /></AnimatedPage></Layout>} />
        <Route path="/terms-and-conditions" element={<Layout><AnimatedPage><TermsAndConditions /></AnimatedPage></Layout>} />
        <Route path="/privacy-policy" element={<Layout><AnimatedPage><PrivacyPolicy /></AnimatedPage></Layout>} />
        <Route path="/account-settings" element={<Layout><AnimatedPage><AccountSettings /></AnimatedPage></Layout>} />
        <Route path="/signin" element={<AuthLayout><AnimatedPage><SignIn /></AnimatedPage></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><AnimatedPage><SignUp /></AnimatedPage></AuthLayout>} />
        <Route path="/verify-otp" element={<AuthLayout><AnimatedPage><VerifyOTP /></AnimatedPage></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><AnimatedPage><ForgotPassword /></AnimatedPage></AuthLayout>} />
        {/* Admin Dashboard Route */}
        <Route path="/admin" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
        <Route path="/admin/dashboard" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
        <Route path="/admin/add-venue" element={<AnimatedPage><AddVenue /></AnimatedPage>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<Layout><AnimatedPage><NotFound /></AnimatedPage></Layout>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorDialog />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")).render(<App />);
