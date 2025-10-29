import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { scrollToTop } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Zap,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  Lightbulb,
  Heart,
  Target,
  Sparkles
} from 'lucide-react';

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function WhyPlanzia() {
  const [stats, setStats] = useState({ venues: 0, users: 0, rating: 0, cities: 0 });

  useEffect(() => {
    const targets = { venues: 10000, users: 50000, rating: 4.9, cities: 100 };
    const durations = { venues: 2000, users: 2000, rating: 1500, cities: 1800 };

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      setStats({
        venues: Math.min(Math.floor((elapsed / durations.venues) * targets.venues), targets.venues),
        users: Math.min(Math.floor((elapsed / durations.users) * targets.users), targets.users),
        rating: Math.min((elapsed / durations.rating * targets.rating).toFixed(1), targets.rating),
        cities: Math.min(Math.floor((elapsed / durations.cities) * targets.cities), targets.cities)
      });

      if (elapsed >= Math.max(...Object.values(durations))) {
        setStats(targets);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-venue-lavender/10 pt-16">
      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text and Button */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={transition}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-venue-dark mb-6 leading-tight">
                Why Planiza? Because Great Events Deserve Smarter Planning.
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-xl">
                From discovery to booking, Planiza makes event planning effortless, transparent, and reliable.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
                  onClick={scrollToTop}
                >
                  <Link to="/venues">Explore Venues</Link>
                </Button>
              </motion.div>
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
                  src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=500&fit=crop&q=80"
                  alt="Modern event planning workspace with team collaboration"
                  className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-venue-indigo/5 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* What Makes Planiza Different Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              What Makes Planiza Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've built a platform that puts you first at every step of your venue journey
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                icon: Zap,
                title: "Smart Venue Discovery",
                description: "Browse verified venues tailored to your needs with intelligent filters and real-time availability"
              },
              {
                icon: Clock,
                title: "Seamless Booking Experience",
                description: "Plan, reserve, and manage everything in one place with instant confirmations"
              },
              {
                icon: Target,
                title: "Transparent Pricing",
                description: "No hidden fees, no surprises. See exactly what you're paying upfront"
              },
              {
                icon: Heart,
                title: "Customer Support That Cares",
                description: "Always here to help when you need us — 24/7 dedicated support"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  transition={{ ...transition, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-venue-lavender/50 group hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-14 h-14 bg-gradient-to-br from-venue-indigo to-venue-indigo/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-venue-dark text-center text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* The Planiza Advantage Section */}
      <section className="py-20 bg-venue-lavender/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
              className="hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop&q=80"
                alt="Elegant wedding reception venue with sophisticated decor and guests"
                className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                loading="lazy"
              />
            </motion.div>

            {/* Right: Content */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-8 leading-tight">
                The Planiza Advantage
              </h2>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We combine cutting-edge technology with thoughtful design to create a venue experience that respects your time and builds trust through transparency.
              </p>

              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Whether you're planning an intimate gathering or a grand celebration, our platform empowers you with complete control and confidence every step of the way.
              </p>

              <motion.div
                className="space-y-4 mb-8"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {[
                  "Verified venues with authentic reviews and real photos",
                  "Real-time availability and instant booking confirmations",
                  "Transparent pricing with no hidden charges or surprises",
                  "Secure payments with buyer protection and guarantees",
                  "24/7 support team ready to assist you anytime"
                ].map((highlight, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-3 items-start"
                    variants={fadeUp}
                    transition={{ ...transition, delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-venue-indigo" />
                    </div>
                    <p className="text-gray-700">{highlight}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
                  onClick={scrollToTop}
                >
                  <Link to="/venues">
                    Start Your Search
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How Planiza Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              How Planiza Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to find and secure your perfect venue
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                number: "01",
                title: "Discover Venues",
                description: "Explore our curated listings with verified details, real photos, and honest reviews from previous customers"
              },
              {
                number: "02",
                title: "Book Instantly",
                description: "Fast and secure booking process with transparent availability and instant confirmation in your inbox"
              },
              {
                number: "03",
                title: "Manage Effortlessly",
                description: "Keep track of all your bookings, payments, and venue communications in one organized dashboard"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                transition={{ ...transition, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-venue-lavender/50 group hover:-translate-y-1">
                  <CardHeader>
                    <div className="text-5xl font-bold text-venue-indigo/20 mb-4">{step.number}</div>
                    <CardTitle className="text-venue-dark text-2xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-venue-lavender/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              Our Values Shape Everything We Do
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision, feature, and interaction we create
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { icon: Lightbulb, title: "Innovation", description: "Constantly improving how people discover and book venues" },
              { icon: Shield, title: "Integrity", description: "Every action rooted in honesty, fairness, and trust" },
              { icon: Heart, title: "Customer-First", description: "Designed for your convenience and confidence" },
              { icon: Award, title: "Quality", description: "High standards for every venue and interaction" },
              { icon: TrendingUp, title: "Growth", description: "Evolving daily to serve you better" }
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  transition={{ ...transition, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300 border-venue-lavender/50 group hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-12 h-12 bg-venue-lavender rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-venue-indigo/10 transition-colors">
                        <Icon className="h-6 w-6 text-venue-indigo" />
                      </div>
                      <CardTitle className="text-venue-dark text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { label: "Venues Listed", value: stats.venues, suffix: "+" },
              { label: "Happy Users", value: stats.users, suffix: "+" },
              { label: "Average Rating", value: stats.rating, suffix: "★" },
              { label: "Cities Covered", value: stats.cities, suffix: "+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                transition={{ ...transition, delay: index * 0.1 }}
              >
                <Card className="h-full border-venue-lavender/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="text-4xl md:text-5xl font-bold text-venue-indigo mb-3">
                      {stat.value}{stat.suffix}
                    </div>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&q=80')",
          backgroundPosition: 'center'
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-venue-indigo/85 to-venue-indigo/75"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Experience Event Planning the Smart Way
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands who trust Planiza to make every event simple, elegant, and stress-free.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-gray-50 text-venue-indigo hover:text-venue-indigo shadow-xl transition-all duration-200"
                onClick={scrollToTop}
              >
                <Link to="/venues">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
