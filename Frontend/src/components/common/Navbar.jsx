import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'
import { Bell, Briefcase, MessageSquare, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const { unreadMessages, pendingApplications } = useNotifications({ enabled: isAuthenticated })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Biz Connet</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/gigs" className="text-gray-600 hover:text-gray-900">Browse Gigs</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link to="/chat" className="relative text-gray-600 hover:text-gray-900">
                  <MessageSquare className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xxs font-semibold text-white">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <User className="h-5 w-5" />
                    <span>{user?.profile?.firstName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    {user?.role === 'client' && (
                      <Link to="/gigs/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Post a Gig
                      </Link>
                    )}
                    <Link to="/applications" className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Applications
                      {pendingApplications > 0 && (
                        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-600 px-2 text-[11px] font-semibold text-white">
                          {pendingApplications > 9 ? '9+' : pendingApplications}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/gigs" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              Browse Gigs
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/profile" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 text-primary-600 font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
