import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { LogIn, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

function getOAuthUrl() {
  const authUrl = new URL(`${import.meta.env.VITE_KIMI_AUTH_URL}/api/oauth/authorize`)
  authUrl.searchParams.set("client_id", import.meta.env.VITE_APP_ID)
  authUrl.searchParams.set("redirect_uri", `${window.location.origin}/api/oauth/callback`)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("scope", "profile")
  authUrl.searchParams.set("state", btoa(window.location.pathname))
  return authUrl.toString()
}

export default function Login() {
  const { isAuthenticated, user } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('local_auth_token', data.token)
      toast.success('Welcome back!')
      window.location.href = '/'
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('local_auth_token', data.token)
      toast.success('Account created! Welcome to Terrazza di Sole.')
      window.location.href = '/'
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      loginMutation.mutate({ username, password })
    } else {
      if (!email) {
        toast.error('Email is required')
        return
      }
      registerMutation.mutate({ username, email, password, displayName: displayName || undefined })
    }
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl text-[#1A4B7A]">Welcome, {user.name}!</h2>
          <p className="font-body text-[#1A4B7A]/70">You are already signed in.</p>
          <Link to="/" className="btn-gold inline-block">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#FAF3E0] flex items-center justify-center px-4"
      style={{
        backgroundImage: 'linear-gradient(135deg, #FAF3E0 0%, #F0EDE1 50%, #FAF3E0 100%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          to="/"
          className="flex items-center gap-2 font-body text-sm text-[#1A4B7A]/70 hover:text-[#E8A435] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Terrazza di Sole
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-[#E8A435]/20 overflow-hidden">
          {/* Header */}
          <div className="bg-[#1A4B7A] p-8 text-center">
            <h1 className="font-display text-3xl text-[#FAF3E0]">Terrazza di Sole</h1>
            <p className="font-body text-sm text-[#FAF3E0]/70 mt-2">
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* OAuth Button */}
          <div className="p-6 pb-0">
            <a
              href={getOAuthUrl()}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-[#1A4B7A] text-[#FAF3E0] font-body text-sm font-medium hover:bg-[#0C243B] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Continue with Kimi OAuth
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="flex-1 h-px bg-[#1A4B7A]/10" />
            <span className="font-body text-xs text-[#1A4B7A]/50">or</span>
            <div className="flex-1 h-px bg-[#1A4B7A]/10" />
          </div>

          {/* Local Auth Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            <div>
              <label className="font-body text-sm text-[#1A4B7A] font-medium mb-1.5 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-lg border border-[#1A4B7A]/15 bg-[#FAF3E0]/50 font-body text-sm text-[#1A4B7A] placeholder:text-[#1A4B7A]/30 focus:border-[#E8A435] focus:outline-none"
                required
              />
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="font-body text-sm text-[#1A4B7A] font-medium mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-[#1A4B7A]/15 bg-[#FAF3E0]/50 font-body text-sm text-[#1A4B7A] placeholder:text-[#1A4B7A]/30 focus:border-[#E8A435] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-body text-sm text-[#1A4B7A] font-medium mb-1.5 block">Display Name (optional)</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How should we address you?"
                    className="w-full px-4 py-3 rounded-lg border border-[#1A4B7A]/15 bg-[#FAF3E0]/50 font-body text-sm text-[#1A4B7A] placeholder:text-[#1A4B7A]/30 focus:border-[#E8A435] focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="font-body text-sm text-[#1A4B7A] font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min 6 characters' : 'Enter password'}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-[#1A4B7A]/15 bg-[#FAF3E0]/50 font-body text-sm text-[#1A4B7A] placeholder:text-[#1A4B7A]/30 focus:border-[#E8A435] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A4B7A]/40 hover:text-[#E8A435]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending || registerMutation.isPending}
              className="w-full btn-terracotta py-3.5 flex items-center justify-center gap-2"
            >
              {loginMutation.isPending || registerMutation.isPending ? (
                <span className="animate-spin w-5 h-5 border-2 border-[#FAF3E0]/30 border-t-[#FAF3E0] rounded-full" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="px-6 pb-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-body text-sm text-[#E8A435] hover:text-[#C75B39] transition-colors"
            >
              {mode === 'login'
                ? "Don't have an account? Create one"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
