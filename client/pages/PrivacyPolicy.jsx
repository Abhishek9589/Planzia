import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Shield,
  Eye,
  Lock,
  FileText,
  Mail,
  Smartphone,
  Server,
  Users,
  Cookie,
  Share2,
  AlertCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

const SectionDivider = () => (
  <div className="my-16 border-t border-venue-lavender/50"></div>
);

export default function PrivacyPolicy() {
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
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-xl">
                Your privacy is our priority. Learn how Planzia collects, uses, and protects your information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
                >
                  <Link to="/contact">Contact Privacy Team</Link>
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
                  src="https://plus.unsplash.com/premium_photo-1681487746049-c39357159f69?w=600&h=500&fit=crop&q=80"
                  alt="Cybersecurity and digital protection"
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
              At Planzia, we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              By accessing, registering on, or using Planzia, you consent to the practices described in this policy. If you do not agree with any aspect of this Privacy Policy, please do not use our platform.
            </p>
          </motion.div>

          <SectionDivider />

          {/* 1. Information We Collect */}
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
                <Eye className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">1. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">1.1 Personal Information</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      When you create an account or complete a booking, we collect:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Full name, email address, and phone number</li>
                      <li>Home address and location data</li>
                      <li>Payment details (processed securely via third-party gateways)</li>
                      <li>Booking preferences, event type, and date information</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">1.2 Usage Data</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      We collect minimal technical information necessary to operate the platform:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Server logs for security and debugging purposes</li>
                      <li>Booking and transaction information for service fulfillment</li>
                      <li>Contact information provided during account creation and bookings</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">1.3 Third-Party Information</h3>
                    <p className="text-gray-700 leading-relaxed">
                      If you log in via Google OAuth 2.0 or other third-party services, we collect limited account information in accordance with the respective provider's terms and your authorization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. How We Use Your Information */}
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
                <h2 className="text-3xl font-bold text-venue-dark mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use your information for the following purposes:
                </p>
                <ul className="space-y-3">
                  {[
                    "To process and manage your bookings with venue partners",
                    "To send booking confirmations, reminders, and updates",
                    "To process payments and handle refunds securely",
                    "To send promotional offers, newsletters, and service updates (with your consent)",
                    "To detect, investigate, and prevent fraud or misuse",
                    "To comply with legal obligations and government requests"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-venue-indigo flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* 3. Payment Security */}
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
                <h2 className="text-3xl font-bold text-venue-dark mb-4">3. Payment Security</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    All payment transactions on Planzia are processed through <span className="font-semibold">Razorpay</span>, a PCI DSS-compliant payment gateway. Your credit card, debit card, and other payment details are encrypted and securely transmitted.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Planzia does not store your complete payment card details on our servers. Razorpay securely manages all payment processing and compliance. For more information about Razorpay's security practices, visit their privacy policy.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. Data Storage & Protection */}
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
                <Server className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">4. Data Storage & Protection</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Your personal data is stored on secure cloud infrastructure hosted by MongoDB Atlas and Amazon Web Services (AWS). We implement industry-standard encryption, firewalls, and access controls to protect your information against unauthorized access, alteration, or disclosure.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    While we maintain strict security measures, no method of online transmission is 100% secure. We encourage you to use strong passwords and keep your account credentials confidential.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* 5. Sharing Your Information */}
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
                <Share2 className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">5. Sharing Your Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">5.1 With Venue Partners</h3>
                    <p className="text-gray-700 leading-relaxed">
                      To process and fulfill your booking, we share necessary information (name, phone, email, event details) with the venue partner you selected.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">5.2 With Service Providers</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      We share limited data with trusted third-party service providers who help us operate the platform:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li><span className="font-semibold">Payment Gateway:</span> Razorpay (for payment processing)</li>
                      <li><span className="font-semibold">Email Service:</span> Nodemailer (for transactional emails)</li>
                      <li><span className="font-semibold">Cloud Storage:</span> Cloudinary (for image hosting and optimization)</li>
                      <li><span className="font-semibold">Authentication:</span> Google OAuth 2.0 (for secure user authentication)</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">5.3 Legal Requirements</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We may disclose your information if required by law, court order, government request, or to protect our legal rights and the safety of our users.
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">5.4 What We Do NOT Do</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We <span className="font-semibold">do not sell, rent, or lease</span> your personal information to third parties for marketing or commercial purposes. Your privacy is not a commodity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 6. Cookies & Tracking */}
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
                <Cookie className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">6. Cookies & Tracking Technologies</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Planzia uses minimal cookies and tracking technologies, strictly limited to enhancing your user experience and maintaining secure sessions. Cookies are small files stored on your browser that help us:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Keep you logged in securely with authentication tokens</li>
                    <li>Remember your session preferences and login state</li>
                    <li>Maintain platform functionality and user experience</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    <span className="font-semibold">We do not use third-party analytics, advertising trackers, or cookies for behavioral tracking.</span> You can control cookie settings in your browser preferences. Disabling cookies may limit certain platform features, such as remaining logged in.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* 7. Your Rights */}
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
                <h2 className="text-3xl font-bold text-venue-dark mb-4">7. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-3">
                  {[
                    "Access a copy of your personal data held by us",
                    "Request correction of inaccurate or incomplete information",
                    "Request deletion of your data (subject to legal obligations)",
                    "Withdraw consent for marketing communications at any time",
                    "Opt-out of non-essential cookies and tracking",
                    "Request information about how your data is used"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-venue-indigo flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  To exercise any of these rights, please email us at <a href="mailto:support@planzia.in" className="text-venue-indigo font-semibold hover:underline">support@planzia.in</a>.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 8. Third-Party Integrations */}
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
                <h2 className="text-3xl font-bold text-venue-dark mb-4">8. Third-Party Integrations</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Planzia integrates with several third-party services. Please review their privacy policies:
                </p>
                <ul className="space-y-3">
                  {[
                    "Google OAuth 2.0 - Sign-in authentication",
                    "Razorpay - Payment processing and security",
                    "Cloudinary - Image hosting and optimization",
                    "MongoDB Atlas - Cloud database storage",
                    "AWS - Cloud hosting infrastructure"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="h-5 w-5 rounded-full border-2 border-venue-indigo flex-shrink-0 mt-0.5"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* 9. Data Retention */}
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
                <Smartphone className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">9. Data Retention</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    We retain your personal information for as long as your account is active or as needed to provide services. After account deletion or the completion of a booking, we retain certain information for legal, tax, and compliance purposes for up to 7 years as required by law.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You can request deletion of your data at any time, subject to legal and contractual retention obligations.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 10. Policy Updates */}
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
                <h2 className="text-3xl font-bold text-venue-dark mb-4">10. Updates to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy periodically to reflect changes in our practices, technology, and legal requirements. We will notify you of significant changes via email or a prominent notice on our website. Your continued use of Planzia after changes are posted constitutes your acceptance of the updated Privacy Policy.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 11. Contact Us */}
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
                <Mail className="h-6 w-6 text-venue-indigo" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-venue-dark mb-4">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Privacy Team:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-venue-indigo flex-shrink-0" />
                    <div>
                      <span className="text-gray-600">Email: </span>
                      <a href="mailto:support@planzia.in" className="text-venue-indigo font-semibold hover:underline">
                        support@planzia.in
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-venue-indigo flex-shrink-0" />
                    <div>
                      <span className="text-gray-600">Response Time: </span>
                      <span className="text-gray-700">We aim to respond within 7 business days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* Closing Note */}
          <motion.div
            className="bg-gradient-to-r from-venue-indigo/5 to-venue-lavender/10 p-8 rounded-2xl border border-venue-lavender/50"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              We're committed to ensuring your data stays secure and your privacy is respected. Your confidence in Planzia helps us create a safer, smarter platform for everyone. Thank you for trusting us with your information.
            </p>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="mt-16 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h3 className="text-2xl font-bold text-venue-dark mb-4">Privacy Questions?</h3>
            <p className="text-gray-600 mb-6">Our team is here to help clarify anything about our privacy practices.</p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
            >
              <Link to="/contact" className="flex items-center space-x-2">
                <span>Contact Privacy Team</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
