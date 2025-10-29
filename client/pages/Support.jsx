import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Mail,
  Phone,
  CreditCard,
  Building,
  User,
  Zap,
  MessageSquare,
  Clock,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Send
} from 'lucide-react';

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

const quickHelpTopics = [
  {
    id: 'payments',
    title: 'Payments & Bookings',
    description: 'Learn about payment timelines, booking confirmations, and refunds.',
    icon: CreditCard,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'venues',
    title: 'Venue Assistance',
    description: 'Help for venue owners managing listings and updates.',
    icon: Building,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'account',
    title: 'Account & Access',
    description: 'Resolve login, registration, or account setup issues.',
    icon: User,
    color: 'from-amber-500 to-amber-600'
  },
  {
    id: 'technical',
    title: 'Technical Support',
    description: 'Report bugs or technical issues directly.',
    icon: Zap,
    color: 'from-purple-500 to-purple-600'
  }
];

const faqItems = [
  {
    question: 'How do I cancel a booking?',
    answer: 'You can cancel your booking anytime through your dashboard. Visit your bookings, select the reservation you want to cancel, and click the cancel button. Refunds are processed according to our cancellation policy: 100% refund if cancelled 30+ days before, 50% if 7-29 days before, and non-refundable within 7 days.'
  },
  {
    question: 'What if I don\'t complete payment within 24 hours?',
    answer: 'Your booking is reserved for 24 hours from the time you place it. If payment is not completed within this period, your reservation will be automatically cancelled and the date will become available for other users. You can always rebook the same venue if it\'s still available.'
  },
  {
    question: 'When will I receive a refund?',
    answer: 'Approved refunds are processed within 7-14 working days to your original payment method. The timeline depends on your bank\'s processing speed. You\'ll receive a confirmation email as soon as the refund is initiated.'
  },
  {
    question: 'How can I edit my venue details?',
    answer: 'Venue owners can update their listings anytime through the partner dashboard. Go to "Venue Details," make your changes, and save. Updates are reflected immediately on your public profile. For bulk updates or custom requests, contact our venue support team.'
  },
  {
    question: 'Can I update my account information later?',
    answer: 'Yes! You can update your profile information, email, phone number, and other details anytime from your account settings. Simply log in, go to "Account Settings," and make your changes. Some information (like registered name) may require verification.'
  },
  {
    question: 'How long does it take for my venue to be listed?',
    answer: 'After you submit your venue details, our verification team reviews everything within 3-5 business days. We may request additional information or photos to ensure quality. Once approved, your venue goes live immediately and becomes visible to thousands of event planners.'
  }
];

const contactOptions = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat instantly with our support team',
    cta: 'Start Chat'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Write to us at support@planzia.in',
    cta: 'Send Email',
    href: 'mailto:support@planzia.in'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Available 10 AM �� 8 PM (Mon–Sat)',
    cta: 'Call Now',
    href: 'tel:+918806621666'
  }
];

