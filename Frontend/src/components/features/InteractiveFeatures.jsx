import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Briefcase,
  MessageCircle,
  Shield,
  Zap,
  Award,
  ChevronRight,
} from 'lucide-react'
import ScrollReveal from '../animations/ScrollReveal'

const features = [
  {
    id: 'students',
    icon: Users,
    title: 'For Students',
    color: 'from-blue-500 to-cyan-500',
    description: 'Launch your career with real-world projects',
    details: [
      { title: 'Smart Matching', desc: 'AI-powered gig recommendations based on your skills' },
      { title: 'Portfolio Builder', desc: 'Showcase your work with integrated project galleries' },
      { title: 'Skill Verification', desc: 'Get certified and stand out to employers' },
      { title: 'Secure Payments', desc: 'Guaranteed payment protection for all your work' },
    ],
  },
  {
    id: 'clients',
    icon: Briefcase,
    title: 'For Clients',
    color: 'from-purple-500 to-pink-500',
    description: 'Access top university talent instantly',
    details: [
      { title: 'Talent Pool', desc: 'Browse verified students from top universities' },
      { title: 'Project Management', desc: 'Built-in tools to track progress and milestones' },
      { title: 'Quality Assurance', desc: 'Rigorous vetting ensures top-tier candidates' },
      { title: 'Flexible Hiring', desc: 'Hourly or fixed-price contracts that fit your needs' },
    ],
  },
  {
    id: 'platform',
    icon: Zap,
    title: 'Platform',
    color: 'from-orange-500 to-red-500',
    description: 'Powerful tools for seamless collaboration',
    details: [
      { title: 'Real-time Chat', desc: 'Instant messaging with file sharing capabilities' },
      { title: 'Video Calls', desc: 'Integrated video conferencing for interviews' },
      { title: 'Smart Contracts', desc: 'Automated agreements and milestone payments' },
      { title: 'Analytics', desc: 'Detailed insights into project performance' },
    ],
  },
]

export default function InteractiveFeatures() {
  const [activeTab, setActiveTab] = useState('students')

  return (
    <section className="py-16 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Features
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                succeed
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Powerful features designed to make collaboration seamless and productive
            </p>
          </div>
        </ScrollReveal>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-2 rounded-2xl shadow-lg inline-flex">
            {features.map((feature) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`relative px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  activeTab === feature.id ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeTab === feature.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-xl`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <feature.icon className="h-4 w-4" />
                  {feature.title}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {features.map(
            (feature) =>
              feature.id === activeTab && (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                  {/* Visual Side */}
                  <div className="relative">
                    <motion.div
                      className={`w-full aspect-square rounded-3xl bg-gradient-to-br ${feature.color} p-1`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-full h-full bg-white rounded-3xl p-8 flex items-center justify-center">
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ duration: 5, repeat: Infinity }}
                        >
                          <feature.icon
                            className={`w-32 h-32 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}
                            style={{
                              stroke: 'url(#gradient)',
                              strokeWidth: 1.5,
                            }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Floating Elements */}
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                    >
                      <Shield className="h-10 w-10 text-green-500" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 20, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                      className="absolute -bottom-6 -left-6 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                    >
                      <Award className="h-8 w-8 text-yellow-500" />
                    </motion.div>
                  </div>

                  {/* Details Side */}
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-lg text-gray-600 mb-8">{feature.description}</p>

                    <div className="space-y-4">
                      {feature.details.map((detail, index) => (
                        <ScrollReveal key={detail.title}>
                          <motion.div
                            whileHover={{ x: 10 }}
                            className="flex items-start p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                          >
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mr-4 flex-shrink-0`}
                            >
                              <ChevronRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{detail.title}</h4>
                              <p className="text-sm text-gray-600">{detail.desc}</p>
                            </div>
                          </motion.div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
