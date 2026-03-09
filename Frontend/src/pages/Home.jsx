import { Link } from 'react-router-dom'
import AnimatedBackground from '../components/animations/AnimatedBackground'
import ParticleField from '../components/animations/ParticleField'
import ScrollReveal from '../components/animations/ScrollReveal'
import MagneticButton from '../components/animations/MagneticButton'
import TextScramble from '../components/animations/TextScramble'

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />
      <ParticleField className="opacity-70" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col justify-center px-4 py-20">
        <ScrollReveal>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Welcome to{' '}
            <span className="text-indigo-400">
              <TextScramble text="Biz Connet" />
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">
            Discover campus gigs, connect with employers, and manage your applications with ease.
            Get started by browsing the latest opportunities or signing up for a profile.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <MagneticButton
              as={Link}
              to="/gigs"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30"
            >
              Browse Gigs
            </MagneticButton>
            <MagneticButton
              as={Link}
              to="/register"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-black/20"
            >
              Join Biz Connet
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
