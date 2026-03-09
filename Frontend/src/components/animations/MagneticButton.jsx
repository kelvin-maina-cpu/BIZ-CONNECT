import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MagneticButton({ children, className = '', as = 'button', ...props }) {
  const ref = useRef(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const MotionComponent = typeof as === 'string' ? motion[as] || motion.button : motion(as)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setMouse({ x, y })
    }

    const handleMouseLeave = () => {
      setOffset({ x: 0, y: 0 })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const distanceX = (mouse.x - centerX) / centerX
    const distanceY = (mouse.y - centerY) / centerY

    setOffset({ x: distanceX * 10, y: distanceY * 10 })
  }, [mouse])

  return (
    <MotionComponent
      ref={ref}
      type={as === 'button' ? 'button' : undefined}
      className={`relative overflow-hidden rounded-lg px-6 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        className
      }`}
      animate={{ x: offset.x, y: offset.y }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
      <span className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-black/10 opacity-0 transition group-hover:opacity-100" />
    </MotionComponent>
  )
}
