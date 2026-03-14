import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle2,
  KeyRound, Fingerprint, Info
} from 'lucide-react'
import { useAuthStore, PASSWORD_POLICY, validatePassword, getPasswordStrength } from '../stores/authStore'

export default function Login() {
  const { login, verifyMfa, loginError, mfaPending, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mfaInput, setMfaInput] = useState('')
  const [showPolicy, setShowPolicy] = useState(false)

  const strength = getPasswordStrength(password)
  const validation = validatePassword(password)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
  }

  const handleMfa = (e: React.FormEvent) => {
    e.preventDefault()
    verifyMfa(mfaInput)
  }

  // Auto-focus MFA input
  useEffect(() => {
    if (mfaPending) setMfaInput('')
  }, [mfaPending])

  return (
    <div className="min-h-screen bg-kdj-navy flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[480px] flex-col justify-between p-12 bg-gradient-to-b from-kdj-navy to-kdj-slate">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-kdj-teal flex items-center justify-center font-bold text-sm text-white">KDJ</div>
            <div>
              <div className="text-white font-semibold">KDJ Consultants</div>
              <div className="text-white/40 text-xs">Clarity Platform</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Healthcare Abstraction.<br />Simplified.</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            HIPAA-compliant medical record abstraction platform with SOC 2 Type II certification.
            Your data is encrypted at rest and in transit.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: Shield, text: 'SOC 2 Type II Certified' },
            { icon: Lock, text: 'AES-256 Encryption at Rest' },
            { icon: Fingerprint, text: 'Multi-Factor Authentication' },
            { icon: KeyRound, text: 'HIPAA Compliant — BAA on File' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-white/60 text-xs">
              <item.icon size={14} className="text-kdj-teal shrink-0" />
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-kdj-teal flex items-center justify-center font-bold text-sm text-white">KDJ</div>
            <div>
              <div className="text-white font-semibold">KDJ Consultants</div>
              <div className="text-white/40 text-xs">Clarity Platform</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!mfaPending ? (
              <>
                <h2 className="text-xl font-bold text-kdj-text mb-1">Sign In</h2>
                <p className="text-sm text-kdj-muted mb-6">Enter your credentials to access the platform</p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-kdj-text mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@kdjconsulting.com"
                      className="w-full px-4 py-2.5 border border-kdj-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kdj-blue/20 focus:border-kdj-blue"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-kdj-text">Password</label>
                      <button type="button" onClick={() => setShowPolicy(!showPolicy)} className="text-[10px] text-kdj-blue hover:underline flex items-center gap-1">
                        <Info size={10} /> Password Policy
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2.5 pr-10 border border-kdj-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kdj-blue/20 focus:border-kdj-blue"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-kdj-muted hover:text-kdj-text">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Password strength meter */}
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-medium ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
                          {!validation.valid && (
                            <span className="text-[10px] text-kdj-red">{validation.errors.length} requirement{validation.errors.length > 1 ? 's' : ''} not met</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Password Policy Panel */}
                  {showPolicy && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-kdj-surface rounded-lg p-4 border border-kdj-border">
                      <h4 className="text-xs font-semibold text-kdj-text mb-2 flex items-center gap-1.5">
                        <Shield size={12} className="text-kdj-blue" /> Password Requirements
                      </h4>
                      <div className="space-y-1.5">
                        {[
                          { met: password.length >= PASSWORD_POLICY.minLength, text: `Minimum ${PASSWORD_POLICY.minLength} characters` },
                          { met: /[A-Z]/.test(password), text: 'At least one uppercase letter (A-Z)' },
                          { met: /[a-z]/.test(password), text: 'At least one lowercase letter (a-z)' },
                          { met: /[0-9]/.test(password), text: 'At least one number (0-9)' },
                          { met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), text: 'At least one special character (!@#$...)' },
                          { met: true, text: `Password expires every ${PASSWORD_POLICY.maxAgeDays} days` },
                          { met: true, text: `Cannot reuse last ${PASSWORD_POLICY.preventReuse} passwords` },
                        ].map((req, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px]">
                            {password.length > 0 ? (
                              req.met ? <CheckCircle2 size={12} className="text-kdj-green shrink-0" /> : <AlertTriangle size={12} className="text-kdj-red shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-kdj-border shrink-0" />
                            )}
                            <span className={password.length > 0 ? (req.met ? 'text-kdj-green' : 'text-kdj-red') : 'text-kdj-muted'}>{req.text}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertTriangle size={14} className="text-kdj-red shrink-0 mt-0.5" />
                      <span className="text-xs text-kdj-red">{loginError}</span>
                    </div>
                  )}

                  <button type="submit" className="w-full bg-kdj-blue text-white py-2.5 rounded-lg text-sm font-medium hover:bg-kdj-blue-light transition-colors">
                    Sign In
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-kdj-border">
                  <p className="text-[10px] text-kdj-muted text-center">Contact your administrator if you need access</p>
                </div>
              </>
            ) : (
              /* MFA Verification */
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-kdj-blue/10 flex items-center justify-center mx-auto mb-4">
                    <Fingerprint size={28} className="text-kdj-blue" />
                  </div>
                  <h2 className="text-xl font-bold text-kdj-text">Verification Required</h2>
                  <p className="text-sm text-kdj-muted mt-1">Enter the 6-digit code sent to your device</p>
                  <p className="text-[10px] text-kdj-amber mt-2">(Demo: check browser console for code)</p>
                </div>

                <form onSubmit={handleMfa} className="space-y-4">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={mfaInput}
                    onChange={e => setMfaInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-4 py-3 border border-kdj-border rounded-lg text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-kdj-blue/20 focus:border-kdj-blue"
                  />

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertTriangle size={14} className="text-kdj-red shrink-0 mt-0.5" />
                      <span className="text-xs text-kdj-red">{loginError}</span>
                    </div>
                  )}

                  <button type="submit" disabled={mfaInput.length !== 6} className="w-full bg-kdj-blue text-white py-2.5 rounded-lg text-sm font-medium hover:bg-kdj-blue-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Verify & Sign In
                  </button>

                  <button type="button" onClick={() => useAuthStore.setState({ mfaPending: false, loginError: null })} className="w-full text-xs text-kdj-muted hover:text-kdj-text transition-colors py-2">
                    ← Back to sign in
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-[10px] text-white/30 mt-6">
            Clarity Platform v1.0 · HIPAA Compliant · SOC 2 Type II · © 2026 KDJ Consultants
          </p>
        </motion.div>
      </div>
    </div>
  )
}
