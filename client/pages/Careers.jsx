import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Briefcase,
  TrendingUp,
  Heart,
  Code,
  MessageSquare,
  BarChart3,
  Settings,
  Mail,
  ArrowRight,
  Lightbulb,
  Target,
  Rocket
} from 'lucide-react';

const openings = [
  {
    title: "Business Growth & Partnerships",
    type: "Internship → Full-time pathway",
    icon: Briefcase,
    responsibilities: [
      "Lead venue onboarding across societies, malls, and corporate spaces",
      "Build authentic relationships with brands, agencies, and venue partners",
      "Outstanding communication and persuasion skills essential"
    ],
    color: "bg-blue-100 text-blue-700"
  },
  {
    title: "Creative Marketing & Brand",
    type: "Internship",
    icon: BarChart3,
    responsibilities: [
      "Craft compelling campaigns and social media narratives",
      "Drive digital strategy and brand visibility",
      "Blend creativity with strategic thinking"
    ],
    color: "bg-green-100 text-green-700"
  },
  {
    title: "Full-Stack Engineering",
    type: "Internship",
    icon: Code,
    responsibilities: [
      "Build and enhance Planzia's core platform and booking engine",
      "Work with cutting-edge technologies and frameworks",
      "Turn complex challenges into elegant solutions"
    ],
    color: "bg-purple-100 text-purple-700"
  },
  {
    title: "Operations & Execution",
    type: "Internship",
    icon: Settings,
    responsibilities: [
      "Orchestrate flawless venue activations and events",
      "Partner with stakeholders to deliver exceptional experiences",
      "Drive excellence through meticulous execution"
    ],
    color: "bg-orange-100 text-orange-700"
  }
];

const benefits = [
  {
    icon: Rocket,
    title: "Startup Spirit",
    description: "Work directly alongside founders and core innovators. Your voice matters from day one."
  },
  {
    icon: TrendingUp,
    title: "Rapid Growth",
    description: "Accelerate your career with real responsibility and mentorship in a fast-moving environment."
  },
  {
    icon: Target,
    title: "Genuine Impact",
    description: "Your contributions directly shape how millions discover and celebrate events. Purpose-driven work."
  },
  {
    icon: Heart,
    title: "Thriving Culture",
    description: "Flexible, creative, and authentically collaborative. We believe in people first."
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop')"
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">
              Build the Future with Us
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join a passionate team transforming how events happen. Grow, create, and make an impact with Planzia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Fast-Growing Startup
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Multiple Openings
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Growth Opportunities
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
              Our mission is audacious: transform <span className="font-semibold text-venue-indigo">event venue discovery and booking</span> into something as intuitive and delightful as ordering food or hailing a ride. From vibrant societies and premium malls to cutting-edge corporate spaces and scenic outdoor grounds—we're reimagining how celebrations and activations happen across India.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We're a <span className="font-semibold text-venue-indigo">rapidly scaling startup</span> built by people who are passionate, ambitious, and hungry to make a real difference. If you thrive on challenges, embrace creativity, and want to be part of something meaningful—<span className="font-semibold text-venue-indigo">Planzia is your place</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Why Join the Planzia Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Be part of a team that values growth, celebrates innovation, and measures success by impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-venue-lavender rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-venue-indigo" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-venue-dark mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Current Openings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore opportunities to grow your career with Planzia
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {openings.map((opening, index) => {
              const Icon = opening.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${opening.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-venue-dark">{opening.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {opening.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {opening.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-venue-indigo mt-2 flex-shrink-0"></div>
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Don't See Your Role */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-venue-dark mb-6">
            Don't See Your Role?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            We're always on the lookout for passionate people. If you think you can add value, write to us.
          </p>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg border-0 bg-venue-indigo text-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold mb-4">How to Apply?</CardTitle>
              <p className="text-white/90 text-lg">
                Send us your resume + short note on why you'd like to join Planzia
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-lg">
                  <Mail className="h-5 w-5" />
                  <span className="font-semibold">careers@Planzia.in</span>
                </div>
                <div className="text-white/90">
                  www.Planzia.in
                </div>
                <Button 
                  onClick={() => window.location.href = 'mailto:careers@Planzia.in?subject=Job Application - [Role Name]&body=Hi Planzia Team,%0D%0A%0D%0AI am interested in joining Planzia. Please find my resume attached.%0D%0A%0D%0AWhy I want to join Planzia:%0D%0A[Your reason here]%0D%0A%0D%0ABest regards,%0D%0A[Your name]'}
                  className="bg-white text-venue-indigo hover:bg-gray-100 mt-6"
                  size="lg"
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
