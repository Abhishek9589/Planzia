import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Shield,
  Clock,
  Settings,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Target,
  ArrowRight,
  Zap
} from 'lucide-react';

const benefits = [
  {
    title: "All-in-One Intelligence",
    description: "Discover, compare, and book exceptional venues instantly. No endless phone calls, no confusing spreadsheets—just elegant simplicity.",
    icon: Search,
    color: "bg-blue-100 text-blue-700"
  },
  {
    title: "Authentically Verified",
    description: "Every venue is carefully vetted for quality, safety, and genuine excellence. You're always booking with confidence.",
    icon: Shield,
    color: "bg-green-100 text-green-700"
  },
  {
    title: "Remarkably Efficient",
    description: "Reclaim your time. Our intelligent platform eliminates hours of searching, negotiating, and coordination.",
    icon: Clock,
    color: "bg-purple-100 text-purple-700"
  },
  {
    title: "Infinitely Flexible",
    description: "Intimate family gatherings to massive brand activations—we adapt seamlessly to every event type and scale.",
    icon: Settings,
    color: "bg-orange-100 text-orange-700"
  },
  {
    title: "Completely Transparent",
    description: "See exactly what you're paying, with zero surprises. Honest pricing, secure payments, complete peace of mind.",
    icon: DollarSign,
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    title: "Mutual Growth",
    description: "Venue partners enjoy steady bookings, enhanced visibility, and effortless management. Everyone wins.",
    icon: TrendingUp,
    color: "bg-indigo-100 text-indigo-700"
  }
];

const eventTypes = [
  "Intimate Society Gatherings",
  "Bold Brand Activations",
  "Premium Corporate Conferences",
  "Dream Personal Celebrations",
  "Professional Seminars & Forums",
  "Visionary Brand Launches",
  "Elegant Wedding Ceremonies",
  "Vibrant Community Events"
];

export default function WhyPlanzia() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop')"
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">
              The Better Way to Book
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              At Planzia, we've reimagined venue booking entirely. It should be intuitive, transparent, delightful—never stressful or complicated.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Simple & Fast
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                Trusted & Verified
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                Perfect Match
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Whether you're orchestrating a <span className="font-semibold text-venue-indigo">community celebration</span>, launching a <span className="font-semibold text-venue-indigo">bold brand activation</span>, hosting a <span className="font-semibold text-venue-indigo">corporate gathering</span>, or planning a <span className="font-semibold text-venue-indigo">dream personal event</span>—Planzia transforms the experience for everyone. Organizers get clarity and confidence. Venues get growth and visibility. Magic happens at the intersection.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Planzia */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Six Reasons Smart Event Planners Choose Planzia
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover what sets us apart from the rest and why thousands trust us with their most important moments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 group">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${benefit.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-venue-dark mb-3">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Event Types We Support */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Perfect for Every Event Type
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whatever your event needs, Planzia has the right venue for you
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {eventTypes.map((eventType, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-venue-indigo hover:shadow-md transition-all duration-300 group">
                <div className="w-8 h-8 bg-venue-lavender rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-venue-indigo transition-colors">
                  <CheckCircle className="h-4 w-4 text-venue-indigo group-hover:text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-venue-indigo">
                  {eventType}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16 bg-venue-indigo text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Our Vision
            </h2>
            <p className="text-xl leading-relaxed mb-8">
              To become India's most trusted platform for <span className="font-semibold">event venue discovery & booking</span>, empowering both customers and partners with convenience, transparency, and growth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">For Customers</h3>
                <p className="text-white/80">Convenient, transparent booking experience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">For Partners</h3>
                <p className="text-white/80">Growth opportunities and hassle-free management</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Together</h3>
                <p className="text-white/80">Building India's largest venue ecosystem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-venue-lavender border-venue-indigo">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-venue-dark mb-6">
                Ready to Experience the Planzia Difference?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have found their perfect venues through Planzia. Start your seamless event planning journey today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={() => window.location.href = '/venues'}
                  className="bg-venue-indigo hover:bg-venue-purple text-white"
                  size="lg"
                >
                  Browse Venues
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => window.location.href = '/contact'}
                  variant="outline"
                  className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo hover:text-white"
                  size="lg"
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
