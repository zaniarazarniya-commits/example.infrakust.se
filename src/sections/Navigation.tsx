import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Menu, X, User, LogOut, Shield, ChevronDown } from 'lucide-react'

interface NavigationProps {
  onBookClick: () => void
}

export default function Navigation({ onBookClick }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Suites', href: '#suites' },
    { label: 'Spa', href: '#spa' },
    { label: 'Dining', href: '#dining' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ]

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAF3E0]/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className={`font-display text-xl lg:text-2xl tracking-wide transition-colors ${
              scrolled ? 'text-[#1A4B7A]' : 'text-[#FAF3E0]'
            }`}
            style={{ textShadow: scrolled ? 'none' : '1px 2px 8px rgba(10,30,50,0.3)' }}
          >
            Terrazza di Sole
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`gold-underline font-body text-sm tracking-wide transition-colors ${
                  scrolled ? 'text-[#1A4B7A]' : 'text-[#FAF3E0]'
                }`}
                style={{ textShadow: scrolled ? 'none' : '1px 2px 8px rgba(10,30,50,0.3)' }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 font-body text-sm transition-colors ${
                    scrolled ? 'text-[#1A4B7A]' : 'text-[#FAF3E0]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E8A435]/20 py-2 z-50">
                    {isAdmin && (
                      <button
                        onClick={() => { setUserMenuOpen(false); navigate('/admin') }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1A4B7A] hover:bg-[#FAF3E0]"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => { setUserMenuOpen(false); logout() }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#C75B39] hover:bg-[#FAF3E0]"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`font-body text-sm tracking-wide transition-colors ${
                  scrolled ? 'text-[#1A4B7A]' : 'text-[#FAF3E0]'
                }`}
              >
                Sign In
              </Link>
            )}
            <button
              onClick={onBookClick}
              className="btn-gold"
            >
              Reserve
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 transition-colors ${
              scrolled ? 'text-[#1A4B7A]' : 'text-[#FAF3E0]'
            }`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#FAF3E0] border-t border-[#E8A435]/20 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left font-body text-[#1A4B7A] py-2"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-[#1A4B7A]/10 space-y-3">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={() => { setMobileOpen(false); navigate('/admin') }}
                      className="flex items-center gap-2 text-[#1A4B7A] font-body text-sm"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { setMobileOpen(false); logout() }}
                    className="flex items-center gap-2 text-[#C75B39] font-body text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-[#1A4B7A] font-body text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={() => { setMobileOpen(false); onBookClick() }}
                className="btn-gold w-full text-center"
              >
                Reserve Your Terrazza
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
