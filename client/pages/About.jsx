import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { scrollToTop } from '@/lib/navigation';
import {
  Users,
  Shield,
  Award,
  Heart,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  Building,
  Search,
  Handshake,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Text Over Image */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat about-hero-image">
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content Over Image */}
        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={transition}
            >
              Reimagining Venue Discovery
            </motion.h1>
            <motion.p
              className="text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transition, delay: 0.1 }}
            >
              At Planzia, we've revolutionized how events come to life. We're India's premier platform connecting visionary event planners with exceptional venues—transparent, seamless, and built for modern celebrations.
            </motion.p>

            {/* Statistics from PDF */}
            <motion.div
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transition, delay: 0.2 }}
            >
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">500+</div>
                <div className="text-white/80 text-sm">Societies</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">25+</div>
                <div className="text-white/80 text-sm">Malls</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
                <div className="text-white/80 text-sm">IT Parks & Open Spaces</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-3xl font-bold text-venue-dark mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Built under <span className="font-semibold text-venue-indigo">Virtues Seven Events Pvt. Ltd.</span>, Planzia unites the most vibrant event spaces—from residential societies and premium malls to tech parks and sprawling open grounds—into one intelligent, user-friendly platform. Whether you're orchestrating a dream wedding, launching a brand experience, organizing community events, or creating corporate moments, Planzia empowers you to discover, book, and execute with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Our Mission */}
            <motion.div
              className="text-center lg:text-left"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            >
              <h3 className="text-3xl font-bold text-venue-dark mb-6">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To revolutionize venue booking by creating an effortless, transparent, and intelligent platform. We empower event creators and venue partners alike with smart tools, genuine trust, and exceptional experiences at every step of the journey.
              </p>
            </motion.div>

            {/* Our Vision */}
            <motion.div
              className="text-center lg:text-left"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...transition, delay: 0.05 }}
            >
              <h3 className="text-3xl font-bold text-venue-dark mb-6">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To become the most loved and trusted platform in India, where millions of remarkable events are born each year. We envision a vibrant ecosystem where every celebration is effortless, every booking is transparent, and every moment becomes unforgettable.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              What Makes Us Different
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform engineered for simplicity, trust, and exceptional results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{
              icon: Search,
              title: 'Intelligent Discovery',
              desc: 'Browse hand-curated venues filtered precisely to match your vision and requirements.'
            },{
              icon: CheckCircle,
              title: 'Effortless Booking',
              desc: 'A streamlined experience from search to confirmation with complete transparency every step.'
            },{
              icon: Handshake,
              title: 'Trusted Network',
              desc: 'Partner with verified, reliable venues backed by our commitment to quality and excellence.'
            },{
              icon: TrendingUp,
              title: 'Thriving Ecosystem',
              desc: '500+ societies, 25+ premier malls, 50+ IT parks, and countless open spaces—all expanding daily.'
            }].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: (idx % 2) * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-venue-lavender rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-venue-indigo" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-venue-dark mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Our Impact by the Numbers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A rapidly expanding network dedicated to transforming how India celebrates and connects
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{
              icon: Users, title: '500+', subtitle: 'Societies'
            },{
              icon: Building, title: '25+', subtitle: 'Malls'
            },{
              icon: MapPin, title: '50+', subtitle: 'IT Parks & Open Spaces'
            },{
              icon: Heart, title: '∞', subtitle: 'Celebrations to Life'
            }].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.subtitle}
                  className="text-center"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: (idx % 4) * 0.05 }}
                >
                  <div className="w-16 h-16 bg-venue-lavender rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-venue-indigo" />
                  </div>
                  <div className="text-3xl font-bold text-venue-dark mb-2">{stat.title}</div>
                  <div className="text-gray-600">{stat.subtitle}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing Message */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl font-bold text-venue-dark mb-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            We Create Moments, Not Just Bookings
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...transition, delay: 0.05 }}
          >
            At Planzia, every venue selection is a step toward <span className="font-semibold text-venue-indigo">crafting memories that last forever</span>.
          </motion.p>
        </div>
      </section>

    </div>
  );
}
