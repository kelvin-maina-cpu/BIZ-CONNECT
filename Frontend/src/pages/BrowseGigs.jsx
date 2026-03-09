import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, DollarSign, Clock, Briefcase, ChevronDown } from 'lucide-react';
import api from '../services/api';

export default function BrowseGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minBudget: '',
    maxBudget: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const scrollContainerRef = useRef(null);

  // Mock data for demo
  const mockGigs = [
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

  useEffect(() => {
    fetchGigs();
  }, [filters]);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      
      const { data } = await api.get(`/gigs?${params.toString()}`);
      setGigs(data.gigs || []);
    } catch (error) {
      console.log('Using mock data - backend not available');
      setGigs(mockGigs);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All Categories',
    'Web Development',
    'Mobile App',
    'Design',
    'Writing',
    'Marketing',
    'Data Entry',
    'Tutoring',
    'Research',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Find Your Next Opportunity
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80"
          >
            Browse hundreds of gigs from top companies
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search gigs, skills, or companies..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <select
                className="px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          <motion.div 
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.minBudget}
                  onChange={(e) => setFilters({...filters, minBudget: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget ($)</label>
                <input
                  type="number"
                  placeholder="10000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.maxBudget}
                  onChange={(e) => setFilters({...filters, maxBudget: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ search: '', category: '', minBudget: '', maxBudget: '' })}
                  className="w-full py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{gigs.length}</span> gigs
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="text-sm font-medium text-gray-900 bg-transparent focus:outline-none cursor-pointer">
              <option>Most Recent</option>
              <option>Highest Budget</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        {/* Gigs Grid - Added relative positioning */}
        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No gigs found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
          >
            {gigs.map((gig, index) => (
              <motion.div
                key={gig._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/gigs/${gig._id}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                          {gig.category}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(gig.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {gig.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{gig.description}</p>

                      <div className="space-y-2 mb-4">
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

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {gig.client?.profile?.firstName?.[0]}{gig.client?.profile?.lastName?.[0]}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {gig.client?.profile?.firstName} {gig.client?.profile?.lastName}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {gig.applicationsCount} applied
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
