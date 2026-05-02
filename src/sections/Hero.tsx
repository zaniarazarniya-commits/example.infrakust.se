import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ChevronDown } from 'lucide-react'

interface HeroProps {
  onBookClick: () => void
}

export default function Hero({ onBookClick }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      tl.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      )
        .fromTo(
          taglineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.3'
        )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ animation: 'kenBurns 20s ease-in-out infinite alternate' }}
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(12,36,59,0.25) 0%, rgba(12,36,59,0.1) 40%, rgba(12,36,59,0.4) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <h1
          ref={titleRef}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-[#FAF3E0] letter-tight tracking-wide opacity-0"
          style={{ textShadow: '2px 4px 20px rgba(10, 30, 50, 0.4)' }}
        >
          TERRAZZA DI SOLE
        </h1>
        <p
          ref={taglineRef}
          className="mt-4 sm:mt-6 font-display text-lg sm:text-xl md:text-2xl text-[#FAF3E0]/90 italic tracking-wider opacity-0"
          style={{ textShadow: '1px 2px 10px rgba(10, 30, 50, 0.3)' }}
        >
          La dolce vita, elevated.
        </p>
        <button
          ref={ctaRef}
          onClick={onBookClick}
          className="mt-8 sm:mt-10 opacity-0"
          style={{
            padding: '14px 36px',
            borderRadius: '3rem',
            backgroundColor: '#C75B39',
            color: '#FAF3E0',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(199, 91, 57, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(199, 91, 57, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(199, 91, 57, 0.3)'
          }}
        >
          Reserve Your Terrazza
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-body text-xs text-[#FAF3E0]/70 tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 text-[#FAF3E0]/70" />
      </div>

      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
      `}</style>
    </section>
  )
}
