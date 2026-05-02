import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="font-display text-8xl text-[#1A4B7A] letter-tight">404</h1>
        <p className="font-display text-xl text-[#1A4B7A]/70 italic">
          Even the Path of the Gods has its dead ends.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 btn-gold mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Terrazza di Sole
        </Link>
      </div>
    </div>
  )
}
