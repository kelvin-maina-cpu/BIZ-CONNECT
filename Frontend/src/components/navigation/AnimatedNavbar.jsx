import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu as MenuIcon, X, ChevronDown } from 'lucide-react'
import { Menu, Transition } from '@headlessui/react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'

export default function AnimatedNavbar({ links: initialLinks } = {}) {
  const { user, logout, isAuthenticated } = useAuth()
  const { unreadMessages, pendingApplications } = useNotifications({ enabled: isAuthenticated })
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const links = useMemo(
    () =>
      initialLinks ?? [
        { to: '/gigs', label: 'Browse Gigs' },
        ...(isAuthenticated
          ? [
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/chat', label: 'Chat', badge: unreadMessages },
            ]
          : []),
      ],
    [initialLinks, isAuthenticated, unreadMessages]
  )

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  const linkVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
  }

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? 'bg-slate-950/80 shadow-xl backdrop-blur-xl' : 'bg-slate-900/50 backdrop-blur'
      }`}
    >
      <div className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 ${scrolled ? 'py-2' : 'py-3'}`}>
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
            B
          </span>
          <span className="hidden sm:inline">Biz Connet</span>
        </Link>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <MenuIcon size={20} />}
        </button>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link, idx) => (
            <motion.div key={link.to} custom={idx} variants={linkVariants}>
              <Link
                to={link.to}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(link.to)
                    ? 'text-white before:absolute before:-bottom-2 before:left-1/2 before:h-1 before:w-8 before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-r before:from-indigo-400 before:to-purple-400'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                {link.badge > 0 ? (
                  <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-2 text-[10px] font-semibold text-white">
                    {link.badge > 9 ? '9+' : link.badge}
                  </span>
                ) : null}
              </Link>
            </motion.div>
          ))}

          {user ? (
            <Menu as="div" className="relative">
              <Menu.Button className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                <span>{user?.profile?.firstName || 'User'}</span>
                <ChevronDown className="h-4 w-4" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white/95 p-2 shadow-lg ring-1 ring-black/10 backdrop-blur">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`block rounded-md px-3 py-2 text-sm ${
                          active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                        }`}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  {user?.role === 'client' ? (
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/gigs/create"
                          className={`block rounded-md px-3 py-2 text-sm ${
                            active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                          }`}
                        >
                          Post a Gig
                        </Link>
                      )}
                    </Menu.Item>
                  ) : null}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/applications"
                        className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                          active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                        }`}
                      >
                        Applications
                        {pendingApplications > 0 ? (
                          <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-2 text-[10px] font-semibold text-white">
                            {pendingApplications > 9 ? '9+' : pendingApplications}
                          </span>
                        ) : null}
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left rounded-md px-3 py-2 text-sm ${
                          active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                        }`}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link
              to="/register"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-slate-950/70 backdrop-blur"
          >
            <div className="space-y-1 px-4 pb-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="relative block rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  {link.label}
                  {link.badge > 0 ? (
                    <span className="absolute top-2 right-3 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-2 text-[10px] font-semibold text-white">
                      {link.badge > 9 ? '9+' : link.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Profile
                  </Link>
                  {user?.role === 'client' ? (
                    <Link
                      to="/gigs/create"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Post a Gig
                    </Link>
                  ) : null}
                  <Link
                    to="/applications"
                    onClick={() => setOpen(false)}
                    className="relative block rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Applications
                    {pendingApplications > 0 ? (
                      <span className="absolute top-2 right-3 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-2 text-[10px] font-semibold text-white">
                        {pendingApplications > 9 ? '9+' : pendingApplications}
                      </span>
                    ) : null}
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false)
                      handleLogout()
                    }}
                    className="w-full rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Sign Up
                </Link>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  )
}
