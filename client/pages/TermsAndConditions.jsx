import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  FileText,
  Scale,
  ShieldCheck,
  CreditCard,
  Users,
  Building,
  Lock,
  AlertCircle,
  Copyright,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

const SectionDivider = () => (
  <div className="my-16 border-t border-venue-lavender/50"></div>
);

export default function TermsAndConditions() {
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
                Terms & Conditions
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-xl">
                These terms define your rights, responsibilities, and our mutual commitments while using Planzia's platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
                >
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo/10 hover:text-venue-indigo transition-colors"
                >
                  <Link to="/#faq">View FAQ</Link>
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
                  src="https://plus.unsplash.com/premium_photo-1661306439089-e627ab5d7863?w=600&h=500&fit=crop&q=80"
                  alt="Legal contract and documents"
                  className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-venue-indigo/5 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-venue-lavender/10">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Welcome to Planzia. By using our website and services, you agree to comply with the following terms and conditions. Please read them carefully before proceeding.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              These Terms and Conditions ("Terms") constitute a legally binding agreement between <span className="font-semibold">Virtues Seven Events Pvt. Ltd.</span> (hereinafter referred to as "Planzia," "Company," "we," "us," or "our"), and any person or entity accessing or using the Planzia platform.
            </p>
          </motion.div>

          <SectionDivider />

          {/* 1. Acceptance of Terms */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <FileText className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing, browsing, registering, or using the Planzia platform, you expressly agree to be bound by these Terms and Conditions. If you do not agree to these Terms, please do not use our platform. We reserve the right to update, modify, or supplement these Terms at any time. Your continued use of the platform following any changes constitutes your acceptance of the updated Terms.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2. Eligibility */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <Users className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">2. Eligibility</h2>
                <p className="text-gray-700 leading-relaxed">
                  You must be at least 18 years of age to use this platform. If you are under 18, you may only use Planzia with the consent and supervision of a parent or legal guardian. By registering, you represent and warrant that you have the legal capacity to enter into this agreement and that all information provided is accurate and truthful.
                </p>
              </div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* 3. Account Responsibilities */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <Lock className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">3. Account Responsibilities</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials and password. You agree not to share your login information with anyone else and to immediately notify us of any unauthorized access to your account.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    All activities conducted through your account are your responsibility. Planzia is not liable for any unauthorized access, fraudulent activities, or misuse of your account. You agree to keep all information in your profile accurate, complete, and up-to-date.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. Booking & Payments */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <CreditCard className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">4. Booking & Payments</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">4.1 Booking Confirmation</h3>
                    <p className="text-gray-700 leading-relaxed">
                      A booking is confirmed only upon receipt of full payment. You will receive a confirmation email with all booking details within 24 hours.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">4.2 Payment Window</h3>
                    <p className="text-gray-700 leading-relaxed">
                      You have 24 hours from the time you place a booking to complete the payment. If payment is not completed within this period, your reservation will be automatically cancelled, and the date will become available for other users.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">4.3 Payment Security</h3>
                    <p className="text-gray-700 leading-relaxed">
                      All payments are processed through authorized payment gateways. Planzia is not liable for any delays, failures, or issues caused by third-party payment processors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* 5. Venue Listings & Ownership */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <Building className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">5. Venue Listings & Ownership</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Planzia operates as a digital marketplace and acts solely as a platform intermediary. We do not own, operate, or control any venue listed on our platform. Venue partners are solely responsible for the accuracy, legality, and compliance of their venue listings.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Venue partners guarantee that they have the legal right to list and offer their venues for booking, and that all information provided is truthful and current. Planzia reserves the right to verify listings and remove any venue that violates these terms or our quality standards.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 6. Refunds & Cancellations */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <RefreshCw className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">6. Refunds & Cancellations</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">6.1 Customer Cancellations</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>Cancellation 30+ days before event: 100% refund</li>
                      <li>Cancellation 7–29 days before event: 50% refund</li>
                      <li>Cancellation less than 7 days before event: Non-refundable</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">6.2 Venue Partner Cancellations</h3>
                    <p className="text-gray-700 leading-relaxed">
                      If a venue partner cancels a confirmed booking, the customer receives a full refund plus the right to rebook at a comparable venue at no extra cost. Venue partners may face penalties including suspension or delisting.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">6.3 Refund Processing</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Approved refunds are processed within 7–14 working days to your original payment method, subject to your bank's processing times.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* 7. Intellectual Property */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <Copyright className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">7. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed">
                  All content, designs, logos, photographs, software, and materials on the Planzia platform are the exclusive intellectual property of Planzia or our content providers. You may not reproduce, distribute, transmit, or modify any content without our explicit written permission. Unauthorized use is prohibited and may result in legal action.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 8. Limitation of Liability */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <AlertCircle className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">8. Limitation of Liability</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Planzia is a platform facilitator and is not liable for:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>The condition, quality, accuracy, or safety of any venue listing</li>
                    <li>Disputes between customers and venue partners</li>
                    <li>Cancellations by venue partners</li>
                    <li>Force majeure events (natural calamities, pandemics, government restrictions, strikes)</li>
                    <li>Indirect, incidental, or consequential damages</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Our maximum liability shall be limited to the booking amount paid by the customer to Planzia.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* 9. Privacy & Data Protection */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <ShieldCheck className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">9. Privacy & Data Protection</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your personal data is handled according to our Privacy Policy. By using Planzia, you consent to the collection, processing, and use of your information as described in our Privacy Policy. We are committed to protecting your data and complying with applicable data protection laws.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 10. Changes to Terms */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <RefreshCw className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">10. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  Planzia may update or modify these Terms at any time. Changes will be effective immediately upon posting to our website. We will make reasonable efforts to notify you of significant changes. Your continued use of the platform following any updates constitutes your acceptance of the new Terms.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 11. Governing Law */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 mt-1">
                <Scale className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">11. Governing Law & Jurisdiction</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms and Conditions are governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts in Pune, Maharashtra, India.
                </p>
              </div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* Final Note */}
          <motion.div
            className="bg-gradient-to-r from-venue-indigo/5 to-venue-lavender/10 p-8 rounded-2xl border border-venue-lavender/50"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              Your trust matters to us. We encourage you to review these terms regularly to stay informed of updates and changes. If you have any questions about our Terms & Conditions, please don't hesitate to <Link to="/contact" className="text-venue-indigo font-semibold hover:underline">contact us</Link>.
            </p>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            className="mt-16 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h3 className="text-2xl font-bold text-venue-dark mb-4">Questions About Our Terms?</h3>
            <p className="text-gray-600 mb-6">Get in touch with our support team anytime.</p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
            >
              <Link to="/contact" className="flex items-center space-x-2">
                <span>Contact Support</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
