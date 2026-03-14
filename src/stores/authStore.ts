import { create } from 'zustand'

export type UserRole = 'admin' | 'project_manager' | 'nurse' | 'contractor' | 'client_viewer'

export interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  mfaEnabled: boolean
  lastLogin: string | null
  passwordChangedAt: string
  failedAttempts: number
  lockedUntil: string | null
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumber: boolean
  requireSpecial: boolean
  maxAgeDays: number
  preventReuse: number
}

export const PASSWORD_POLICY: PasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
  maxAgeDays: 90,
  preventReuse: 5,
}

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 30 * 60 * 1000 // 30 minutes
const SESSION_TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes HIPAA

// Demo users
const DEMO_USERS: Record<string, { password: string; user: AppUser }> = {
  'kim@kdjconsulting.com': {
    password: 'KDJ#Clarity2026!',
    user: {
      id: 'u1', name: 'Kim Johnson', email: 'kim@kdjconsulting.com', role: 'admin',
      mfaEnabled: true, lastLogin: '2026-03-12T18:30:00Z', passwordChangedAt: '2026-02-01T00:00:00Z',
      failedAttempts: 0, lockedUntil: null,
    },
  },
  'patricia@kdjcontract.com': {
    password: 'Nurse$HEDIS2026!',
    user: {
      id: 'u2', name: 'Patricia Williams, RN', email: 'patricia@kdjcontract.com', role: 'nurse',
      mfaEnabled: true, lastLogin: '2026-03-13T08:15:00Z', passwordChangedAt: '2026-01-15T00:00:00Z',
      failedAttempts: 0, lockedUntil: null,
    },
  },
  'mark@bcbstx.com': {
    password: 'BCBS#View2026!@',
    user: {
      id: 'u3', name: 'Mark Rodriguez', email: 'mark@bcbstx.com', role: 'client_viewer',
      mfaEnabled: false, lastLogin: '2026-03-11T14:00:00Z', passwordChangedAt: '2026-02-20T00:00:00Z',
      failedAttempts: 0, lockedUntil: null,
    },
  },
  'will@kdj.com': {
    password: '#Espn2025',
    user: {
      id: 'u4', name: 'Will Burns', email: 'will@kdj.com', role: 'admin',
      mfaEnabled: false, lastLogin: '2026-03-14T00:00:00Z', passwordChangedAt: '2026-03-14T00:00:00Z',
      failedAttempts: 0, lockedUntil: null,
    },
  },
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const p = PASSWORD_POLICY
  if (password.length < p.minLength) errors.push(`At least ${p.minLength} characters`)
  if (p.requireUppercase && !/[A-Z]/.test(password)) errors.push('At least one uppercase letter')
  if (p.requireLowercase && !/[a-z]/.test(password)) errors.push('At least one lowercase letter')
  if (p.requireNumber && !/[0-9]/.test(password)) errors.push('At least one number')
  if (p.requireSpecial && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) errors.push('At least one special character')
  return { valid: errors.length === 0, errors }
}

export function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (/(.)\1{2,}/.test(password)) score-- // repeated chars penalty

  if (score <= 2) return { score, label: 'Weak', color: 'bg-kdj-red' }
  if (score <= 3) return { score, label: 'Fair', color: 'bg-kdj-amber' }
  if (score <= 4) return { score, label: 'Good', color: 'bg-kdj-blue' }
  return { score, label: 'Strong', color: 'bg-kdj-green' }
}

interface AuthState {
  user: AppUser | null
  isAuthenticated: boolean
  sessionExpiresAt: number | null
  loginError: string | null
  mfaPending: boolean
  mfaCode: string

  login: (email: string, password: string) => boolean
  verifyMfa: (code: string) => boolean
  logout: () => void
  refreshSession: () => void
  checkSession: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  sessionExpiresAt: null,
  loginError: null,
  mfaPending: false,
  mfaCode: '',

  login: (email: string, password: string) => {
    const entry = DEMO_USERS[email.toLowerCase()]
    if (!entry) {
      set({ loginError: 'Invalid email or password', mfaPending: false })
      return false
    }

    // Check lockout
    if (entry.user.lockedUntil) {
      const lockExpiry = new Date(entry.user.lockedUntil).getTime()
      if (Date.now() < lockExpiry) {
        const minsLeft = Math.ceil((lockExpiry - Date.now()) / 60000)
        set({ loginError: `Account locked. Try again in ${minsLeft} minutes.`, mfaPending: false })
        return false
      }
      entry.user.lockedUntil = null
      entry.user.failedAttempts = 0
    }

    if (entry.password !== password) {
      entry.user.failedAttempts++
      if (entry.user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        entry.user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString()
        set({ loginError: `Account locked after ${MAX_FAILED_ATTEMPTS} failed attempts. Try again in 30 minutes.`, mfaPending: false })
      } else {
        const remaining = MAX_FAILED_ATTEMPTS - entry.user.failedAttempts
        set({ loginError: `Invalid email or password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`, mfaPending: false })
      }
      return false
    }

    // Successful password — check MFA
    entry.user.failedAttempts = 0
    if (entry.user.mfaEnabled) {
      set({ mfaPending: true, loginError: null, mfaCode: String(Math.floor(100000 + Math.random() * 900000)) })
      // In real app, send code via SMS/email. For demo, code shown in console.
      console.info(`[MFA] Verification code for ${email}: ${get().mfaCode}`)
      return false
    }

    // No MFA — complete login
    entry.user.lastLogin = new Date().toISOString()
    set({
      user: { ...entry.user },
      isAuthenticated: true,
      sessionExpiresAt: Date.now() + SESSION_TIMEOUT_MS,
      loginError: null,
      mfaPending: false,
    })
    return true
  },

  verifyMfa: (code: string) => {
    const { mfaCode } = get()
    if (code !== mfaCode) {
      set({ loginError: 'Invalid verification code' })
      return false
    }
    // Find the user that was being logged in
    const pending = Object.values(DEMO_USERS).find(e => e.user.failedAttempts === 0 && e.user.mfaEnabled)
    if (!pending) {
      set({ loginError: 'Session expired. Please try again.', mfaPending: false })
      return false
    }
    pending.user.lastLogin = new Date().toISOString()
    set({
      user: { ...pending.user },
      isAuthenticated: true,
      sessionExpiresAt: Date.now() + SESSION_TIMEOUT_MS,
      loginError: null,
      mfaPending: false,
      mfaCode: '',
    })
    return true
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, sessionExpiresAt: null, loginError: null, mfaPending: false, mfaCode: '' })
  },

  refreshSession: () => {
    const { isAuthenticated } = get()
    if (isAuthenticated) {
      set({ sessionExpiresAt: Date.now() + SESSION_TIMEOUT_MS })
    }
  },

  checkSession: () => {
    const { isAuthenticated, sessionExpiresAt } = get()
    if (!isAuthenticated) return false
    if (sessionExpiresAt && Date.now() > sessionExpiresAt) {
      get().logout()
      return false
    }
    return true
  },
}))
