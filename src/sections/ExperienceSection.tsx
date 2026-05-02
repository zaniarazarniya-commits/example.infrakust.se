import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ExperienceSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 })
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const COLORS = ['#C75B39', '#5A8F6E', '#E8A435', '#E8602A']

    const resize = () => {
      const rect = section.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    // Create offscreen canvas for text
    const textCanvas = document.createElement('canvas')
    const textCtx = textCanvas.getContext('2d')!
    const fontSize = Math.min(canvas.width * 0.18, 200)
    textCanvas.width = canvas.width
    textCanvas.height = canvas.height
    textCtx.font = `bold ${fontSize}px 'Playfair Display', serif`
    textCtx.fillStyle = 'white'
    textCtx.textAlign = 'center'
    textCtx.textBaseline = 'middle'
    textCtx.fillText('RELAX', canvas.width / 2, canvas.height / 2)

    const textData = textCtx.getImageData(0, 0, canvas.width, canvas.height)
    const particles: {
      x: number
      y: number
      prevX: number
      prevY: number
      velX: number
      velY: number
      speed: number
      color: string
      radius: number
      life: number
      maxLife: number
    }[] = []

    const spawnParticle = (mx: number, my: number) => {
      // Find nearby text pixels
      const searchRadius = 60
      const candidates: { x: number; y: number }[] = []

      for (let dy = -searchRadius; dy <= searchRadius; dy += 3) {
        for (let dx = -searchRadius; dx <= searchRadius; dx += 3) {
          const px = Math.floor(mx + dx)
          const py = Math.floor(my + dy)
          if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
            const idx = (py * canvas.width + px) * 4
            if (textData.data[idx + 3] > 128) {
              candidates.push({ x: px, y: py })
            }
          }
        }
      }

      if (candidates.length === 0) return

      const target = candidates[Math.floor(Math.random() * candidates.length)]

      particles.push({
        x: mx + (Math.random() - 0.5) * 20,
        y: my + (Math.random() - 0.5) * 20,
        prevX: mx,
        prevY: my,
        velX: (target.x - mx) * 0.02,
        velY: (target.y - my) * 0.02,
        speed: -Math.abs(Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        radius: Math.random() * 2 + 0.5,
        life: 0,
        maxLife: 60 + Math.random() * 60,
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(12, 36, 59, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const dx = mx - mouseRef.current.prevX
      const dy = my - mouseRef.current.prevY
      const speed = Math.sqrt(dx * dx + dy * dy)

      // Spawn particles when mouse moves
      if (speed > 2 && particles.length < 300) {
        const count = Math.min(Math.floor(speed / 3), 5)
        for (let i = 0; i < count; i++) {
          spawnParticle(mx, my)
        }
      }

      // Also auto-spawn random particles on the text
      if (Math.random() < 0.15 && particles.length < 200) {
        const rx = Math.random() * canvas.width
        const ry = Math.random() * canvas.height
        const idx = (Math.floor(ry) * canvas.width + Math.floor(rx)) * 4
        if (textData.data[idx + 3] > 128) {
          particles.push({
            x: rx,
            y: ry,
            prevX: rx,
            prevY: ry,
            velX: (Math.random() - 0.5) * 0.3,
            velY: (Math.random() - 0.5) * 0.3,
            speed: -Math.abs(Math.random() - 0.5) * 0.2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            radius: Math.random() * 1.5 + 0.3,
            life: 0,
            maxLife: 80 + Math.random() * 80,
          })
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.prevX = p.x
        p.prevY = p.y
        p.life++

        // Flow along text
        const px = Math.floor(p.x)
        const py = Math.floor(p.y)
        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
          const idx = (py * canvas.width + px) * 4
          if (textData.data[idx + 3] > 128) {
            // On text - follow the contour
            p.velX += (Math.random() - 0.5) * 0.3
            p.velY += (Math.random() - 0.5) * 0.3
          }
        }

        p.x += p.velX + Math.cos(p.speed) * 0.5
        p.y += p.velY + Math.sin(p.speed) * 0.5
        p.speed += (Math.random() - 0.5) * 0.05

        const opacity = Math.max(0, 1 - p.life / p.maxLife)

        ctx.strokeStyle = p.color
        ctx.globalAlpha = opacity * 0.6
        ctx.lineWidth = p.radius
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(p.prevX, p.prevY)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
        ctx.globalAlpha = 1

        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
        }
      }

      mouseRef.current.prevX = mx
      mouseRef.current.prevY = my

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    section.addEventListener('mousemove', handleMouseMove)

    // Fade in animation
    gsap.fromTo(
      section,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
      section.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[50vh] bg-[#0C243B] overflow-hidden cursor-crosshair"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Ambient text hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <p className="font-body text-xs text-[#FAF3E0]/30 tracking-widest uppercase">
          Move your cursor to paint
        </p>
      </div>
    </section>
  )
}
