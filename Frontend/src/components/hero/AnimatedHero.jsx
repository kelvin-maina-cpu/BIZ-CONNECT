import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Sparkles, Zap, Globe } from 'lucide-react'
import TextScramble from '../animations/TextScramble'
import MagneticButton from '../animations/MagneticButton'
import AppModal from '../common/Modal'
import ParticleField from '../animations/ParticleField'

export default function AnimatedHero() {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const springConfig = { damping: 25, stiffness: 150 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig)

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const stats = [
    { icon: Sparkles, value: '10K+', label: 'Students', color: 'from-yellow-400 to-orange-500' },
    { icon: Zap, value: '5K+', label: 'Projects', color: 'from-blue-400 to-cyan-500' },
    { icon: Globe, value: '500+', label: 'Companies', color: 'from-purple-400 to-pink-500' },
  ]

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative min-h-[75vh] pt-24 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
    >
      {/* Advanced particle background */}
      <ParticleField particleCount={120} className="opacity-40" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * -520],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          style={{ rotateX: isHovering ? rotateX : 0, rotateY: isHovering ? rotateY : 0 }}
          className="perspective-1000"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse" />
            <span className="text-sm text-white/80">Now connecting students globally</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="block text-white mb-2">EARN, Connect. &</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Collaborate.
            </span>
            <TextScramble text="BIZ." className="block text-white" />
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12"
          >
            The premier platform where ambitious students meet innovative companies. Turn your skills into opportunities.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <MagneticButton
              onClick={() => (window.location.href = '/register')}
              className="group relative px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </MagneticButton>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDemoOpen(true)}
              className="flex items-center px-8 py-4 border border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </motion.button>
          </motion.div>

          <AppModal isOpen={isDemoOpen} onRequestClose={() => setIsDemoOpen(false)} title="Biz Connet Demo">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              <video
                className="h-full w-full object-cover"
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                controls
                autoPlay
                muted
                loop
              />
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Explore the Biz Connet demo to see how students connect with gigs in real time.
            </p>
          </AppModal>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0], y: [0, 12] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
