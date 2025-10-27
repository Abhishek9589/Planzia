import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  User,
  ArrowRight,
  MapPin,
  Building,
  Users,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  Eye,
  BookOpen
} from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide: 5 Essential Venue Types Every Pune Event Planner Should Know",
    excerpt: "Discover the diverse, exceptional venue options available in Pune. From grand banquet halls to intimate societies and everything in between—find your perfect space with confidence.",
    content: {
      intro: "Every great celebration starts with the right space. Yet finding that perfect venue can feel overwhelming—endless phone calls, confusing pricing, and promises that never materialize. But it doesn't have to be this way. When you know your options and have the right tools, the entire process becomes exciting rather than stressful.",
      PlanziaInfo: "That's where Planzia comes in. As India's premier event venue discovery platform, we've made venue selection intelligent, transparent, and genuinely delightful. With 100+ residential societies, 25+ premier malls, and dozens of stunning open spaces already available in Pune, we're transforming how celebrations happen.",
      venues: [
        {
          title: "Elegant Banquet Halls for Life's Grand Moments",
          description: "From intimate engagement ceremonies to spectacular wedding receptions, premium banquet halls offer sophisticated indoor spaces with modern amenities, full catering support, and impeccable service. Pune's finest banquet halls combine elegance with functionality.",
          idealFor: "Weddings, anniversaries, gala celebrations, receptions",
          whyPlanzia: "Compare premium venues with transparent pricing and authentic reviews"
        },
        {
          title: "Vibrant Residential Societies for Authentic Community Connections",
          description: "Residential societies have emerged as the heart of community celebrations. From Ganesh Chaturthi festivals to neighborhood activations and colony fests, these intimate spaces offer genuine connection with built-in, diverse audiences and vibrant community energy.",
          idealFor: "Festival celebrations, brand activations, community gatherings, neighborhood events",
          whyPlanzia: "Direct access to 100+ verified societies across Pune with ease"
        },
        {
          title: "Premium Malls for Maximum Impact & Engagement",
          description: "When you need visibility and foot traffic, premium malls deliver. With thousands of daily visitors, malls offer unparalleled exposure for brand activations, product launches, and exhibitions. Planzia connects you with Pune's top retail destinations.",
          idealFor: "Brand launches, product sampling, exhibitions, corporate activations",
          whyPlanzia: "Curated mall partnerships with guaranteed quality and transparent terms"
        },
        {
          title: "Tech-Forward IT Parks for Corporate Excellence",
          description: "As Pune's thriving IT capital, our city boasts world-class corporate spaces. IT parks offer premium infrastructure, tech-ready facilities, and professional audiences—perfect for conferences, seminars, and executive gatherings.",
          idealFor: "Conferences, corporate seminars, professional forums, industry events",
          whyPlanzia: "Access to 50+ premium IT parks with verified amenities and services"
        },
        {
          title: "Breathtaking Open Grounds for Unforgettable Celebrations",
          description: "Nothing compares to celebrating under open skies. Pune's lush gardens and sprawling lawns provide picturesque backdrops for intimate gatherings to grand celebrations, all set against natural beauty and excellent weather.",
          idealFor: "Large-scale celebrations, outdoor parties, concerts, family gatherings",
          whyPlanzia: "Compare venues instantly and book with confidence, all in one place"
        }
      ]
    },
    category: "Venue Guide",
    readTime: "5 min read",
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
    tags: ["Pune", "Venues", "Event Planning"]
  },
  {
    id: 2,
    title: "Societies Are The New Frontier: Why Smart Brands Are Choosing Community Activations",
    excerpt: "Discover the untapped power of residential societies for brand activations. Learn why leading brands are shifting focus from traditional malls to hyperlocal, community-driven platforms.",
    content: {
      intro: "The marketing landscape is shifting. While malls and exhibitions have long dominated brand activation strategies, a powerful new opportunity is emerging: Residential Welfare Associations (RWAs) and housing societies. For brands seeking authentic connections with engaged, diverse audiences, societies represent the future of hyperlocal marketing.",
      effectiveness: [
        {
          title: "Concentrated Reach with Guaranteed Engagement",
          description: "Societies house hundreds or thousands of residents on a single campus—families, professionals, decision-makers, all in one place. Your activation reaches a pre-assembled, captive audience with genuine interest and high engagement rates."
        },
        {
          title: "Remarkably Diverse & Highly Targeted Demographics",
          description: "Unlike malls with random foot traffic, societies bring together varied demographics: families, working professionals, children, seniors. This enables brands to craft nuanced, multi-generational campaigns that resonate deeply."
        },
        {
          title: "Authentic Trust & Community Buy-In",
          description: "Society residents perceive activations as community initiatives, not marketing intrusions. This authentic trust factor translates directly into higher conversion rates and genuine brand affinity."
        },
        {
          title: "Unbeatable ROI with Flexible, Scalable Approach",
          description: "Society bookings are affordable, flexible, and easily scalable. Run activations across multiple societies simultaneously without the high costs and rigid limitations of mall activations."
        },
        {
          title: "Festival & Seasonal Momentum is Inherent",
          description: "Societies naturally buzz during major festivals—Ganesh Chaturthi, Diwali, Holi, Independence Day—and community celebrations. Align your brand with authentic celebrations and natural excitement."
        }
      ],
      caseStudy: {
        title: "Real Impact: FMCG Brand Activation Across Pune Societies",
        description: "A leading FMCG brand executed a weekend sampling activation across just 10 societies in Pune through Planzia. In just 48 hours, they reached 5,000+ families, distributed thousands of samples, and achieved an impressive 20% immediate conversion rate. This success level would be impossible in a single mall at comparable cost."
      }
    },
    category: "Marketing Insights",
    readTime: "7 min read",
    date: "2024-01-20",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    tags: ["Brand Activations", "Marketing", "RWA", "Societies"]
  },
  {
    id: 3,
    title: "The Venue Booking Revolution: How Modern Platforms Are Reimagining Event Planning",
    excerpt: "Technology is transforming venue booking from a frustrating, time-consuming ordeal into an elegant, intelligent experience. Discover how the events industry is evolving.",
    content: {
      intro: "Remember when booking a venue meant weeks of phone tag, confusing emails, and frustrating negotiations? That era is fading fast. Today's technology is revolutionizing how events come to life—what once took days now happens in minutes. Platforms like Planzia are making event venue booking smarter, faster, more transparent, and genuinely enjoyable.",
      oldWay: [
        "Endless calls to multiple venue managers",
        "Mysterious, hidden pricing and surprise costs",
        "Painful waiting periods for confirmations",
        "Limited visibility into available options"
      ],
      techChanges: [
        {
          title: "Real-Time Discovery & Complete Transparency",
          description: "Modern platforms reveal every available venue instantly—filtered by your exact needs: location, capacity, budget, amenities. No more tedious phone calls or guesswork. Everything you need is visible, organized, and accurate."
        },
        {
          title: "Crystal-Clear, Honest Pricing",
          description: "The days of \"surprise fees\" and pricing confusion are over. Contemporary platforms display complete, upfront pricing that's comparable across venues, empowering you to make confident decisions immediately."
        },
        {
          title: "Verified Partnerships & Genuine Trust",
          description: "Today's intelligent platforms carefully vet every venue—societies, malls, parks, open spaces—ensuring only authentic, reliable partners are available. You book with confidence, knowing quality is guaranteed."
        },
        {
          title: "Effortless Scaling & Multi-Location Management",
          description: "Plan activations across 10 malls and 50 societies simultaneously? Modern technology makes it simple. Scale your reach across countless venues at once, maximizing impact with minimal coordination effort."
        },
        {
          title: "Powerful Analytics & Smart Decision-Making",
          description: "Beyond booking, today's platforms provide rich insights—footfall analytics, conversion data, engagement reports. Measure real ROI and continuously refine your strategy based on actual performance data."
        }
      ]
    },
    category: "Technology",
    readTime: "6 min read",
    date: "2024-01-25",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    tags: ["Technology", "Digital Transformation", "Future"]
  }
];

