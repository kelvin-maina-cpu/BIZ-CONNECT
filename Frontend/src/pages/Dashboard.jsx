import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MessageSquare, 
  User, 
  TrendingUp, 
  DollarSign,
  Star,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const isStudent = user?.role === 'student';
  const isClient = user?.role === 'client';

  const stats = [
    { 
      title: isStudent ? "Applied Gigs" : "Active Gigs", 
      value: "12", 
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      link: isStudent ? "/applications" : "/gigs/my-gigs"
    },
    { 
      title: "Messages", 
      value: "5", 
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
      link: "/chat"
    },
    { 
      title: isStudent ? "Success Rate" : "Hire Rate", 
      value: "85%", 
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      link: "#"
    },
    { 
      title: "Profile Views", 
      value: "234", 
      icon: User,
      color: "from-orange-500 to-orange-600",
      link: "/profile"
    },
  ];

  const recentActivity = [
    { type: 'application', title: 'New application received', time: '2 hours ago', gig: 'React Developer Position' },
    { type: 'message', title: 'New message from John Doe', time: '5 hours ago', preview: 'Thanks for your interest...' },
    { type: 'gig', title: 'Gig status updated', time: '1 day ago', gig: 'UI/UX Designer' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user?.profile?.firstName}! 👋
            </h1>
            <p className="text-white/80">
              {isStudent 
                ? 'You have 3 new gig recommendations waiting for you' 
                : 'You have 2 new applications to review'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          {isClient && (
            <Link to="/gigs/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Post a New Gig
              </motion.button>
            </Link>
          )}
          <Link to="/gigs">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Browse Gigs
            </motion.button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-500">{stat.title}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <Link to="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                      activity.type === 'application' ? 'bg-blue-100' :
                      activity.type === 'message' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'application' ? <Briefcase className="h-5 w-5 text-blue-600" /> :
                       activity.type === 'message' ? <MessageSquare className="h-5 w-5 text-green-600" /> :
                       <Star className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">
                        {activity.gig || activity.preview || ''}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommended Gigs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {isStudent ? 'Recommended for You' : 'Your Active Gigs'}
                </h2>
                <Link to="/gigs" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Senior React Developer</h4>
                        <p className="text-sm text-gray-500">TechCorp • Remote • $5k-8k</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-200 transition-colors"
                    >
                      {isStudent ? 'Apply' : 'View'}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </h3>
                <p className="text-gray-500 capitalize mb-4">{user?.role}</p>
                
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.9)</span>
                </div>

                <Link to="/profile/edit">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 transition-colors"
                  >
                    Edit Profile
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Earnings/Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-sm p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white/90">
                  {isStudent ? 'Total Earnings' : 'Total Spent'}
                </h3>
                <DollarSign className="h-5 w-5 text-white/70" />
              </div>
              <p className="text-3xl font-bold mb-2">$4,250</p>
              <p className="text-sm text-white/70">+12% from last month</p>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">This Week</span>
                  <span className="font-medium">$850</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
