import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const data = [
  { name: 'Mon', earnings: 400, gigs: 2 },
  { name: 'Tue', earnings: 300, gigs: 1 },
  { name: 'Wed', earnings: 600, gigs: 3 },
  { name: 'Thu', earnings: 800, gigs: 4 },
  { name: 'Fri', earnings: 500, gigs: 2 },
  { name: 'Sat', earnings: 900, gigs: 5 },
  { name: 'Sun', earnings: 700, gigs: 3 },
]

const pieData = [
  { name: 'Completed', value: 65, color: '#3b82f6' },
  { name: 'In Progress', value: 25, color: '#8b5cf6' },
  { name: 'Pending', value: 10, color: '#f59e0b' },
]

const stats = [
  {
    title: 'Total Earnings',
    value: '$4,200',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-green-400 to-emerald-600',
  },
  {
    title: 'Active Gigs',
    value: '12',
    change: '+3',
    trend: 'up',
    icon: Briefcase,
    color: 'from-blue-400 to-blue-600',
  },
  {
    title: 'Profile Views',
    value: '1,234',
    change: '+18.2%',
    trend: 'up',
    icon: Users,
    color: 'from-purple-400 to-purple-600',
  },
  {
    title: 'Response Rate',
    value: '94%',
    change: '-2%',
    trend: 'down',
    icon: TrendingUp,
    color: 'from-orange-400 to-red-600',
  },
]

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('week')

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span
                className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
            <div className="flex space-x-2">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEarnings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Side Stats */}
        <div className="space-y-6">
          {/* Completion Rate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate</h3>
            <div className="w-32 h-32 mx-auto">
              <CircularProgressbar
                value={85}
                text="85%"
                styles={buildStyles({
                  pathColor: '#3b82f6',
                  textColor: '#1f2937',
                  trailColor: '#e5e7eb',
                  textSize: '24px',
                  fontWeight: 'bold',
                })}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">Great job! Keep it up!</p>
          </motion.div>

          {/* Gig Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gig Status</h3>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New gig application received</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">New</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