const BlogCard = ({ post, isExpanded, onToggle }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-venue-indigo">
            {post.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-venue-dark hover:text-venue-indigo transition-colors cursor-pointer line-clamp-2">
          {post.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button 
          onClick={() => onToggle(post.id)}
          variant="outline" 
          className="w-full group"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                {post.content.intro}
              </p>
              
              {post.content.PlanziaInfo && (
                <p className="text-gray-600 leading-relaxed mb-6">
                  {post.content.PlanziaInfo}
                </p>
              )}
              
              {post.content.venues && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-venue-dark">
                    Top 5 Venue Types in Pune:
                  </h3>
                  {post.content.venues.map((venue, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-venue-dark mb-2">
                        {index + 1}. {venue.title}
                      </h4>
                      <p className="text-gray-600 mb-3">{venue.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Ideal for:</span>
                          <span className="text-gray-600 ml-1">{venue.idealFor}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Why Planzia:</span>
                          <span className="text-gray-600 ml-1">{venue.whyPlanzia}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {post.content.effectiveness && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-venue-dark">
                    What Makes RWAs & Societies So Effective?
                  </h3>
                  {post.content.effectiveness.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-venue-dark mb-2">
                        {index + 1}. {item.title}
                      </h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                  
                  {post.content.caseStudy && (
                    <div className="bg-venue-lavender rounded-lg p-4 mt-6">
                      <h4 className="font-semibold text-venue-dark mb-2">
                        {post.content.caseStudy.title}
                      </h4>
                      <p className="text-gray-600">{post.content.caseStudy.description}</p>
                    </div>
                  )}
                </div>
              )}
              
              {post.content.oldWay && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-venue-dark">
                    The Old Way of Booking Venues
                  </h3>
                  <p className="text-gray-600">Traditionally, booking a venue meant:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {post.content.oldWay.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-venue-dark mt-6">
                    How Technology is Changing Venue Booking
                  </h3>
                  <div className="space-y-4">
                    {post.content.techChanges.map((change, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-venue-dark mb-2">
                          {index + 1}. {change.title}
                        </h4>
                        <p className="text-gray-600">{change.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Blog() {
  const [expandedPosts, setExpandedPosts] = React.useState(new Set());

  const togglePost = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop')"
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">
              Planzia Blog
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Insights, tips, and trends in event venue booking and the future of event planning.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <BookOpen className="h-4 w-4 mr-1" />
                Industry Insights
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                Market Trends
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Eye className="h-4 w-4 mr-1" />
                Expert Analysis
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-venue-dark mb-4">
              Latest Articles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest insights and trends in the event venue industry
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                isExpanded={expandedPosts.has(post.id)}
                onToggle={togglePost}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-venue-lavender">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-venue-dark mb-6">
            Ready to Transform Your Event Planning?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who have discovered the Planzia advantage. Start planning your next event today.
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
        </div>
      </section>
    </div>
  );
}
