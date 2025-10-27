import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  Users,
  Building,
  MessageSquare,
  Search,
  CreditCard,
  Shield,
  RefreshCw,
  DollarSign,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const customerFAQs = [
  {
    question: "What exactly is Planzia?",
    answer: "Planzia is India's premier platform for discovering, comparing, and booking exceptional event venues. We connect you with carefully curated spaces across residential societies, premium malls, tech parks, and gorgeous open grounds—all transparent, all trustworthy.",
    icon: HelpCircle
  },
  {
    question: "Is there a cost to browse venues on Planzia?",
    answer: "Absolutely not. Exploring and comparing venues is completely free. You only pay when you're ready to book—and at that point, you know exactly what you're paying for with zero hidden charges.",
    icon: DollarSign
  },
  {
    question: "Walk me through the booking process.",
    answer: "It's beautifully simple: search for your location and event type, explore curated results with complete details, check real-time availability, and confirm your booking directly through our platform. You'll receive instant confirmation and all necessary details.",
    icon: Search
  },
  {
    question: "What if my plans change?",
    answer: "Life happens! You can modify or cancel your booking according to our Cancellation & Refund Policy. We work with transparent terms that respect both your needs and the venue's, ensuring fair treatment for everyone.",
    icon: RefreshCw
  },
  {
    question: "How safe is my payment information?",
    answer: "Your security is our top priority. All payments flow through industry-leading secure gateways with encryption. Your financial data is protected with the same standards trusted by major institutions.",
    icon: Shield
  },
  {
    question: "What if a venue cancels on me?",
    answer: "We've got you covered. If a venue cancels, you'll receive a full refund or the option to rebook at a comparable venue at no extra cost. Your event matters, and we stand behind it.",
    icon: CreditCard
  }
];

const partnerFAQs = [
  {
    question: "How do I get my venue listed on Planzia?",
    answer: "Simply complete our Partner Registration Form and share your venue details. Our dedicated team will verify everything to ensure quality standards, then launch your profile to thousands of eager event planners.",
    icon: Building
  },
  {
    question: "What advantages come with partnering with Planzia?",
    answer: "• Massive visibility to qualified event planners across India\n• Consistent, quality bookings flowing to your venue\n• Simple, automated management with transparent reporting\n• Secure, guaranteed payments with no hassles",
    icon: Users
  },
  {
    question: "What commission does Planzia charge?",
    answer: "We charge a transparent, competitive service fee on confirmed bookings. We'll discuss the exact details with you personally during the partnership conversation—no surprises, just straightforward business.",
    icon: DollarSign
  },
  {
    question: "When and how do I receive payments?",
    answer: "Payments flow directly to your registered bank account after the event concludes, on our standard payout cycle. You can track everything in real-time through your partner dashboard.",
    icon: CreditCard
  }
];

const generalFAQs = [
  {
    question: "Where is Planzia currently operating?",
    answer: "We're actively serving major event spaces and communities across India, with rapid expansion happening every quarter. Check our map to see venues near you, or reach out to learn about upcoming launches in your area.",
    icon: MapPin
  },
  {
    question: "How can I get in touch with support?",
    answer: "We're here for you 24/7. Email support@Planzia.in, visit our comprehensive Support Page, or call +91-8806621666 during business hours. We pride ourselves on thoughtful, prompt responses.",
    icon: MessageSquare
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=1200&h=800&fit=crop')"
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">
              Questions? We Have Answers
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about Planzia, from booking your first venue to growing a partnership. Still curious? Our support team is always ready to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Users className="h-4 w-4 mr-1" />
                For Customers
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Building className="h-4 w-4 mr-1" />
                For Partners
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <HelpCircle className="h-4 w-4 mr-1" />
                General Info
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* For Customers */}
        <section className="mb-16">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-2xl text-venue-dark">
                <Users className="h-6 w-6 mr-3 text-blue-600" />
                For Event Planners & Customers
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Your complete guide to discovering, comparing, and booking the perfect venue
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {customerFAQs.map((faq, index) => {
                  const Icon = faq.icon;
                  return (
                    <AccordionItem key={index} value={`customer-${index}`} className="border-b border-gray-200 last:border-b-0">
                      <AccordionTrigger className="text-left py-6 px-8 hover:no-underline">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <span className="font-semibold text-venue-dark">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-8 pb-6 text-gray-600 leading-relaxed">
                        {faq.answer.includes('•') ? (
                          <div className="whitespace-pre-line">{faq.answer}</div>
                        ) : (
                          faq.answer
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* For Venue Partners */}
        <section className="mb-16">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-2xl text-venue-dark">
                <Building className="h-6 w-6 mr-3 text-green-600" />
                For Venue Owners & Partners
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Everything venue partners need to know about growing with Planzia
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {partnerFAQs.map((faq, index) => {
                  const Icon = faq.icon;
                  return (
                    <AccordionItem key={index} value={`partner-${index}`} className="border-b border-gray-200 last:border-b-0">
                      <AccordionTrigger className="text-left py-6 px-8 hover:no-underline">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="font-semibold text-venue-dark">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-8 pb-6 text-gray-600 leading-relaxed">
                        {faq.answer.includes('•') ? (
                          <div className="whitespace-pre-line">{faq.answer}</div>
                        ) : (
                          faq.answer
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* General Questions */}
        <section className="mb-16">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center text-2xl text-venue-dark">
                <HelpCircle className="h-6 w-6 mr-3 text-purple-600" />
                General Questions
              </CardTitle>
              <p className="text-gray-600 mt-2">
                General information about Planzia and our services
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {generalFAQs.map((faq, index) => {
                  const Icon = faq.icon;
                  return (
                    <AccordionItem key={index} value={`general-${index}`} className="border-b border-gray-200 last:border-b-0">
                      <AccordionTrigger className="text-left py-6 px-8 hover:no-underline">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                          <span className="font-semibold text-venue-dark">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-8 pb-6 text-gray-600 leading-relaxed">
                        {faq.answer.includes('support@Planzia.in') ? (
                          <div>
                            You can reach us anytime at{' '}
                            <a href="mailto:support@Planzia.in" className="text-venue-indigo hover:underline">
                              support@Planzia.in
                            </a>{' '}
                            or visit our{' '}
                            <a href="/support" className="text-venue-indigo hover:underline">
                              Support Page
                            </a>
                            .
                          </div>
                        ) : (
                          faq.answer
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Contact Support */}
        <section>
          <Card className="bg-venue-indigo text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                Still Have Questions?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Our support team is here to help. Contact us for personalized assistance with your venue booking or partnership needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a 
                  href="mailto:support@Planzia.in"
                  className="flex items-center space-x-2 bg-white text-venue-indigo px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span className="font-semibold">Email Support</span>
                </a>
                <a 
                  href="tel:+918806621666"
                  className="flex items-center space-x-2 bg-white text-venue-indigo px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-semibold">Call Support</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
