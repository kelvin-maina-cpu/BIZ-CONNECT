import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ScrollReveal({ children, className = '', variants, threshold = 0.2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -150px 0px', amount: threshold })

  const defaultVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.99 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={variants ?? defaultVariants}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
