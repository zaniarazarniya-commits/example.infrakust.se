import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'
import {
  Users,
  Calendar,
  Euro,
  MessageSquare,
  Star,
  Mail,
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  BedDouble,
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/')
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate])

  const { data: stats } = trpc.admin.stats.useQuery(undefined, { enabled: isAdmin })
  const { data: recentBookings } = trpc.admin.recentBookings.useQuery(undefined, { enabled: isAdmin })
  const { data: recentReviews } = trpc.admin.recentReviews.useQuery(undefined, { enabled: isAdmin })
  const { data: contactList } = trpc.contact.list.useQuery(undefined, { enabled: isAdmin })
  const { data: userList } = trpc.admin.userList.useQuery(undefined, { enabled: isAdmin })
  const { data: rooms } = trpc.room.list.useQuery()

  const utils = trpc.useUtils()

  const updateBooking = trpc.booking.update.useMutation({
    onSuccess: () => {
      utils.admin.stats.invalidate()
      utils.admin.recentBookings.invalidate()
      toast.success('Booking updated')
    },
  })

  const approveReview = trpc.review.approve.useMutation({
    onSuccess: () => {
      utils.admin.stats.invalidate()
      utils.admin.recentReviews.invalidate()
      toast.success('Review approved')
    },
  })

  const markRead = trpc.contact.markRead.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate()
      utils.admin.stats.invalidate()
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-[#E8A435] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAdmin) return null

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#1A4B7A' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: Calendar, color: '#E8A435' },
    { label: 'Revenue', value: `\u20ac${(stats?.totalRevenue || 0).toFixed(0)}`, icon: Euro, color: '#5A8F6E' },
    { label: 'Pending Reviews', value: stats?.pendingReviews || 0, icon: Star, color: '#C75B39' },
    { label: 'Unread Contacts', value: stats?.unreadContacts || 0, icon: Mail, color: '#E8602A' },
    { label: 'Total Rooms', value: stats?.totalRooms || 0, icon: BedDouble, color: '#1A4B7A' },
  ]

  return (
    <div className="min-h-screen bg-[#FAF3E0]">
      {/* Header */}
      <header className="bg-[#1A4B7A] text-[#FAF3E0] px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-[#FAF3E0]/70 hover:text-[#E8A435] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-body text-sm">Back</span>
            </Link>
            <div className="h-4 w-px bg-[#FAF3E0]/20" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#E8A435]" />
              <h1 className="font-display text-xl">Admin Dashboard</h1>
            </div>
          </div>
          <span className="font-body text-sm text-[#FAF3E0]/60">Terrazza di Sole</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="bg-white rounded-xl p-4 border border-[#E8A435]/10 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <p className="font-mono-tech text-2xl text-[#1A4B7A]">{card.value}</p>
                <p className="font-body text-xs text-[#1A4B7A]/50 mt-1">{card.label}</p>
              </div>
            )
          })}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-[#E8A435]/10 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1A4B7A]/5 flex items-center justify-between">
            <h2 className="font-display text-lg text-[#1A4B7A] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#E8A435]" />
              Recent Bookings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAF3E0]/50">
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A4B7A]/5">
                {recentBookings?.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#FAF3E0]/30">
                    <td className="px-6 py-4 font-mono-tech text-sm text-[#1A4B7A]">#{booking.id}</td>
                    <td className="px-6 py-4 font-body text-sm text-[#1A4B7A]">
                      {rooms?.find((r) => r.id === booking.roomId)?.name || `Room #${booking.roomId}`}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-[#1A4B7A]/70">
                      {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : '-'} &rarr; {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-[#1A4B7A]/70">{booking.guests}</td>
                    <td className="px-6 py-4 font-mono-tech text-sm text-[#E8A435]">&euro;{Number(booking.totalAmount).toFixed(0)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body ${
                        booking.status === 'confirmed'
                          ? 'bg-[#5A8F6E]/10 text-[#5A8F6E]'
                          : booking.status === 'pending'
                          ? 'bg-[#E8A435]/10 text-[#E8A435]'
                          : booking.status === 'cancelled'
                          ? 'bg-[#C75B39]/10 text-[#C75B39]'
                          : 'bg-[#1A4B7A]/10 text-[#1A4B7A]'
                      }`}>
                        {booking.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                        {booking.status === 'pending' && <Clock className="w-3 h-3" />}
                        {booking.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => updateBooking.mutate({ id: booking.id, status: 'confirmed' })}
                            className="px-3 py-1 rounded text-xs font-body bg-[#5A8F6E]/10 text-[#5A8F6E] hover:bg-[#5A8F6E]/20"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => updateBooking.mutate({ id: booking.id, status: 'cancelled' })}
                          className="px-3 py-1 rounded text-xs font-body bg-[#C75B39]/10 text-[#C75B39] hover:bg-[#C75B39]/20"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!recentBookings || recentBookings.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center font-body text-sm text-[#1A4B7A]/40">
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Reviews */}
          <div className="bg-white rounded-xl border border-[#E8A435]/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1A4B7A]/5 flex items-center justify-between">
              <h2 className="font-display text-lg text-[#1A4B7A] flex items-center gap-2">
                <Star className="w-5 h-5 text-[#E8A435]" />
                Reviews Pending Approval
              </h2>
            </div>
            <div className="divide-y divide-[#1A4B7A]/5 max-h-96 overflow-y-auto">
              {recentReviews?.filter((r) => !r.isApproved).map((review) => (
                <div key={review.id} className="px-6 py-4 hover:bg-[#FAF3E0]/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-body text-sm font-medium text-[#1A4B7A]">{review.userName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'text-[#E8A435] fill-[#E8A435]' : 'text-[#1A4B7A]/20'}`}
                          />
                        ))}
                      </div>
                      <p className="font-body text-xs text-[#1A4B7A]/60 mt-1 line-clamp-2">{review.comment}</p>
                    </div>
                    <button
                      onClick={() => approveReview.mutate({ id: review.id })}
                      className="px-3 py-1 rounded text-xs font-body bg-[#5A8F6E]/10 text-[#5A8F6E] hover:bg-[#5A8F6E]/20 whitespace-nowrap"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
              {(!recentReviews || recentReviews.filter((r) => !r.isApproved).length === 0) && (
                <div className="px-6 py-8 text-center font-body text-sm text-[#1A4B7A]/40">
                  No pending reviews
                </div>
              )}
            </div>
          </div>

          {/* Contact Messages */}
          <div className="bg-white rounded-xl border border-[#E8A435]/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1A4B7A]/5 flex items-center justify-between">
              <h2 className="font-display text-lg text-[#1A4B7A] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#E8A435]" />
                Contact Messages
              </h2>
            </div>
            <div className="divide-y divide-[#1A4B7A]/5 max-h-96 overflow-y-auto">
              {contactList?.map((contact) => (
                <div
                  key={contact.id}
                  className={`px-6 py-4 hover:bg-[#FAF3E0]/30 ${!contact.isRead ? 'bg-[#E8A435]/5' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-body text-sm font-medium text-[#1A4B7A]">{contact.name}</p>
                        {!contact.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#E8A435]" />
                        )}
                      </div>
                      <p className="font-body text-xs text-[#1A4B7A]/50">{contact.email}</p>
                      {contact.subject && (
                        <p className="font-body text-xs text-[#E8A435] mt-0.5">{contact.subject}</p>
                      )}
                      <p className="font-body text-xs text-[#1A4B7A]/60 mt-1 line-clamp-2">{contact.message}</p>
                    </div>
                    {!contact.isRead && (
                      <button
                        onClick={() => markRead.mutate({ id: contact.id })}
                        className="px-3 py-1 rounded text-xs font-body bg-[#1A4B7A]/10 text-[#1A4B7A] hover:bg-[#1A4B7A]/20 whitespace-nowrap ml-2"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(!contactList || contactList.length === 0) && (
                <div className="px-6 py-8 text-center font-body text-sm text-[#1A4B7A]/40">
                  No messages yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-[#E8A435]/10 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1A4B7A]/5">
            <h2 className="font-display text-lg text-[#1A4B7A] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E8A435]" />
              All Users
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAF3E0]/50">
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Auth Type</th>
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left font-body text-xs text-[#1A4B7A]/60 font-medium uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A4B7A]/5">
                {userList?.map((user) => (
                  <tr key={`${user.authType}-${user.id}`} className="hover:bg-[#FAF3E0]/30">
                    <td className="px-6 py-4 font-body text-sm text-[#1A4B7A]">{user.name}</td>
                    <td className="px-6 py-4 font-body text-sm text-[#1A4B7A]/70">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-body ${
                        user.authType === 'oauth'
                          ? 'bg-[#1A4B7A]/10 text-[#1A4B7A]'
                          : 'bg-[#C75B39]/10 text-[#C75B39]'
                      }`}>
                        {user.authType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-body ${
                        user.role === 'admin'
                          ? 'bg-[#E8A435]/10 text-[#E8A435]'
                          : 'bg-[#5A8F6E]/10 text-[#5A8F6E]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-xs text-[#1A4B7A]/50">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {(!userList || userList.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center font-body text-sm text-[#1A4B7A]/40">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
