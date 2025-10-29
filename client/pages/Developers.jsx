import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { scrollToTop } from '@/lib/navigation';
import {
  Code2,
  Zap,
  Lock,
  Cloud,
  Github,
  Cpu,
  Database,
  ArrowRight,
  Layers,
  Rocket,
  FileJson,
  Server,
  Key,
  Mail,
  HardDrive,
  Globe,
  CreditCard,
  ImageIcon,
  Shield,
  Package
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

const developers = [
  {
    name: 'Anurag Yadav',
    role: 'CEO & Full Stack Developer',
    bio: 'Anurag leads the product vision and architecture of Planiza, ensuring every feature is built for performance, scalability, and user delight.',
    image: '/images/developers/anurag.jpg'
  },
  {
    name: 'Abhishek Kushwaha',
    role: 'CTO & Full Stack Developer',
    bio: 'Abhishek drives Planiza\'s technical roadmap, crafting efficient systems that power the next generation of venue booking.',
    image: '/images/developers/abhishek.jpg'
  }
];

const visionCards = [
  {
    icon: Code2,
    title: 'API Development',
    description: 'Building robust, high-performance REST APIs that power seamless integrations and data flows'
  },
  {
    icon: Layers,
    title: 'Scalable Architecture',
    description: 'Designing systems that grow with demand, ensuring reliability and performance at scale'
  },
  {
    icon: Lock,
    title: 'Secure Authentication',
    description: 'Implementing industry-standard security protocols to protect user data and transactions'
  },
  {
    icon: Cloud,
    title: 'Cloud Optimization',
    description: 'Leveraging cloud infrastructure for speed, redundancy, and efficient resource management'
  }
];

const techStack = [
  {
    category: 'Frontend',
    technologies: [
      { name: 'React', icon: Code2, color: '#61dafb' },
      { name: 'Vite', icon: Zap, color: '#646cff' },
      { name: 'React Router', icon: Globe, color: '#f44250' },
      { name: 'Tailwind CSS', icon: Package, color: '#0ea5e9' },
      { name: 'Radix UI', icon: FileJson, color: '#1a1a1a' },
      { name: 'TanStack Query', icon: Database, color: '#ef4444' }
    ]
  },
  {
    category: 'Backend',
    technologies: [
      { name: 'Node.js', icon: Server, color: '#68a063' },
      { name: 'Express', icon: Cpu, color: '#000000' },
      { name: 'JWT', icon: Key, color: '#000000' },
      { name: 'Nodemailer', icon: Mail, color: '#1a73e8' },
      { name: 'Mongoose', icon: HardDrive, color: '#ff6b6b' }
    ]
  },
  {
    category: 'Database & APIs',
    technologies: [
      { name: 'MongoDB', icon: Database, color: '#13aa52' },
      { name: 'MongoDB Atlas', icon: Cloud, color: '#13aa52' },
      { name: 'Google OAuth 2.0', icon: Shield, color: '#4285f4' },
      { name: 'Razorpay', icon: CreditCard, color: '#2f75d9' },
      { name: 'Cloudinary', icon: ImageIcon, color: '#3448c5' },
      { name: 'Nodemailer SMTP', icon: Mail, color: '#1a73e8' }
    ]
  },
  {
    category: 'Infrastructure',
    technologies: [
      { name: 'AWS (Frontend)', icon: Cloud, color: '#ff9900' },
      { name: 'AWS (Backend)', icon: Cloud, color: '#ff9900' },
      { name: 'MongoDB Atlas', icon: Database, color: '#13aa52' }
    ]
  }
];

export default function Developers() {
  const developersRef = useRef(null);

  const handleMeetDevelopersClick = (e) => {
    e.preventDefault();
    const element = document.getElementById('developers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-venue-lavender/10 pt-16 scroll-smooth">
      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={transition}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-venue-dark mb-6 leading-tight">
              Building the Future of Event Tech — One Line of Code at a Time.
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              At Planiza, our developers design, innovate, and scale seamless experiences that redefine event technology.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
                onClick={handleMeetDevelopersClick}
              >
                Meet the Developers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* The Minds Behind Planiza */}
      <section id="developers" className="py-20 bg-white">
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
              The Minds Behind Planiza
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the innovators shaping Planiza's technology — turning complex challenges into smooth, scalable solutions.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {developers.map((dev, idx) => (
              <motion.div
                key={dev.name}
                variants={fadeUp}
                transition={{ ...transition, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full overflow-hidden border-venue-lavender/50 hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-80 overflow-hidden bg-gray-200">
                    <img
                      src={dev.image}
                      alt={dev.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-venue-dark mb-2">{dev.name}</h3>
                    <p className="text-venue-indigo font-semibold mb-4">{dev.role}</p>
                    <p className="text-gray-700 leading-relaxed">{dev.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Developer Vision Section */}
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
              Empowering Innovation Through Code
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our developers blend innovation and precision to build robust architecture, fast APIs, and seamless user journeys.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {visionCards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  transition={{ ...transition, delay: idx * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-venue-lavender/50 group hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-14 h-14 bg-gradient-to-br from-venue-indigo to-venue-indigo/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-venue-dark text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
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
              Our Tech Stack
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built using cutting-edge technologies for speed, security, and scalability.
            </p>
          </motion.div>

          <motion.div
            className="space-y-12"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {techStack.map((stack, stackIdx) => (
              <motion.div
                key={stack.category}
                variants={fadeUp}
                transition={{ ...transition, delay: stackIdx * 0.1 }}
              >
                <h3 className="text-2xl font-bold text-venue-dark mb-6">{stack.category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {stack.technologies.map((tech, idx) => {
                    const IconComponent = tech.icon;
                    return (
                      <motion.div
                        key={tech.name}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="h-full text-center hover:shadow-lg transition-all duration-300 border-venue-lavender/50 group hover:-translate-y-1">
                          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                            <div className="mb-3 group-hover:scale-110 transition-transform">
                              <IconComponent className="h-8 w-8" style={{ color: tech.color }} />
                            </div>
                            <p className="text-sm font-semibold text-venue-dark">{tech.name}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Developer Community Section */}
      <section className="py-20 bg-venue-lavender/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-venue-dark mb-6 leading-tight">
              Code. Collaborate. Create.
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              We're building an ecosystem where developers can innovate, experiment, and contribute to the future of event tech.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-venue-indigo to-venue-indigo/80 hover:shadow-lg hover:shadow-venue-indigo/30 text-white hover:text-white transition-all duration-200"
                onClick={scrollToTop}
              >
                <a href="#developers">Join Our Developer Program</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-venue-indigo text-venue-indigo hover:bg-venue-indigo/10 hover:text-venue-indigo transition-colors"
                onClick={scrollToTop}
              >
                <a href="#">Explore API Docs</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop&q=80')",
          backgroundPosition: 'center'
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-venue-indigo/90 to-venue-indigo/80"></div>
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
              Ready to Build with Us?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join our mission to empower event technology with seamless innovation.
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
                <a href="#">
                  Join the Developer Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
