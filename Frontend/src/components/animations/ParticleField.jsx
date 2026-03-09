import { useEffect, useRef } from 'react'

export default function ParticleField({ particleCount = 80, color = 'rgba(255,255,255,0.8)', className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight
    let animationFrameId

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4
        this.radius = Math.random() * 1.4 + 0.6
        this.alpha = Math.random() * 0.6 + 0.2
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`
        ctx.fill()
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle())

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })
      animationFrameId = requestAnimationFrame(drawFrame)
    }

    resize()
    window.addEventListener('resize', resize)
    drawFrame()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount])

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 ${className}`} />
}
