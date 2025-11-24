import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { scrollToTop } from '@/lib/navigation';
import {
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  Award,
  ArrowRight,
  Lightbulb,
  Target,
  Heart,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

const coreValues = [
  {
    title: "Simplicity First",
    description: "Making venue discovery as easy as a few clicks, not days of research",
    icon: Lightbulb,
    color: "bg-blue-100 text-blue-700"
  },
  {
    title: "Trust & Verification",
    description: "Every venue verified for quality, ensuring your event is in safe hands",
    icon: Shield,
    color: "bg-green-100 text-green-700"
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges, no surprises — what you see is exactly what you pay",
    icon: Award,
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    title: "24/7 Support",
    description: "Our dedicated team is always here to help you succeed",
    icon: Users,
    color: "bg-purple-100 text-purple-700"
  }
];

const whyChoose = [
  {
    title: "Curated Selection",
    description: "Handpicked venues that meet our quality standards",
    icon: CheckCircle
  },
  {
    title: "Instant Booking",
    description: "Secure your date immediately with real-time confirmation",
    icon: Zap
  },
  {
    title: "Better Pricing",
    description: "Direct connections mean competitive rates for you",
    icon: TrendingUp
  },
  {
    title: "Expert Support",
    description: "Event specialists available to guide you through every step",
    icon: Heart
  }
];

const mission = {
  title: "Our Mission",
  description: "To transform event planning from a stressful ordeal into a seamless, joyful experience by connecting people with perfect venues instantly.",
  icon: Target
};

const vision = {
  title: "Our Vision",
  description: "Building India's most trusted event venue ecosystem where every celebration finds its perfect home.",
  icon: Globe
};

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function WhyPlanzia() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-venue-lavender/10 pt-16">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
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
              <div className="space-y-6">
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-venue-dark mb-4 leading-tight">
                    Why Planzia?
                  </h1>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    We're reimagining how events come together—one perfect venue at a time.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge variant="secondary" className="text-base px-4 py-2 bg-venue-lavender/80 text-venue-indigo">
                    <Shield className="h-4 w-4 mr-2" />
                    Verified Venues
                  </Badge>
                  <Badge variant="secondary" className="text-base px-4 py-2 bg-venue-lavender/80 text-venue-indigo">
                    <Zap className="h-4 w-4 mr-2" />
                    Instant Booking
                  </Badge>
                  <Badge variant="secondary" className="text-base px-4 py-2 bg-venue-lavender/80 text-venue-indigo">
                    <Users className="h-4 w-4 mr-2" />
                    Expert Support
                  </Badge>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
                    onClick={scrollToTop}
                  >
                    <Link to="/venues">Explore Venues Now</Link>
                  </Button>
                </div>
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
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=500&fit=crop&q=80"
                  alt="Planzia event planning platform"
                  className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-venue-indigo/5 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-venue-lavender/50 group hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-venue-indigo to-venue-indigo/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-venue-dark text-center text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {mission.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...transition, delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-venue-lavender/50 group hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-venue-indigo to-venue-indigo/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-venue-dark text-center text-2xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {vision.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Guiding principles that shape everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-venue-lavender/50 group hover:-translate-y-1">
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${value.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-venue-dark text-center">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Planzia Section */}
      <section className="py-20 bg-white">
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
                alt="Why choose Planzia"
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
                What Sets Us Apart
              </h2>

              <div className="space-y-6">
                {whyChoose.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex gap-4"
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ ...transition, delay: index * 0.1 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-venue-lavender">
                          <Icon className="h-6 w-6 text-venue-indigo" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-venue-dark">{item.title}</h3>
                        <p className="mt-2 text-gray-600">{item.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-gradient-to-r from-venue-indigo to-venue-indigo/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Growing Together
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Planzia is rapidly becoming the go-to platform for event planners and venue owners
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Verified Venues', icon: Award },
              { number: '10K+', label: 'Happy Customers', icon: Heart },
              { number: '50+', label: 'Cities Covered', icon: Globe },
              { number: '100%', label: 'Verified Quality', icon: CheckCircle }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...transition, delay: index * 0.1 }}
                >
                  <div className="mb-4">
                    <Icon className="h-12 w-12 text-white/70 mx-auto" />
                  </div>
                  <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/80 text-lg">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Operate Section */}
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
              How We Work
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A transparent, customer-centric approach to event venue discovery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Verify Every Venue",
                description: "Our team personally inspects and verifies every venue to ensure quality standards",
                icon: Shield
              },
              {
                step: 2,
                title: "Connect You Directly",
                description: "Get instant connections to venue owners without middlemen or hidden commissions",
                icon: Users
              },
              {
                step: 3,
                title: "Support Your Success",
                description: "From inquiry to booking, our team supports every step of your journey",
                icon: Heart
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
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-venue-lavender/50 group hover:-translate-y-1 relative">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-venue-indigo rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {item.step}
                    </div>
                    <CardHeader>
                      <div className="w-16 h-16 bg-venue-lavender rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-8 w-8 text-venue-indigo" />
                      </div>
                      <CardTitle className="text-venue-dark text-center">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-venue-indigo to-venue-indigo/80 opacity-90"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Plan Your Perfect Event?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who've found their ideal venues through Planzia.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-gray-50 text-venue-indigo hover:text-venue-indigo shadow-xl transition-all duration-200"
                onClick={scrollToTop}
              >
                <Link to="/venues">
                  Browse Venues
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-venue-indigo transition-all duration-200"
                onClick={scrollToTop}
              >
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
