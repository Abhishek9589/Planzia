import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  HeadphonesIcon,
  Mail,
  Phone,
  Clock,
  Users,
  Building,
  HelpCircle,
  FileText,
  Shield,
  Link as LinkIcon
} from 'lucide-react';

const supportAreas = [
  {
    title: "For Event Planners & Customers",
    icon: Users,
    services: [
      "Smart guidance on discovering your ideal venue",
      "Complete support for secure payments, refunds, and modifications",
      "Expert tips on using Planzia to maximize your event"
    ],
    color: "bg-blue-100 text-blue-700"
  },
  {
    title: "For Venue Owners & Partners",
    icon: Building,
    services: [
      "Seamless onboarding and profile optimization",
      "Real-time assistance with bookings and event coordination",
      "Technical support ensuring smooth operations always"
    ],
    color: "bg-green-100 text-green-700"
  }
];

const quickLinks = [
  {
    title: "Frequently Asked Questions",
    description: "Get instant answers to your most common questions",
    icon: HelpCircle,
    link: "/faq"
  },
  {
    title: "Terms & Conditions",
    description: "Understand our commitments and your rights",
    icon: FileText,
    link: "/terms-and-conditions"
  },
  {
    title: "Privacy Policy",
    description: "Learn how we protect and respect your information",
    icon: Shield,
    link: "/privacy-policy"
  }
];

export default function Support() {
  const handleDownloadPDF = () => {
    // Use the PDF URL from the attachment
    const pdfUrl = "https://cdn.builder.io/o/assets%2F3b6b1b8f741c4734989eae043b101f0d%2F72084cc8fbf341d6b1e6e5fde601b04e?alt=media&token=ae454ca3-13b6-4a2e-9e99-61235509d7b3&apiKey=3b6b1b8f741c4734989eae043b101f0d";
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Planzia-Support-Guide.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1553484771-371a605b060b?w=1200&h=800&fit=crop')"
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">
              Your Success is Our Mission
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Whether you're discovering your perfect venue or growing a thriving partnership with us, our dedicated support team is here to make your experience exceptional at every step.
            </p>
            <Button 
              onClick={handleDownloadPDF}
              className="bg-venue-indigo hover:bg-venue-purple text-white"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Support Guide (PDF)
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* How Can We Help You */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Support Tailored to You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're a customer or partner, we're here with expert guidance and genuine care
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {supportAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-2xl text-venue-dark">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${area.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {area.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {area.services.map((service, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-venue-indigo mt-2 flex-shrink-0"></div>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Contact Support */}
        <section className="mb-16">
          <Card className="bg-venue-lavender border-venue-indigo">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-3xl text-venue-dark mb-4">
                <HeadphonesIcon className="h-8 w-8 mr-3 text-venue-indigo" />
                Contact Support
              </CardTitle>
              <p className="text-gray-600 text-lg">
                Reach out to us through any of these channels
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-venue-indigo rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-venue-dark mb-2">Email Support</h3>
                  <a 
                    href="mailto:support@Planzia.in" 
                    className="text-venue-indigo hover:underline font-medium"
                  >
                    support@Planzia.in
                  </a>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-venue-indigo rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-venue-dark mb-2">Phone Support</h3>
                  <a 
                    href="tel:+918806621666" 
                    className="text-venue-indigo hover:underline font-medium"
                  >
                    +91-8806621666
                  </a>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-venue-indigo rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-venue-dark mb-2">Available Hours</h3>
                  <div className="text-gray-600">
                    <div className="font-medium">Monday – Saturday</div>
                    <div>10:00 AM – 7:00 PM</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Links */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Quick Links
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find helpful resources and information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-venue-lavender rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-venue-indigo group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6 text-venue-indigo group-hover:text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-venue-dark mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <Button 
                      variant="outline" 
                      className="group-hover:bg-venue-indigo group-hover:text-white group-hover:border-venue-indigo"
                      onClick={() => window.location.href = item.link}
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Visit Page
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Download Support Guide */}
        <section>
          <Card className="bg-venue-indigo text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                Need Comprehensive Support Information?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Download our complete support guide with detailed information about our services, 
                contact methods, and helpful resources.
              </p>
              <Button 
                onClick={handleDownloadPDF}
                className="bg-white text-venue-indigo hover:bg-gray-100"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Support Guide (PDF)
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
