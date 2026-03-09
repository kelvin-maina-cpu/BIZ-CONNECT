import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, ArrowRight, Briefcase } from 'lucide-react';

export default function Gig3DCarousel({ gigs = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg']);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHoveredIndex(null);
  };

  // Default gigs if none provided
  const defaultGigs = [
    {
      _id: '1',
      title: 'React Developer for E-commerce Platform',
      description: 'Looking for an experienced React developer to build a modern, responsive e-commerce platform with payment integration.',
      category: 'Web Development',
      budget: { min: 1000, max: 3000 },
      deadline: '2024-12-31',
      location: 'Remote',
      createdAt: new Date().toISOString(),
      client: { profile: { firstName: 'Tech', lastName: 'Corp' } },
      applicationsCount: 5
    },
    {
      _id: '2',
      title: 'UI/UX Designer for Mobile App',
      description: 'Need a creative UI/UX designer to design a fitness tracking mobile application. Must have experience with Figma.',
      category: 'Design',
      budget: { min: 800, max: 1500 },
      deadline: '2024-11-15',
      location: 'Remote',
      createdAt: new Date().toISOString(),
      client: { profile: { firstName: 'Fit', lastName: 'Life' } },
      applicationsCount: 12
    },
    {
      _id: '3',
      title: 'Content Writer for Tech Blog',
      description: 'Seeking a tech-savvy content writer to create engaging articles about AI, blockchain, and emerging technologies.',
      category: 'Writing',
      budget: { min: 50, max: 100 },
      deadline: '2024-10-30',
      location: 'Remote',
      createdAt: new Date().toISOString(),
      client: { profile: { firstName: 'Tech', lastName: 'Daily' } },
      applicationsCount: 8
    }
  ];

  const displayGigs = gigs.length > 0 ? gigs : defaultGigs;

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Featured Opportunities
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hand-picked opportunities waiting for your skills and expertise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayGigs.map((gig, index) => (
            <motion.div
              key={gig._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={`/gigs/${gig._id}`}>
                <motion.div
                  ref={index === 0 ? containerRef : null}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseEnter={() => setHoveredIndex(index)}
                  style={{
                    rotateX: hoveredIndex === index ? rotateX : 0,
                    rotateY: hoveredIndex === index ? rotateY : 0,
                    transformStyle: 'preserve-3d',
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer h-full"
                >
                  {/* Gradient border on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} style={{ padding: '2px' }}>
                    <div className="w-full h-full bg-white rounded-2xl" />
                  </div>

                  {/* Card Content */}
                  <div className="relative p-6 h-full flex flex-col" style={{ transform: 'translateZ(20px)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <motion.span 
                        className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        {gig.category}
                      </motion.span>
                      <span className="text-sm text-gray-500">
                        {new Date(gig.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {gig.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{gig.description}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">${gig.budget.min.toLocaleString()} - ${gig.budget.max.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-orange-500" />
                        Due {new Date(gig.deadline).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-red-500" />
                        {gig.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {gig.client?.profile?.firstName?.[0]}{gig.client?.profile?.lastName?.[0]}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {gig.client?.profile?.firstName} {gig.client?.profile?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">Verified Client</p>
                        </div>
                      </div>
                      <motion.div
                        className="flex items-center text-blue-600 font-medium text-sm"
                        whileHover={{ x: 5 }}
                      >
                        View
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </motion.div>
                    </div>

                    {/* Applications badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-600 shadow-sm">
                      {gig.applicationsCount} applications
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-white/0 pointer-events-none"
                    initial={{ x: '-100%', y: '-100%' }}
                    animate={hoveredIndex === index ? { x: '100%', y: '100%' } : { x: '-100%', y: '-100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/gigs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              View All Opportunities
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
