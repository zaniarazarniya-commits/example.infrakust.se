import { useState } from 'react'
import Navigation from '@/sections/Navigation'
import Hero from '@/sections/Hero'
import ConceptScroller from '@/sections/ConceptScroller'
import FeatureSections from '@/sections/FeatureSections'
import ExperienceSection from '@/sections/ExperienceSection'
import Footer from '@/sections/Footer'
import BookingModal from '@/sections/BookingModal'
import { Toaster } from '@/components/ui/sonner'

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-[#FAF3E0]">
      <Navigation onBookClick={() => setBookingOpen(true)} />
      <Hero onBookClick={() => setBookingOpen(true)} />
      <ConceptScroller />
      <FeatureSections />
      <ExperienceSection />
      <Footer onBookClick={() => setBookingOpen(true)} />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      <Toaster position="top-center" />
    </div>
  )
}
