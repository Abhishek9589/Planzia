import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sparkles,
  CheckCircle,
  Shield,
  Users,
  Zap,
  Heart,
  Target,
  Lightbulb,
  Award,
  TrendingUp,
  ArrowRight,
  Globe,
  MapPin
} from 'lucide-react';
import { scrollToTop } from '@/lib/navigation';

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

const coreValues = [
  {
    title: 'Transparency',
    description: 'Clear communication, honest pricing, and no hidden surprises',
    icon: Globe
  },
  {
    title: 'Innovation',
    description: 'Continuously evolving to provide better solutions and experiences',
    icon: Lightbulb
  },
  {
    title: 'Integrity',
    description: 'Built on trust, reliability, and ethical business practices',
    icon: Award
  },
  {
    title: 'Excellence',
    description: 'Pursuing the highest standards in every aspect of our service',
    icon: Sparkles
  },
  {
    title: 'Community',
    description: 'Creating meaningful connections between venues and event creators',
    icon: Users
  }
];

const services = [
  {
    title: 'Smart Venue Matching',
    description: 'Our intelligent algorithm connects you with venues that perfectly match your event needs, budget, and vision.',
    icon: Target
  },
  {
    title: 'Transparent Pricing',
    description: 'No hidden fees, no surprises. See exactly what you\'re paying for with our clear and honest pricing breakdown.',
    icon: CheckCircle
  },
  {
    title: 'Verified Venues',
    description: 'Every venue is thoroughly verified and authenticated to ensure you get quality and peace of mind.',
    icon: Shield
  },
  {
    title: 'Always Available Support',
    description: 'Our dedicated team is available 24/7 to answer questions and ensure your event runs flawlessly.',
    icon: Zap
  }
];

const stats = [
  { number: '500+', label: 'Verified Venues', icon: MapPin },
  { number: '10K+', label: 'Successful Events', icon: TrendingUp },
  { number: '50K+', label: 'Happy Customers', icon: Heart },
  { number: '4.9★', label: 'Average Rating', icon: Award }
];

export default function About() {
  React.useEffect(() => {
    scrollToTop();
  }, []);

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
                  Reimagining Event Venues
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  We believe every event deserves a perfect venue. Our mission is to make venue discovery simple, transparent, and inspiring.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white w-fit"
              >
                <Link to="/venues">Explore Venues</Link>
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
                  src="https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=600&h=500&fit=crop&q=80"
                  alt="Modern event venue with sophisticated design"
                  className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-venue-indigo/5 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Who We Are Section */}
      <section className="py-20 bg-gradient-to-b from-white to-venue-lavender/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop&q=80"
                  alt="Our team collaborating on event planning"
                  className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-venue-indigo/10 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-venue-dark">
                  Who We Are
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We are a passionate team dedicated to transforming how people discover and book venues. Founded on the belief that every celebration deserves to be effortless, we've built a platform that combines cutting-edge technology with genuine care for our users.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  From intimate gatherings to grand celebrations, from corporate conferences to creative workshops — we understand that every event is unique. That's why we've created a platform that puts you in control, offering transparency, choice, and unwavering support at every step.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-venue-indigo/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-venue-indigo" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-venue-dark">Venue Verified</h3>
                    <p className="text-sm text-gray-600">Every venue is personally checked</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-venue-indigo/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="h-4 w-4 text-venue-indigo" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-venue-dark">Customer First</h3>
                    <p className="text-sm text-gray-600">Your satisfaction is our priority</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              Mission & Vision
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Guided by purpose, driven by impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            >
              <Card className="h-full border-2 border-venue-indigo/10 hover:border-venue-indigo/30 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-venue-indigo to-venue-indigo/80 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-venue-dark">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    To democratize venue discovery and make event planning accessible, transparent, and delightful for everyone.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We empower event creators with verified venues, honest pricing, and dedicated support to bring their visions to life.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...transition, delay: 0.1 }}
            >
              <Card className="h-full border-2 border-venue-indigo/10 hover:border-venue-indigo/30 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-venue-indigo to-venue-indigo/80 rounded-lg flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-venue-dark">Our Vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    To become the world's most trusted platform where remarkable venues and inspired event creators connect seamlessly.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We envision a future where every celebration is perfectly matched with the ideal venue, creating unforgettable moments.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do / Services Section */}
      <section className="py-20 bg-gradient-to-b from-venue-lavender/20 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              What We Do
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive services designed to make event planning effortless
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.08 }}
                >
                  <Card className="h-full hover:shadow-lg hover:-translate-y-2 transition-all duration-300 border-venue-lavender/50">
                    <CardHeader>
                      <div className="w-14 h-14 bg-gradient-to-br from-venue-indigo/20 to-venue-indigo/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-7 w-7 text-venue-indigo" />
                      </div>
                      <CardTitle className="text-xl text-venue-dark">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed text-sm">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.08 }}
                  className="text-center space-y-4 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-venue-indigo/20 to-venue-indigo/10 rounded-full flex items-center justify-center mx-auto group-hover:from-venue-indigo/30 group-hover:to-venue-indigo/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-8 w-8 text-venue-indigo" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-venue-dark mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* By the Numbers Section */}
      <section className="py-20 bg-gradient-to-b from-venue-lavender/20 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Growing together with our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.08 }}
                  className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-venue-indigo/20 to-venue-indigo/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-venue-indigo" />
                  </div>
                  <p className="text-4xl font-bold text-venue-indigo mb-2">
                    {stat.number}
                  </p>
                  <p className="text-gray-600 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-venue-indigo/5 to-venue-indigo/10 px-4 sm:px-6 lg:px-8">
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
              Ready to Plan Your Perfect Event?
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Join thousands of satisfied customers who've discovered their dream venues on our platform. Start exploring today.
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
              className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white group"
            >
              <Link to="/venues" className="flex items-center gap-2">
                Explore Venues
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo/5"
            >
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
