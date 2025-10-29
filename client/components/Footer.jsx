import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { scrollToTop } from '@/lib/navigation';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Venues', href: '/venues' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const venueTypes = [
    { name: 'Banquet Halls', href: '/venues?type=banquet' },
    { name: 'Wedding Venues', href: '/venues?type=wedding' },
    { name: 'Conference Halls', href: '/venues?type=conference' },
    { name: 'Resorts', href: '/venues?type=resort' },
  ];

  const companyPages = [
    { name: 'Why Planzia', href: '/why-Planzia' },
    { name: 'Developers', href: '/developers' },
  ];

  const supportHelp = [
    { name: 'Support', href: '/support' },
    { name: 'FAQ', href: '/faq' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-white border-t border-venue-lavender/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Planzia Logo"
                className="h-10 object-contain"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your ultimate partner for discovering exceptional venues and creating unforgettable moments. We make event planning intuitive, transparent, and genuinely delightful.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="h-10 w-10 rounded-full bg-venue-lavender/50 hover:bg-venue-indigo text-venue-indigo hover:text-white flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-venue-indigo mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    onClick={scrollToTop}
                    className="text-gray-600 hover:text-venue-indigo transition-colors duration-200 text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Venue Types */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-venue-indigo mb-6">Venue Types</h3>
            <ul className="space-y-3">
              {venueTypes.map((type) => (
                <li key={type.name}>
                  <Link
                    to={type.href}
                    onClick={scrollToTop}
                    className="text-gray-600 hover:text-venue-indigo transition-colors duration-200 text-sm font-medium"
                  >
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-venue-indigo mb-6">Company</h3>
            <ul className="space-y-3">
              {companyPages.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={scrollToTop}
                    className="text-gray-600 hover:text-venue-indigo transition-colors duration-200 text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-venue-indigo mb-6">Reach Out to Us</h3>
            <div className="space-y-4">
              <a
                href="mailto:info@planzia.demo"
                className="flex items-start gap-3 group"
              >
                <Mail className="h-5 w-5 text-venue-indigo flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 hover:text-venue-indigo transition-colors text-sm font-medium">info@planzia.demo</span>
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-start gap-3 group"
              >
                <Phone className="h-5 w-5 text-venue-indigo flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 hover:text-venue-indigo transition-colors text-sm font-medium">+91-9876543210</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-venue-indigo flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm font-medium">New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-venue-lavender/50 my-12"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-sm font-medium">
            © 2025 Planzia. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/terms-and-conditions" onClick={scrollToTop} className="text-gray-600 hover:text-venue-indigo text-sm font-medium transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/privacy-policy" onClick={scrollToTop} className="text-gray-600 hover:text-venue-indigo text-sm font-medium transition-colors">
              Privacy Policy
            </Link>
            <Link to="/support" onClick={scrollToTop} className="text-gray-600 hover:text-venue-indigo text-sm font-medium transition-colors">
              Support
            </Link>
            <Link to="/faq" onClick={scrollToTop} className="text-gray-600 hover:text-venue-indigo text-sm font-medium transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
