import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedNavbar from './components/navigation/AnimatedNavbar'
import AnimatedHero from './components/hero/AnimatedHero'
import InteractiveFeatures from './components/features/InteractiveFeatures'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

// Pages
import Dashboard from './pages/Dashboard'
import BrowseGigs from './pages/BrowseGigs'
import MyApplications from './pages/MyApplications'

// Auth
import Login from './components/auth/Login'
import Register from './components/auth/Register'

// Gigs
import GigDetail from './components/gigs/GigDetail'
import CreateGig from './components/gigs/CreateGig'

// Profile
import Profile from './components/profile/Profile'
import EditProfile from './components/profile/EditProfile'

// Messaging
import RealTimeChat from './components/messaging/RealTimeChat'

// Animation wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
)

function HomePage() {
  return (
    <>
      <AnimatedHero />
      <InteractiveFeatures />
    </>
  )
}

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className={`min-h-screen pt-24 ${isHome ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <AnimatedNavbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/gigs" element={<PageTransition><BrowseGigs /></PageTransition>} />
          <Route path="/gigs/:id" element={<PageTransition><GigDetail /></PageTransition>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/profile/edit" element={<PageTransition><EditProfile /></PageTransition>} />
            <Route path="/applications" element={<PageTransition><MyApplications /></PageTransition>} />
            <Route path="/chat" element={<PageTransition><RealTimeChat /></PageTransition>} />
            <Route path="/chat/:userId" element={<PageTransition><RealTimeChat /></PageTransition>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['client']} />}>
            <Route path="/gigs/create" element={<PageTransition><CreateGig /></PageTransition>} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default App