const helpfulResources = [
  {
    title: 'How to Book a Venue on Planiza',
    description: 'Step-by-step guide to finding and booking your perfect venue.',
    icon: BookOpen,
    color: 'from-blue-500/10 to-blue-600/10',
    borderColor: 'border-blue-200'
  },
  {
    title: 'Refunds and Payment Processing Guide',
    description: 'Understand our payment timelines and refund policies.',
    icon: CreditCard,
    color: 'from-emerald-500/10 to-emerald-600/10',
    borderColor: 'border-emerald-200'
  },
  {
    title: 'Managing Your Venue Dashboard',
    description: 'Learn to optimize your venue listing and manage bookings.',
    icon: Building,
    color: 'from-amber-500/10 to-amber-600/10',
    borderColor: 'border-amber-200'
  },
  {
    title: 'Troubleshooting Login Issues',
    description: 'Solutions for password resets and access problems.',
    icon: User,
    color: 'from-purple-500/10 to-purple-600/10',
    borderColor: 'border-purple-200'
  }
];

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitted("loading");

    try {
      const formElement = e.target;
      const data = new FormData(formElement);
      data.append("access_key", "509ded59-87b7-4ef7-9084-a4401587ed0a");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted("success");
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setSubmitted("error");
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error("Submission error", err);
      setSubmitted("error");
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
                We're Here to Help
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-xl">
                Need assistance with your bookings, venues, or account? Our support team is here 24/7 to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={scrollToForm}
                  size="lg"
                  className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
                >
                  Contact Support
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo/10 hover:text-venue-indigo transition-colors"
                >
                  <Link to="/faq">View FAQ</Link>
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
                  src="https://plus.unsplash.com/premium_photo-1661443268502-165cf5d39a97?w=600&h=500&fit=crop&q=80"
                  alt="Customer service representative with headphones"
                  className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-venue-indigo/5 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Quick Help Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-venue-lavender/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              Top Support Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick answers to the most common questions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickHelpTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={topic.id}
                  className={`bg-gradient-to-br ${topic.color} text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer`}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ ...transition, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="mb-4 p-3 rounded-xl bg-white/20 w-fit group-hover:bg-white/30 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{topic.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find quick answers to common questions
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-venue-lavender/50 rounded-xl overflow-hidden hover:border-venue-indigo/30 transition-colors"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-venue-lavender/20 transition-colors">
                    <span className="text-left font-semibold text-venue-dark text-lg">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-2 text-gray-700 leading-relaxed border-t border-venue-lavender/30">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <p className="text-gray-600 mb-6">Didn't find your answer?</p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
            >
              <Link to="/faq" className="flex items-center space-x-2">
                <span>Explore Full FAQ</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Support Form */}
      <section id="contact-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-white" ref={formRef}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl font-bold text-venue-dark mb-4">Send Us a Message</h2>
            <p className="text-lg text-gray-600">Fill out the form below and we'll get back to you shortly</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="shadow-lg rounded-lg border border-gray-200/60 bg-card">
              <div className="p-8 sm:p-12">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="font-semibold text-gray-700">
                        Your Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="mt-1"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="font-semibold text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="font-semibold text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765-43210"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="mt-1"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="subject" className="font-semibold text-gray-700">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleFormChange}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="font-semibold text-gray-700">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={handleFormChange}
                      className="mt-1"
                    />
                  </div>

                  {submitted === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
                    >
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">Message sent successfully! We'll be in touch soon.</span>
                    </motion.div>
                  )}

                  {submitted === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                    >
                      <span className="font-medium">Something went wrong. Please try again.</span>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitted === "loading"}
                    className="w-full h-12 bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white font-semibold transition-all"
                  >
                    {submitted === "loading" ? 'Sending...' : 'Send Message'}
                    {submitted !== "loading" && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Chat & Contact Options */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              Reach Us Anytime
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your preferred way to connect with our support team
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white border-2 border-venue-lavender/50 rounded-2xl p-8 hover:border-venue-indigo/30 hover:shadow-lg transition-all duration-300 group"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-venue-indigo/10 to-venue-indigo/5 rounded-xl group-hover:from-venue-indigo/20 group-hover:to-venue-indigo/10 transition-colors">
                      <Icon className="h-8 w-8 text-venue-indigo" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-venue-dark text-center mb-3">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed whitespace-nowrap">
                    {option.description}
                  </p>
                  {option.href ? (
                    <a
                      href={option.href}
                      className="block w-full text-center bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                    >
                      {option.cta}
                    </a>
                  ) : (
                    <button
                      className="w-full text-center bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                    >
                      {option.cta}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Helpful Resources */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-venue-lavender/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              Helpful Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Guides and articles to help you get the most from Planiza
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpfulResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${resource.color} border-2 ${resource.borderColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="mb-4 p-3 rounded-xl bg-white/50 w-fit group-hover:bg-white/70 transition-colors">
                    <Icon className="h-6 w-6 text-venue-indigo" />
                  </div>
                  <h3 className="text-lg font-bold text-venue-dark mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {resource.description}
                  </p>
                  <div className="flex items-center text-venue-indigo font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <motion.section
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-venue-indigo via-venue-indigo/90 to-venue-indigo/80"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={transition}
      >

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Still Need Assistance?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
              Reach out anytime — we'll make sure your experience with Planiza stays smooth and hassle-free.
            </p>
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-white text-venue-indigo hover:bg-gray-100 hover:shadow-lg transition-all duration-200 font-semibold"
            >
              Talk to Support
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
