import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scrollerImages = [
  {
    src: '/assets/suite-interior.jpg',
    title: 'Cliffside Suites',
    subtitle: 'Hand-painted Vietri ceramics and floor-to-ceiling sea views',
  },
  {
    src: '/assets/lemons.jpg',
    title: 'Lemon Grove',
    subtitle: 'Heritage Amalfi lemons in our terraced gardens',
  },
  {
    src: '/assets/spa-limonaia.jpg',
    title: 'Limonaia Spa',
    subtitle: '18th-century lemon house transformed into wellness sanctuary',
  },
  {
    src: '/assets/dining.jpg',
    title: 'Cucina della Costa',
    subtitle: 'Michelin-adjacent tasting menus with the sea as your backdrop',
  },
  {
    src: '/assets/path-of-gods.jpg',
    title: 'Sentiero degli Dei',
    subtitle: 'Guided hikes along the legendary Path of the Gods',
  },
  {
    src: '/assets/terrace-sunset.jpg',
    title: 'Golden Hour Terrace',
    subtitle: 'Where amber light meets the infinite Mediterranean',
  },
]

export default function ConceptScroller() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const container = containerRef.current
    if (!section || !container) return

    const items = container.querySelectorAll<HTMLElement>('.kinetic-item')
    const totalWidth = container.scrollWidth - window.innerWidth

    const ctx = gsap.context(() => {
      // Horizontal scroll
      gsap.to(container, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Individual item parallax
      items.forEach((item) => {
        const img = item.querySelector('img')
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.2 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                containerAnimation: gsap.getById?.('kinetic') as unknown as gsap.core.Animation,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
        }
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-[#0C243B]">
      {/* Left gradient overlay */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[15%] z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #0C243B, transparent)' }}
      />
      {/* Right gradient overlay */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[15%] z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #0C243B, transparent)' }}
      />

      <div ref={containerRef} className="kinetic-scroll-container h-full items-center pl-[10vw]">
        {scrollerImages.map((img, idx) => (
          <div
            key={idx}
            className="kinetic-item relative h-[70vh] flex-shrink-0 overflow-hidden rounded-lg"
            style={{ width: idx === 0 ? '45vw' : '35vw' }}
          >
            <img
              src={img.src}
              alt={img.title}
              className="w-full h-full object-cover"
            />
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6"
              style={{ background: 'linear-gradient(to top, rgba(12,36,59,0.85) 0%, transparent 60%)' }}
            >
              <h3 className="font-display text-2xl lg:text-3xl text-[#FAF3E0] letter-tight">
                {img.title}
              </h3>
              <p className="mt-2 font-body text-sm text-[#FAF3E0]/70 max-w-[90%]">
                {img.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
