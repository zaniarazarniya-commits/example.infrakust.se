import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Waves, Leaf, Utensils, Mountain } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    id: 'suites',
    title: 'Cliffside Suites',
    description:
      'Each of our twelve individually designed suites opens onto a private balcony suspended above the Mediterranean. Floor-to-ceiling windows frame uninterrupted sea views, while hand-painted Vietri ceramic tiles in cobalt blue and gold add authentic Amalfi craftsmanship to every surface.',
    image: '/assets/suite-interior.jpg',
    icon: Waves,
    detail: '12 Suites \u00b7 Private Balconies \u00b7 Sea Views',
  },
  {
    id: 'spa',
    title: 'Limonaia Spa',
    description:
      'Housed in a lovingly restored 18th-century lemon house, our spa offers treatments infused with locally grown lemon, olive, and herb essences. Ancient stone walls and arched windows create a cathedral of calm where time slows and the senses awaken.',
    image: '/assets/spa-limonaia.jpg',
    icon: Leaf,
    detail: 'Heritage Building \u00b7 Natural Essences \u00b7 Thermal Pool',
  },
  {
    id: 'dining',
    title: 'Cucina della Costa',
    description:
      'Our Michelin-adjacent restaurant celebrates the bounty of the Amalfi Coast. Chef Marco Vitiello crafts daily tasting menus featuring hand-caught seafood, sun-ripened heirloom tomatoes from our garden, and house-made pasta tossed with fragrant local basil.',
    image: '/assets/dining.jpg',
    icon: Utensils,
    detail: 'Tasting Menus \u00b7 Seafood \u00b7 Local Wine Pairing',
  },
  {
    id: 'experience',
    title: 'Sentiero degli Dei',
    description:
      'Discover the legendary Path of the Gods with our expert guides. This ancient mountain trail winds high above the coastline, offering breathtaking panoramas at every turn. We provide packed gourmet picnics with local cheeses, cured meats, and freshly baked focaccia.',
    image: '/assets/path-of-gods.jpg',
    icon: Mountain,
    detail: 'Guided Hikes \u00b7 Gourmet Picnics \u00b7 Panoramic Views',
  },
]

export default function FeatureSections() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const triggers: ScrollTrigger[] = []

    sectionRefs.current.forEach((section) => {
      if (!section) return

      const image = section.querySelector('.feature-image') as HTMLElement
      const content = section.querySelector('.feature-content') as HTMLElement

      if (image) {
        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const scale = 1 + self.progress * 0.1
            gsap.set(image, { scale })
          },
        })
        triggers.push(st)
      }

      if (content) {
        gsap.fromTo(
          content,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    return () => {
      triggers.forEach((st) => st.kill())
    }
  }, [])

  return (
    <div className="bg-[#FAF3E0]">
      {features.map((feature, i) => {
        const Icon = feature.icon
        const isEven = i % 2 === 0

        return (
          <section
            key={feature.id}
            id={feature.id}
            ref={(el) => { sectionRefs.current[i] = el }}
            className="relative min-h-screen py-20 lg:py-0"
          >
            <div className={`max-w-7xl mx-auto px-6 lg:px-8 min-h-screen flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
              isEven ? '' : 'lg:flex-row-reverse'
            }`}>
              {/* Image */}
              <div className="w-full lg:w-3/5 h-[50vh] lg:h-[75vh] overflow-hidden rounded-lg relative">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="feature-image w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(12,36,59,0.3) 100%)' }}
                />
              </div>

              {/* Content */}
              <div className="feature-content w-full lg:w-2/5 space-y-6 opacity-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8A435]/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#E8A435]" />
                  </div>
                  <span className="font-mono-tech text-xs text-[#E8A435] tracking-wider uppercase">
                    {feature.detail}
                  </span>
                </div>

                <h2 className="font-display text-4xl lg:text-5xl text-[#1A4B7A] letter-tight">
                  {feature.title}
                </h2>

                <p className="font-body text-base lg:text-lg text-[#1A4B7A]/80 leading-relaxed">
                  {feature.description}
                </p>

                <button className="gold-underline font-body text-sm text-[#1A4B7A] tracking-wide pt-4 inline-flex items-center gap-2 group">
                  Learn More
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </button>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
