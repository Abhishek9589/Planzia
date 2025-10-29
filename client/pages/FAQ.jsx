import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search,
  Users,
  Building,
  MessageSquare,
  Mail,
  Phone,
  FileText,
  Shield,
  ArrowRight,
  MapPin,
  CreditCard,
  RefreshCw,
  DollarSign,
  CheckCircle,
  HelpCircle,
  Code
} from 'lucide-react';
import { motion } from 'framer-motion';

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

const categories = [
  {
    id: 'general',
    title: 'General Questions',
    icon: HelpCircle,
    description: 'Learn about Planzia and how we operate',
    color: 'from-blue-500 to-blue-600',
    count: 2
  },
  {
    id: 'booking',
    title: 'Booking & Payments',
    icon: CreditCard,
    description: 'Everything about bookings, payments, and refunds',
    color: 'from-emerald-500 to-emerald-600',
    count: 4
  },
  {
    id: 'venues',
    title: 'For Venue Owners',
    icon: Building,
    description: 'Partner with us and grow your business',
    color: 'from-amber-500 to-amber-600',
    count: 4
  },
  {
    id: 'support',
    title: 'Account & Support',
    icon: MessageSquare,
    description: 'Account help and contact information',
    color: 'from-purple-500 to-purple-600',
    count: 1
  }
];

