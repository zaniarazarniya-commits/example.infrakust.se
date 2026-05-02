import { useState } from 'react'
import { trpc } from '@/providers/trpc'
import { toast } from 'sonner'
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Send,
  Clock,
  Star,
} from 'lucide-react'

interface FooterProps {
  onBookClick: () => void
}

export default function Footer({ onBookClick }: FooterProps) {
  const [email, setEmail] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactSubject, setContactSubject] = useState('')
  const [contactMessage, setContactMessage] = useState('')

  const subscribeMutation = trpc.contact.create.useMutation({
    onSuccess: () => {
      toast.success('Subscribed to our newsletter!')
      setEmail('')
    },
  })

  const contactMutation = trpc.contact.create.useMutation({
    onSuccess: () => {
      toast.success('Message sent! We will get back to you soon.')
      setContactName('')
      setContactEmail('')
      setContactSubject('')
      setContactMessage('')
    },
  })

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    subscribeMutation.mutate({
      name: 'Newsletter Subscriber',
      email,
      subject: 'Newsletter Subscription',
      message: `Subscribe ${email} to newsletter`,
    })
  }

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName || !contactEmail || !contactMessage) return
    contactMutation.mutate({
      name: contactName,
      email: contactEmail,
      subject: contactSubject || undefined,
      message: contactMessage,
    })
  }

  const landmarks = [
    { name: 'Amalfi', x: 35, y: 60, desc: 'Historic maritime republic' },
    { name: 'Positano', x: 55, y: 75, desc: 'Vertical pastel village' },
    { name: 'Ravello', x: 65, y: 35, desc: 'Terrazza di Sole' },
    { name: 'Sorrento', x: 25, y: 85, desc: 'Lemon groves and cliffs' },
    { name: 'Capri', x: 70, y: 90, desc: 'Island of glamour' },
  ]

  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null)

  return (
    <footer id="contact" className="bg-[#1A4B7A] text-[#FAF3E0]">
      {/* Vintage Map Section */}
      <div className="relative py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl text-[#E8A435]">Find Your Way to Us</h2>
            <p className="font-body text-sm text-[#FAF3E0]/60 mt-2">
              Perched above Ravello on the Amalfi Coast
            </p>
          </div>

          {/* Illustrated Map */}
          <div className="relative mx-auto max-w-3xl aspect-[16/9] bg-[#0C243B] rounded-xl overflow-hidden border border-[#E8A435]/20">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              {/* Sea */}
              <defs>
                <pattern id="waves" patternUnits="userSpaceOnUse" width="8" height="4">
                  <path d="M0,2 Q2,0 4,2 Q6,4 8,2" fill="none" stroke="#1A4B7A" strokeWidth="0.3" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="#0C243B" />
              <rect width="100" height="55" fill="url(#waves)" opacity="0.3" />

              {/* Coastline */}
              <path
                d="M0,45 Q15,42 25,38 Q40,33 50,35 Q60,37 70,32 Q80,28 90,30 Q95,31 100,28 L100,0 L0,0 Z"
                fill="#F0EDE1"
                opacity="0.9"
              />
              <path
                d="M0,45 Q15,42 25,38 Q40,33 50,35 Q60,37 70,32 Q80,28 90,30 Q95,31 100,28"
                fill="none"
                stroke="#C75B39"
                strokeWidth="0.5"
                opacity="0.6"
              />

              {/* Mountains */}
              <path d="M55,25 L60,15 L65,22 L70,12 L75,20" fill="none" stroke="#5A8F6E" strokeWidth="0.4" opacity="0.5" />
              <path d="M75,22 L80,10 L85,18" fill="none" stroke="#5A8F6E" strokeWidth="0.4" opacity="0.5" />

              {/* Roads */}
              <path
                d="M25,38 Q35,45 45,50 Q55,58 65,55"
                fill="none"
                stroke="#E8A435"
                strokeWidth="0.3"
                strokeDasharray="1,1"
                opacity="0.5"
              />
              <path
                d="M45,50 Q50,65 55,75"
                fill="none"
                stroke="#E8A435"
                strokeWidth="0.3"
                strokeDasharray="1,1"
                opacity="0.5"
              />

              {/* Hotel marker */}
              <circle cx="65" cy="35" r="2" fill="#E8A435" opacity="0.8">
                <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="65" cy="35" r="1" fill="#FAF3E0" />

              {/* Other landmarks */}
              {landmarks.map((lm) => (
                <g key={lm.name}>
                  <circle cx={lm.x} cy={lm.y} r="1.2" fill="#C75B39" opacity="0.7" />
                  <circle cx={lm.x} cy={lm.y} r="0.6" fill="#FAF3E0" />
                </g>
              ))}
            </svg>

            {/* Landmark labels */}
            {landmarks.map((lm) => (
              <button
                key={lm.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${lm.x}%`, top: `${lm.y}%` }}
                onMouseEnter={() => setHoveredLandmark(lm.name)}
                onMouseLeave={() => setHoveredLandmark(null)}
              >
                {hoveredLandmark === lm.name && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#FAF3E0] rounded-lg shadow-lg whitespace-nowrap z-20">
                    <p className="font-body text-xs text-[#1A4B7A] font-semibold">{lm.name}</p>
                    <p className="font-body text-[10px] text-[#1A4B7A]/60">{lm.desc}</p>
                  </div>
                )}
              </button>
            ))}

            {/* Hotel label */}
            <div className="absolute" style={{ left: '68%', top: '30%' }}>
              <div className="px-2 py-1 bg-[#E8A435] rounded text-[10px] font-body font-semibold text-[#0C243B]">
                Terrazza di Sole
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Footer Info */}
      <div className="border-t border-[#FAF3E0]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Hotel Info */}
            <div className="space-y-4">
              <h3 className="font-display text-xl text-[#E8A435]">Terrazza di Sole</h3>
              <p className="font-body text-sm text-[#FAF3E0]/70 leading-relaxed">
                A boutique cliffside hotel perched above the Amalfi Coast, where la dolce vita meets effortless luxury.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#FAF3E0]/70">
                  <MapPin className="w-4 h-4 text-[#E8A435]" />
                  <span className="font-body">Via Smeraldo 7, Ravello, Italy</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#FAF3E0]/70">
                  <Phone className="w-4 h-4 text-[#E8A435]" />
                  <span className="font-body">+39 089 871 211</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#FAF3E0]/70">
                  <Mail className="w-4 h-4 text-[#E8A435]" />
                  <span className="font-body">concierge@terrazzadisole.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#FAF3E0]/70">
                  <Clock className="w-4 h-4 text-[#E8A435]" />
                  <span className="font-body">Check-in: 3PM / Check-out: 11AM</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-body text-sm font-semibold tracking-wider uppercase text-[#E8A435]">Explore</h4>
              <div className="space-y-2">
                {['Suites', 'Spa', 'Dining', 'Experiences', 'Gallery'].map((link) => (
                  <button
                    key={link}
                    onClick={() => {
                      const el = document.querySelector(`#${link.toLowerCase()}`)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="block font-body text-sm text-[#FAF3E0]/70 hover:text-[#E8A435] transition-colors"
                  >
                    {link}
                  </button>
                ))}
                <button
                  onClick={onBookClick}
                  className="block font-body text-sm text-[#E8A435] hover:text-[#FAF3E0] transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
              <h4 className="font-body text-sm font-semibold tracking-wider uppercase text-[#E8A435]">Get in Touch</h4>
              <form onSubmit={handleContact} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0C243B] border border-[#FAF3E0]/10 text-sm font-body text-[#FAF3E0] placeholder:text-[#FAF3E0]/30 focus:border-[#E8A435] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0C243B] border border-[#FAF3E0]/10 text-sm font-body text-[#FAF3E0] placeholder:text-[#FAF3E0]/30 focus:border-[#E8A435] focus:outline-none"
                />
                <textarea
                  placeholder="Message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-[#0C243B] border border-[#FAF3E0]/10 text-sm font-body text-[#FAF3E0] placeholder:text-[#FAF3E0]/30 focus:border-[#E8A435] focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full py-2 rounded-lg bg-[#E8A435] text-[#0C243B] font-body text-sm font-semibold hover:bg-[#FAF3E0] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="font-body text-sm font-semibold tracking-wider uppercase text-[#E8A435]">Newsletter</h4>
              <p className="font-body text-sm text-[#FAF3E0]/70">
                Receive seasonal offers and stories from the Amalfi Coast.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#0C243B] border border-[#FAF3E0]/10 text-sm font-body text-[#FAF3E0] placeholder:text-[#FAF3E0]/30 focus:border-[#E8A435] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#C75B39] text-[#FAF3E0] hover:bg-[#E8602A] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Social */}
              <div className="flex items-center gap-4 pt-4">
                <a href="#" className="text-[#FAF3E0]/50 hover:text-[#E8A435] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-[#FAF3E0]/50 hover:text-[#E8A435] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-[#FAF3E0]/50 hover:text-[#E8A435] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>

              {/* Review CTA */}
              <button
                onClick={() => {
                  toast.info('Reviews coming soon!')
                }}
                className="flex items-center gap-2 mt-4 text-sm text-[#E8A435] hover:text-[#FAF3E0] transition-colors"
              >
                <Star className="w-4 h-4" />
                <span className="font-body">Leave a Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#FAF3E0]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-[#FAF3E0]/40">
            &copy; 2026 Terrazza di Sole. All rights reserved. Via Smeraldo 7, Ravello, Amalfi Coast, Italy.
          </p>
          <div className="flex items-center gap-4">
            <button className="font-body text-xs text-[#FAF3E0]/40 hover:text-[#FAF3E0]/70 transition-colors">
              Privacy Policy
            </button>
            <button className="font-body text-xs text-[#FAF3E0]/40 hover:text-[#FAF3E0]/70 transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
