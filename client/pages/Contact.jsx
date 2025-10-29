import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Zap,
  Users,
  Headphones
} from 'lucide-react';
import { motion } from 'framer-motion';
import { scrollToTop } from '@/lib/navigation';

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

const contactChannels = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get a response within 24 hours',
    value: 'hello@planzia.demo',
    actionText: 'Send Email',
    link: 'mailto:hello@planzia.demo'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Available Monday-Friday, 9 AM - 6 PM IST',
    value: '+91 987-654-3210',
    actionText: 'Call Now',
    link: 'tel:+919876543210'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Quick response on WhatsApp',
    value: '+91 987-654-3210',
    actionText: 'Message',
    link: 'https://wa.me/919876543210'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    description: 'Our office in New Delhi',
    value: 'New Delhi, India',
    actionText: 'Get Directions',
    link: 'https://maps.google.com'
  }
];

export default function Contact() {
  const [result, setResult] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    scrollToTop();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResult("");

    try {
      const formData = new FormData(event.target);
      formData.append("access_key", "509ded59-87b7-4ef7-9084-a4401587ed0a");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("success");
        event.target.reset();
        setTimeout(() => setResult(""), 5000);
      } else {
        setResult("error");
      }
    } catch (err) {
      console.error("Submission error", err);
      setResult("error");
    } finally {
      setIsLoading(false);
    }
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
            {/* Left: Hero Text */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={transition}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-venue-dark leading-tight">
                  Let's Connect
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  We'd love to hear from you. Whether you have a question, feedback, or want to explore a partnership, reach out and let's create something great together.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white w-fit"
              >
                <a href="#contact-form">Send a Message</a>
              </Button>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transition, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop&q=80"
                  alt="Team collaboration and communication"
                  className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-venue-indigo/5 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Methods Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-venue-lavender/10 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl font-bold text-venue-dark mb-4">Multiple Ways to Connect</h2>
            <p className="text-lg text-gray-600">Choose the channel that works best for you</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <motion.a
                  key={index}
                  href={channel.link}
                  target={channel.link?.startsWith('http') ? '_blank' : undefined}
                  rel={channel.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg hover:-translate-y-2 transition-all duration-300 border-venue-lavender/30 bg-white">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-venue-indigo/20 to-venue-indigo/10 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Icon className="h-7 w-7 text-venue-indigo" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-venue-dark text-lg mb-1">{channel.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
                        <p className="font-semibold text-venue-indigo text-sm">{channel.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
            <Card className="shadow-lg">
              <CardContent className="p-8 sm:p-12">
                <form onSubmit={onSubmit} className="space-y-6">
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
                      className="mt-1"
                    />
                  </div>

                  {result === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
                    >
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">Message sent successfully! We'll be in touch soon.</span>
                    </motion.div>
                  )}

                  {result === "error" && (
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
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white font-semibold transition-all"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                    {!isLoading && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-venue-lavender/10 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl font-bold text-venue-dark mb-4">Why Reach Out to Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We're committed to providing exceptional support and service</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Headphones,
                title: 'Dedicated Support',
                description: 'Our team is here to assist you with any questions or concerns 24/7.'
              },
              {
                icon: Zap,
                title: 'Quick Response',
                description: 'We respond to all inquiries within 24 hours, ensuring you get help when you need it.'
              },
              {
                icon: Users,
                title: 'Expert Team',
                description: 'Our experienced team is equipped to handle partnerships, support, and special requests.'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-venue-indigo/20 to-venue-indigo/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-venue-indigo" />
                  </div>
                  <h3 className="font-semibold text-xl text-venue-dark mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-venue-indigo/5 via-venue-lavender/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Whether you're looking to list your venue, need support, or want to explore a partnership, we're excited to connect with you.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...transition, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white font-semibold group"
            >
              <a href="#contact-form" className="flex items-center">
                Start a Conversation
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...transition, delay: 0.2 }}
            className="text-gray-600 text-sm"
          >
            We typically respond within 24 hours. For urgent matters, please call us directly.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
