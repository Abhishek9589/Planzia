import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const team = [
  {
    name: 'Aarav Mehta',
    role: 'Frontend Developer',
    photo: 'https://images.unsplash.com/photo-1607748851768-897c3b5b1efe?w=600&h=600&fit=crop&crop=faces',
    quote: 'Crafting delightful user experiences with performance in mind.'
  },
  {
    name: 'Isha Kapoor',
    role: 'Backend Engineer',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop&crop=faces',
    quote: 'Reliable services, clean APIs, and scalable systems.'
  },
  {
    name: 'Rohan Sharma',
    role: 'Full‑Stack Engineer',
    photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=600&h=600&fit=crop&crop=faces',
    quote: 'From pixels to pipelines — I love shipping end to end.'
  },
  {
    name: 'Neha Singh',
    role: 'UI/UX Engineer',
    photo: 'https://images.unsplash.com/photo-1541214113241-7f4c39a7e4bc?w=600&h=600&fit=crop&crop=faces',
    quote: 'Design is how it works — not just how it looks.'
  },
  {
    name: 'Karan Patel',
    role: 'Mobile Developer',
    photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=600&h=600&fit=crop&crop=faces',
    quote: 'Smooth, fast, and accessible apps for everyone.'
  },
  {
    name: 'Sara Ali',
    role: 'DevOps Engineer',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=600&fit=crop&crop=faces',
    quote: 'Automation first. Stability always.'
  },
  {
    name: 'Vikram Rao',
    role: 'Data Engineer',
    photo: 'https://images.unsplash.com/photo-1542326237-94b1c5a538d6?w=600&h=600&fit=crop&crop=faces',
    quote: 'Turning data into decisions.'
  },
  {
    name: 'Ananya Das',
    role: 'QA Engineer',
    photo: 'https://images.unsplash.com/photo-1531123414780-f74239ffb0c2?w=600&h=600&fit=crop&crop=faces',
    quote: 'Quality is everyone’s responsibility — I lead the charge.'
  }
];

export default function Developers() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat developers-hero-image">
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={transition}
            >
              Building the Future, One Line at a Time
            </motion.h1>
            <motion.p
              className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transition, delay: 0.1 }}
            >
              Our engineering team blends innovation, teamwork, and excellence to craft reliable, fast, and user‑friendly experiences across the VenueKart platform.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">Meet the Minds Behind the Code</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The people who turn ideas into production‑ready features, ensuring performance, security, and a great user experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                transition={{ ...transition, delay: (idx % 4) * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-venue-dark">{member.name}</h3>
                    <p className="text-sm text-venue-indigo font-medium mb-3">{member.role}</p>
                    {member.quote && (
                      <p className="text-sm text-gray-600 leading-relaxed">“{member.quote}”</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-6 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            className="text-lg text-gray-600"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            We keep things simple, ship fast, and iterate with care — so your celebrations are unforgettable.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
