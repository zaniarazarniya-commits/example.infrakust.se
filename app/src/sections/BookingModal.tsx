import { useState } from 'react'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import { X, Calendar, Users, CreditCard, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface BookingModalProps {
  open: boolean
  onClose: () => void
}

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [roomId, setRoomId] = useState<number | null>(null)
  const [specialRequests, setSpecialRequests] = useState('')
  const [processing, setProcessing] = useState(false)

  const { data: rooms } = trpc.room.list.useQuery()

  const createBooking = trpc.booking.create.useMutation({
    onSuccess: () => {
      setStep('success')
      toast.success('Booking request submitted!')
    },
    onError: (err) => {
      toast.error(err.message)
      setProcessing(false)
    },
  })

  const createPayment = trpc.payment.createIntent.useMutation()

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      onClose()
      return
    }
    if (!roomId || !checkIn || !checkOut) {
      toast.error('Please fill in all required fields')
      return
    }

    setProcessing(true)

    const selectedRoom = rooms?.find((r) => r.id === roomId)
    if (!selectedRoom) return

    const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    const totalAmount = Number(selectedRoom.pricePerNight) * nights

    try {
      await createBooking.mutateAsync({
        roomId,
        checkIn,
        checkOut,
        guests,
        totalAmount,
        specialRequests: specialRequests || undefined,
      })

      // Mock payment
      await createPayment.mutateAsync({
        amount: totalAmount,
        currency: 'EUR',
      })

      setProcessing(false)
    } catch {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg bg-[#FAF3E0] border border-[#E8A435]/30 shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-[#1A4B7A] p-6">
          <DialogTitle className="font-display text-2xl text-[#FAF3E0] flex items-center justify-between">
            {step === 'details' && 'Reserve Your Stay'}
            {step === 'payment' && 'Payment Details'}
            {step === 'success' && 'Booking Confirmed'}
            <button onClick={onClose} className="text-[#FAF3E0]/70 hover:text-[#FAF3E0]">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
          <p className="font-body text-sm text-[#FAF3E0]/70 mt-1">
            {step === 'details' && 'Select your dates and preferred suite'}
            {step === 'success' && 'We look forward to welcoming you'}
          </p>
        </DialogHeader>

        {step === 'details' && (
          <div className="p-6 space-y-5">
            {/* Room selection */}
            <div>
              <label className="font-body text-sm text-[#1A4B7A] font-medium mb-2 block">Select Suite</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {rooms?.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setRoomId(room.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                      roomId === room.id
                        ? 'border-[#E8A435] bg-[#E8A435]/10'
                        : 'border-[#1A4B7A]/15 hover:border-[#E8A435]/50'
                    }`}
                  >
                    <div>
                      <p className="font-body text-sm text-[#1A4B7A] font-medium">{room.name}</p>
                      <p className="font-body text-xs text-[#1A4B7A]/60">Up to {room.maxGuests} guests</p>
                    </div>
                    <span className="font-mono-tech text-sm text-[#E8A435]">&euro;{room.pricePerNight}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-[#1A4B7A] font-medium mb-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Check In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#1A4B7A]/15 bg-white font-body text-sm text-[#1A4B7A] focus:border-[#E8A435] focus:outline-none"
                />
              </div>
              <div>
                <label className="font-body text-sm text-[#1A4B7A] font-medium mb-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Check Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#1A4B7A]/15 bg-white font-body text-sm text-[#1A4B7A] focus:border-[#E8A435] focus:outline-none"
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="font-body text-sm text-[#1A4B7A] font-medium mb-2 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-[#1A4B7A]/15 bg-white font-body text-sm text-[#1A4B7A] focus:border-[#E8A435] focus:outline-none"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            {/* Special requests */}
            <div>
              <label className="font-body text-sm text-[#1A4B7A] font-medium mb-2">Special Requests</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requests or preferences..."
                rows={2}
                className="w-full p-3 rounded-lg border border-[#1A4B7A]/15 bg-white font-body text-sm text-[#1A4B7A] placeholder:text-[#1A4B7A]/40 focus:border-[#E8A435] focus:outline-none resize-none"
              />
            </div>

            {/* Price summary */}
            {roomId && checkIn && checkOut && (
              <div className="p-3 rounded-lg bg-[#E8A435]/10 border border-[#E8A435]/20">
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm text-[#1A4B7A]">
                    {Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))} nights
                  </span>
                  <span className="font-mono-tech text-lg text-[#E8A435]">
                    &euro;{(Number(rooms?.find((r) => r.id === roomId)?.pricePerNight || 0) * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(0)}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={processing}
              className="w-full btn-terracotta py-3.5 flex items-center justify-center gap-2"
            >
              {processing ? (
                <span className="animate-spin w-5 h-5 border-2 border-[#FAF3E0]/30 border-t-[#FAF3E0] rounded-full" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  {isAuthenticated ? 'Proceed to Payment' : 'Sign In to Book'}
                </>
              )}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#5A8F6E]/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#5A8F6E]" />
            </div>
            <h3 className="font-display text-2xl text-[#1A4B7A]">Grazie!</h3>
            <p className="font-body text-sm text-[#1A4B7A]/70">
              Your reservation request has been received. Our concierge will contact you shortly to confirm your stay.
            </p>
            <button onClick={onClose} className="btn-gold mt-4">
              Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
