import React, { useRef } from 'react';

const RadixUIIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="h-8 w-8">
    <path fill="#000" d="M47.435 100C30.626 100 17 85.4 17 67.39s13.626-32.608 30.435-32.608zm0-100.001H17v30.435h30.435zM67 30.434c8.404 0 15.217-6.813 15.217-15.218C82.217 6.812 75.404 0 67 0S51.782 6.812 51.782 15.216 58.597 30.434 67 30.434"/>
  </svg>
);

const MongooseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="h-8 w-8">
    <path fill="#800" d="M97.733 46.548a4.2 4.2 0 0 0-.352-1.431 3.3 3.3 0 0 0-.778-1.155 3.3 3.3 0 0 0-1.155-.778q-.652-.301-1.456-.301-.83 0-1.507.3a3.3 3.3 0 0 0-1.13.779q-.476.502-.752 1.18a4.3 4.3 0 0 0-.327 1.406zm2.058 3.615q-.426 2.184-1.883 3.29-1.455 1.104-3.665 1.104-1.557 0-2.712-.502a5.35 5.35 0 0 1-1.908-1.406q-.778-.904-1.18-2.16a10.8 10.8 0 0 1-.426-2.736q0-1.48.452-2.711.451-1.23 1.255-2.134a5.9 5.9 0 0 1 1.933-1.406 6 6 0 0 1 2.46-.503q1.733 0 2.862.729a5.4 5.4 0 0 1 1.833 1.807q.704 1.105.954 2.41.277 1.306.226 2.486h-9.716q-.025.854.201 1.632.225.753.728 1.356.503.577 1.28.928.78.352 1.833.352 1.355 0 2.21-.628.878-.627 1.154-1.908z"/>
    <path fill="#800" d="M79.88 50.188q.025.703.326 1.206.301.477.778.778a4 4 0 0 0 1.105.402q.627.125 1.28.125.503 0 1.055-.075.552-.076 1.004-.277a1.94 1.94 0 0 0 .779-.577q.3-.402.3-1.004 0-.828-.627-1.255-.627-.428-1.582-.678a19 19 0 0 0-2.033-.477 12.3 12.3 0 0 1-2.059-.603 4.4 4.4 0 0 1-1.556-1.105q-.628-.702-.628-1.958 0-.979.427-1.682a3.64 3.64 0 0 1 1.13-1.13 5 5 0 0 1 1.556-.653A7 7 0 0 1 82.867 41q1.106 0 2.034.201a4.3 4.3 0 0 1 1.632.653q.728.452 1.155 1.255.427.78.502 1.959h-2.134q-.05-.628-.326-1.03a2.1 2.1 0 0 0-.704-.678 3 3 0 0 0-.953-.351 4.2 4.2 0 0 0-1.03-.126q-.477 0-.979.076-.476.075-.879.276a1.63 1.63 0 0 0-.653.502q-.25.301-.25.803 0 .553.376.93.402.351 1.004.602.603.226 1.356.402.753.15 1.506.326.804.176 1.557.427.778.25 1.356.678.602.4.954 1.03.376.627.376 1.556 0 1.18-.502 1.958a3.7 3.7 0 0 1-1.28 1.255 5 5 0 0 1-1.783.653q-.979.2-1.958.2-1.08 0-2.059-.225a5.2 5.2 0 0 1-1.732-.728 3.9 3.9 0 0 1-1.205-1.356q-.452-.853-.502-2.059z"/>
    <path fill="#800" d="M68.122 47.803q0 1.18.301 2.11.326.903.879 1.53.552.603 1.28.93.754.326 1.582.326t1.556-.326a3.8 3.8 0 0 0 1.306-.93q.552-.627.854-1.53.326-.93.326-2.11t-.326-2.084q-.302-.929-.854-1.556a3.66 3.66 0 0 0-1.305-.954 3.8 3.8 0 0 0-1.557-.327q-.829 0-1.582.327a3.7 3.7 0 0 0-1.28.954q-.552.627-.879 1.556-.3.905-.301 2.084m-2.26 0q0-1.43.402-2.661a5.9 5.9 0 0 1 1.205-2.16 5.6 5.6 0 0 1 1.984-1.455q1.18-.528 2.71-.528 1.558 0 2.712.528a5.6 5.6 0 0 1 1.984 1.456 5.9 5.9 0 0 1 1.205 2.159q.402 1.23.402 2.661 0 1.43-.402 2.662-.402 1.23-1.205 2.159a5.75 5.75 0 0 1-1.984 1.43q-1.154.503-2.711.503-1.532 0-2.712-.502a5.75 5.75 0 0 1-1.983-1.431 6.2 6.2 0 0 1-1.205-2.16 8.5 8.5 0 0 1-.402-2.66"/>
    <path fill="#800" d="M56.113 47.803q0 1.18.302 2.11.326.903.878 1.53a3.9 3.9 0 0 0 1.28.93q.754.326 1.582.326.83 0 1.557-.326a3.8 3.8 0 0 0 1.305-.93q.553-.627.854-1.53.327-.93.327-2.11t-.327-2.084q-.3-.929-.854-1.556a3.66 3.66 0 0 0-1.305-.954 3.8 3.8 0 0 0-1.557-.327q-.829 0-1.581.327a3.7 3.7 0 0 0-1.28.954q-.553.627-.88 1.556-.3.905-.3 2.084m-2.26 0q0-1.43.402-2.661a5.9 5.9 0 0 1 1.206-2.16 5.6 5.6 0 0 1 1.983-1.455q1.18-.528 2.711-.528 1.557 0 2.712.528a5.6 5.6 0 0 1 1.983 1.456 5.9 5.9 0 0 1 1.205 2.159q.402 1.23.402 2.661 0 1.43-.402 2.662-.402 1.23-1.205 2.159a5.75 5.75 0 0 1-1.983 1.43q-1.155.503-2.712.503-1.53 0-2.711-.502a5.75 5.75 0 0 1-1.983-1.431 6.2 6.2 0 0 1-1.206-2.16 8.5 8.5 0 0 1-.401-2.66m-.11 5.372q0 3.189-1.456 4.77-1.456 1.582-4.57 1.582a9 9 0 0 1-1.857-.201 5.8 5.8 0 0 1-1.708-.653 4 4 0 0 1-1.255-1.18q-.503-.728-.552-1.782h2.134q.026.577.351.979.351.401.829.653.501.25 1.08.351.576.126 1.104.126 1.055 0 1.782-.377a3.2 3.2 0 0 0 1.206-1.004q.477-.629.678-1.532.225-.903.225-1.983v-.854h-.05q-.552 1.206-1.682 1.783a5.2 5.2 0 0 1-2.36.552q-1.456 0-2.536-.527a5.4 5.4 0 0 1-1.807-1.406 6.4 6.4 0 0 1-1.105-2.084 9 9 0 0 1-.351-2.536q0-1.154.3-2.36.302-1.23 1.005-2.209a5.3 5.3 0 0 1 1.858-1.632Q46.163 41 47.845 41q1.23 0 2.26.553 1.029.527 1.606 1.607h.025V41.3h2.009zm-5.975-.628q1.055 0 1.782-.427a3.6 3.6 0 0 0 1.205-1.154q.453-.729.653-1.632a7.4 7.4 0 0 0 .226-1.808q0-.854-.2-1.682a4.4 4.4 0 0 0-.654-1.481 3.2 3.2 0 0 0-1.13-1.08q-.702-.401-1.707-.401-1.03 0-1.757.401a3.4 3.4 0 0 0-1.205 1.03 4.8 4.8 0 0 0-.678 1.506q-.2.853-.2 1.782 0 .879.175 1.758.176.878.602 1.607.428.702 1.13 1.154.703.427 1.758.427M31.005 41.3h2.008v2.06h.05Q34.395 41 37.281 41q1.28 0 2.134.351.855.35 1.381.98.527.627.728 1.505.225.855.226 1.909v8.536h-2.134v-8.788q0-1.204-.703-1.908-.703-.703-1.933-.703-.98 0-1.707.302a3.2 3.2 0 0 0-1.18.853 3.8 3.8 0 0 0-.728 1.306 5.4 5.4 0 0 0-.226 1.607v7.33h-2.134zm-10.452 6.503q0 1.18.301 2.11a4.7 4.7 0 0 0 .879 1.53 3.9 3.9 0 0 0 1.28.93q.754.326 1.582.326t1.557-.326a3.8 3.8 0 0 0 1.305-.93q.552-.627.854-1.53.326-.93.326-2.11t-.326-2.084q-.302-.929-.854-1.556a3.66 3.66 0 0 0-1.305-.954 3.8 3.8 0 0 0-1.557-.327q-.828 0-1.582.327a3.7 3.7 0 0 0-1.28.954q-.552.627-.879 1.556-.3.905-.301 2.084m-2.26 0q0-1.43.402-2.661a5.9 5.9 0 0 1 1.205-2.16 5.6 5.6 0 0 1 1.984-1.455q1.18-.528 2.711-.528 1.557 0 2.711.528a5.6 5.6 0 0 1 1.984 1.456 5.9 5.9 0 0 1 1.205 2.159q.402 1.23.402 2.661 0 1.43-.402 2.662-.402 1.23-1.205 2.159a5.75 5.75 0 0 1-1.984 1.43q-1.154.503-2.711.503-1.532 0-2.711-.502a5.75 5.75 0 0 1-1.984-1.431 6.2 6.2 0 0 1-1.205-2.16 8.5 8.5 0 0 1-.402-2.66M0 41.3h2.008v1.909h.05q1.458-2.21 4.193-2.21q1.206 0 2.185.503.979.502 1.38 1.707a4.56 4.56 0 0 1 1.708-1.632 4.9 4.9 0 0 1 2.36-.578 6.3 6.3 0 0 1 1.757.226q.804.201 1.356.653.578.452.879 1.18.326.703.326 1.707v9.516h-2.134V45.77q0-.603-.1-1.13a2.2 2.2 0 0 0-.377-.904 1.83 1.83 0 0 0-.778-.628q-.477-.225-1.256-.225-1.582 0-2.485.903-.904.904-.904 2.41v8.085H8.034V45.77q0-.629-.126-1.155a2.2 2.2 0 0 0-.376-.904 1.7 1.7 0 0 0-.753-.603q-.453-.225-1.18-.225-.93 0-1.607.376a3.8 3.8 0 0 0-1.08.904q-.4.527-.602 1.105-.176.552-.176.928v8.085H0z"/>
  </svg>
);

const CloudinaryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="h-8 w-8">
    <path fill="#3448C5" d="M81.113 40.286A33.45 33.45 0 0 0 49.486 17a32.82 32.82 0 0 0-29.1 17.289 24.752 24.752 0 0 0-5.973 46.852l.621.282h.042v-7.041a18.464 18.464 0 0 1 7.695-34.096l1.74-.182.762-1.566a26.63 26.63 0 0 1 24.213-15.267 27.09 27.09 0 0 1 26.135 20.71l.597 2.369h2.485a15.35 15.35 0 0 1 15.034 15.29c0 5.84-3.37 10.62-9.111 13.039v6.676l.414-.132C94.268 78.2 100 70.695 100 61.64a21.695 21.695 0 0 0-18.887-21.355"/>
    <path fill="#3448C5" d="m37.342 80.611 1.375 1.375a.274.274 0 0 1-.19.464H27.674a4.97 4.97 0 0 1-4.97-4.97V56.406a.273.273 0 0 0-.274-.273h-2.32a.274.274 0 0 1-.198-.464l9.211-9.211a.273.273 0 0 1 .39 0l9.203 9.211a.274.274 0 0 1-.19.464h-2.353a.28.28 0 0 0-.282.273v20.71a4.97 4.97 0 0 0 1.45 3.495m20.353 0 1.383 1.375a.273.273 0 0 1-.199.464H48.053a4.97 4.97 0 0 1-4.97-4.97V61.733a.28.28 0 0 0-.274-.282h-2.344a.274.274 0 0 1-.19-.464l9.202-9.195a.273.273 0 0 1 .39 0l9.211 9.179a.273.273 0 0 1-.199.464h-2.352a.28.28 0 0 0-.274.281v15.4a4.97 4.97 0 0 0 1.442 3.495m20.361 0 1.375 1.375a.274.274 0 0 1-.19.464H68.38a4.97 4.97 0 0 1-4.97-4.97V67.018a.274.274 0 0 0-.274-.274h-2.32a.274.274 0 0 1-.19-.472l9.212-9.203a.264.264 0 0 1 .38 0l9.212 9.203a.272.272 0 0 1-.19.472h-2.36a.273.273 0 0 0-.274.274v10.097a4.97 4.97 0 0 0 1.45 3.496"/>
  </svg>
);
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
      { name: 'React.js', imageUrl: 'https://img.icons8.com/?size=100&id=asWSSTBrDlTW&format=png&color=000000', icon: Code2, color: '#61dafb' },
      { name: 'Vite', imageUrl: 'https://img.icons8.com/?size=100&id=dJjTWMogzFzg&format=png&color=000000', icon: Zap, color: '#646cff' },
      { name: 'Tailwind CSS', imageUrl: 'https://img.icons8.com/?size=100&id=4PiNHtUJVbLs&format=png&color=000000', icon: Package, color: '#0ea5e9' },
      { name: 'Radix UI', icon: RadixUIIcon, color: '#1a1a1a', isCustomSvg: true },
      { name: 'Framer Motion', imageUrl: 'https://img.icons8.com/?size=100&id=XKFRdQOs24QU&format=png&color=000000', icon: Layers, color: '#000000' },
    ]
  },
  {
    category: 'Backend',
    technologies: [
      { name: 'Node.js', imageUrl: 'https://img.icons8.com/?size=100&id=54087&format=png&color=000000', icon: Server, color: '#68a063' },
      { name: 'Express.js', imageUrl: 'https://img.icons8.com/?size=100&id=kg46nzoJrmTR&format=png&color=000000', icon: Cpu, color: '#000000' },
      { name: 'MongoDB', imageUrl: 'https://img.icons8.com/?size=100&id=bosfpvRzNOG8&format=png&color=000000', icon: Database, color: '#13aa52' },
      { name: 'Mongoose', icon: MongooseIcon, color: '#ff6b6b', isCustomSvg: true },
      { name: 'JWT', imageUrl: 'https://img.icons8.com/?size=100&id=rHpveptSuwDz&format=png&color=000000 ', icon: Key, color: '#000000' },
      { name: 'Nodemailer', icon: Mail, color: '#1a73e8' },
      { name: 'Passport.js', icon: Shield, color: '#34e27a' }
    ]
  },
  {
    category: 'Infrastructure & Services',
    technologies: [
      { name: 'AWS', imageUrl: 'https://img.icons8.com/?size=100&id=e6uRfPIDgoXi&format=png&color=000000', icon: Cloud, color: '#ff9900' },
      { name: 'Cloudinary', icon: CloudinaryIcon, color: '#3448c5', isCustomSvg: true },
      { name: 'Google OAuth 2.0', imageUrl: 'https://img.icons8.com/?size=100&id=17949&format=png&color=000000', icon: Shield, color: '#4285f4' },
      { name: 'Razorpay', icon: CreditCard, color: '#2f75d9' }
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
                              {tech.imageUrl ? (
                                <img src={tech.imageUrl} alt={tech.name} className="h-8 w-8" />
                              ) : tech.isCustomSvg ? (
                                <IconComponent />
                              ) : (
                                <IconComponent className="h-8 w-8" style={{ color: tech.color }} />
                              )}
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