const faqData = {
  general: [
    {
      question: "What is Planzia?",
      answer: "Planzia is India's premier platform for discovering, comparing, and booking exceptional event venues. We connect you with carefully curated spaces across residential societies, premium malls, tech parks, and gorgeous open grounds—all transparent, all trustworthy. Our mission is to simplify event planning and make finding the perfect venue effortless."
    },
    {
      question: "Is there a cost to browse venues on Planzia?",
      answer: "Absolutely not. Exploring and comparing venues is completely free. You only pay when you're ready to book—and at that point, you know exactly what you're paying for with zero hidden charges. We believe in transparent pricing and honest business practices."
    }
  ],
  booking: [
    {
      question: "How do I book a venue on Planzia?",
      answer: "It's beautifully simple: search for your location and event type, explore curated results with complete details, check real-time availability, and confirm your booking directly through our platform. You'll receive instant confirmation and all necessary details via email."
    },
    {
      question: "What happens if my payment isn't completed within 24 hours?",
      answer: "We hold your selected date for 24 hours. If payment isn't completed within this timeframe, the date becomes available for other users. However, you can always re-book the same venue if it's still available. Contact our support team if you need an extension."
    },
    {
      question: "What is your refund and cancellation policy?",
      answer: "Life happens! You can modify or cancel your booking according to our Cancellation & Refund Policy. Cancellations made 30+ days before the event receive full refunds. Between 7-30 days, you receive 50% refund. Less than 7 days, refunds are at the venue's discretion. We work with transparent terms that respect both your needs and the venue's."
    },
    {
      question: "What if a venue cancels on me?",
      answer: "We've got you covered. If a venue cancels, you'll receive a full refund or the option to rebook at a comparable venue at no extra cost. Your event matters, and we stand behind it with our guarantee."
    }
  ],
  venues: [
    {
      question: "How do I get my venue listed on Planzia?",
      answer: "Simply complete our Partner Registration Form and share your venue details. Our dedicated team will verify everything to ensure quality standards, then launch your profile to thousands of eager event planners. The process typically takes 3-5 business days."
    },
    {
      question: "What advantages come with partnering with Planzia?",
      answer: "Massive visibility to qualified event planners across India, consistent quality bookings flowing to your venue, simple automated management with transparent reporting, and secure guaranteed payments with no hassles. Our partners report 40% increase in bookings on average."
    },
    {
      question: "Can I manage multiple venues under one account?",
      answer: "Yes! Venue partners can manage multiple properties under a single account. Our dashboard provides centralized management for inventory, bookings, payments, and analytics across all your venues."
    },
    {
      question: "When and how do I receive payments?",
      answer: "Payments flow directly to your registered bank account after the event concludes, on our standard payout cycle. You can track everything in real-time through your partner dashboard. Most payouts process within 2-3 business days of event completion."
    }
  ],
  support: [
    {
      question: "How can I contact customer support?",
      answer: "We're here for you 24/7. Email support@Planzia.in, visit our comprehensive Support Page, or call +91-8806621666 during business hours. We pride ourselves on thoughtful, prompt responses to all inquiries."
    }
  ]
};

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const currentFaqs = faqData[activeCategory] || [];

  const filteredFaqs = searchQuery.trim()
    ? currentFaqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentFaqs;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={transition}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-venue-dark mb-6 leading-tight">
                Got Questions? We've Got Answers.
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-xl">
                Everything you need to know about using Planzia — from booking venues to managing payments and growing your venue business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
                >
                  <Link to="/venues">Browse Venues</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo/10 hover:text-venue-indigo transition-colors"
                >
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transition, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://plus.unsplash.com/premium_photo-1674428452435-a09be83ddb38?w=600&h=500&fit=crop&q=80"
                  alt="Questions and answers knowledge base"
                  className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-venue-indigo/5 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Categories Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-venue-lavender/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find answers organized by topic for quick navigation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSearchQuery('');
                  }}
                  className={`text-left p-6 rounded-2xl transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 border-2 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-br ' + category.color + ' border-transparent text-white shadow-lg'
                      : 'bg-white border-venue-lavender/50 hover:border-venue-lavender text-venue-dark'
                  }`}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`mb-4 p-3 rounded-lg w-fit ${activeCategory === category.id ? 'bg-white/20' : 'bg-gradient-to-br ' + category.color + ' text-white'}`}>
                    <Icon className={`h-6 w-6 ${activeCategory === category.id ? 'text-white' : ''}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                  <p className={`text-sm leading-relaxed ${activeCategory === category.id ? 'text-white/90' : 'text-gray-600'}`}>
                    {category.description}
                  </p>
                  <div className={`mt-4 text-xs font-semibold ${activeCategory === category.id ? 'text-white/80' : 'text-venue-indigo'}`}>
                    {category.count} {category.count === 1 ? 'question' : 'questions'}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-3xl font-bold text-venue-dark mb-2">
              {categories.find(c => c.id === activeCategory)?.title}
            </h2>
            <p className="text-gray-600">
              {categories.find(c => c.id === activeCategory)?.description}
            </p>
          </motion.div>

          {filteredFaqs.length > 0 ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            >
              <Accordion type="single" collapsible className="w-full space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-venue-lavender/50 rounded-xl overflow-hidden hover:border-venue-indigo/30 transition-colors"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-venue-lavender/20 transition-colors">
                      <span className="text-left font-semibold text-venue-dark text-lg">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 pt-2 text-gray-700 leading-relaxed border-t border-venue-lavender/30">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            >
              <Search className="h-12 w-12 text-venue-lavender mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-venue-dark mb-2">No results found</h3>
              <p className="text-gray-600">
                Try searching for different keywords or explore other categories.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-venue-indigo to-venue-indigo/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Still Need Help?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Our dedicated support team is available 24/7 to assist you with any questions or technical issues.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <motion.a
                href="mailto:support@Planzia.in"
                className="flex items-center space-x-3 bg-white text-venue-indigo px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-200 font-semibold group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Email Support</span>
              </motion.a>
              <motion.a
                href="tel:+918806621666"
                className="flex items-center space-x-3 bg-white text-venue-indigo px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-200 font-semibold group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Call Support</span>
              </motion.a>
              <motion.div
                className="flex items-center space-x-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/contact" className="flex items-center space-x-3 w-full">
                  <span>Contact Form</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links / Helpful Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Helpful Resources
            </h2>
            <p className="text-lg text-gray-600">
              Quick links to important information
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Contact Us",
                description: "Get in touch with our team",
                icon: MessageSquare,
                link: "/contact",
                color: "from-blue-500/10 to-blue-600/10",
                borderColor: "border-blue-200"
              },
              {
                title: "Terms & Conditions",
                description: "Read our legal terms",
                icon: FileText,
                link: "/terms-and-conditions",
                color: "from-emerald-500/10 to-emerald-600/10",
                borderColor: "border-emerald-200"
              },
              {
                title: "Privacy Policy",
                description: "Learn how we protect your data",
                icon: Shield,
                link: "/privacy-policy",
                color: "from-amber-500/10 to-amber-600/10",
                borderColor: "border-amber-200"
              },
              {
                title: "Developer Docs",
                description: "Build with our API",
                icon: Code,
                link: "/developers",
                color: "from-purple-500/10 to-purple-600/10",
                borderColor: "border-purple-200"
              }
            ].map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.1 }}
                >
                  <Link
                    to={resource.link}
                    className={`block p-6 rounded-xl border-2 ${resource.borderColor} bg-gradient-to-br ${resource.color} hover:shadow-lg transition-all duration-300 group`}
                  >
                    <Icon className="h-8 w-8 text-venue-indigo mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 whitespace-nowrap">{resource.description}</p>
                    <div className="flex items-center text-venue-indigo font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-venue-lavender/30 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Ready to Book Your Perfect Venue?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse our curated collection of venues and start planning your event today.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
              >
                <Link to="/venues" className="flex items-center space-x-2">
                  <span>Explore Venues</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
