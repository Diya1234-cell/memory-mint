'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  Lock,
  Palette,
  ShieldCheck,
  User,
  Globe,
  Moon,
  SunMedium,
  RotateCcw,
} from 'lucide-react'

const SETTINGS_STORAGE_KEY = 'memory-mint-settings-v1'

const themeOptions = [
  { value: 'pink', label: 'Aurora Pink' },
  { value: 'purple', label: 'Nebula Purple' },
  { value: 'galaxy', label: 'Midnight Galaxy' },
  { value: 'blue', label: 'Ocean Blue' },
  { value: 'green', label: 'Emerald Forest' },
  { value: 'gold', label: 'Golden Sunset' },
]

const languageOptions = ['English', 'Spanish', 'French', 'German', 'Hindi']
const timezoneOptions = ['UTC', 'GMT+1', 'GMT+5:30', 'GMT-5', 'GMT+8']

export default function SettingsPage() {
  const [name, setName] = useState('Aarya Sharma')
  const [email, setEmail] = useState('aarya.sharma@email.com')
  const [theme, setTheme] = useState('pink')
  const [darkMode, setDarkMode] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [activityAlerts, setActivityAlerts] = useState(true)
  const [language, setLanguage] = useState('English')
  const [timezone, setTimezone] = useState('UTC')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setName(data.name ?? name)
        setEmail(data.email ?? email)
        setTheme(data.theme ?? theme)
        setDarkMode(data.darkMode ?? darkMode)
        setEmailNotifications(data.emailNotifications ?? emailNotifications)
        setPushNotifications(data.pushNotifications ?? pushNotifications)
        setActivityAlerts(data.activityAlerts ?? activityAlerts)
        setLanguage(data.language ?? language)
        setTimezone(data.timezone ?? timezone)
      } catch {
        // ignore invalid storage data
      }
    }
  }, [])

  useEffect(() => {
    const data = {
      name,
      email,
      theme,
      darkMode,
      emailNotifications,
      pushNotifications,
      activityAlerts,
      language,
      timezone,
    }
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data))
  }, [name, email, theme, darkMode, emailNotifications, pushNotifications, activityAlerts, language, timezone])

  const themeColors = useMemo(
    () => ({
      pink: 'from-pink-500 to-fuchsia-500',
      purple: 'from-violet-500 to-fuchsia-600',
      galaxy: 'from-sky-500 to-indigo-600',
      blue: 'from-cyan-500 to-blue-600',
      green: 'from-emerald-500 to-teal-500',
      gold: 'from-amber-500 to-orange-500',
    }),
    [],
  )

  const savePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatusMessage('Please fill out all password fields.')
      return
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage('New passwords must match.')
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setStatusMessage('Password updated successfully.')
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 xl:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neonPink/70">Settings</p>
              <h1 className="mt-3 text-3xl font-bold text-white">Website preferences & account controls</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Manage your account details, appearance, security, notifications, and privacy settings from one place.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70 shadow-lg">
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldCheck className="h-4 w-4 text-neonPink" />
                Website status: <span className="font-semibold text-white">Secure</span>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Account</p>
                  <h2 className="text-xl font-semibold text-white">Profile & login</h2>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Email</span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">Your account details will be used for notifications and app personalization.</p>
                <button
                  type="button"
                  onClick={() => setStatusMessage('Profile information saved.')}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5"
                >
                  Save profile
                </button>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Appearance</p>
                  <h2 className="text-xl font-semibold text-white">Theme & display</h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Site theme</span>
                  <select
                    value={theme}
                    onChange={(event) => setTheme(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  >
                    {themeOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-950 text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Mode</span>
                  <button
                    type="button"
                    onClick={() => setDarkMode((value) => !value)}
                    className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:border-fuchsia-400"
                  >
                    <span>{darkMode ? 'Dark mode' : 'Light mode'}</span>
                    {darkMode ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
                  </button>
                </label>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="mb-3 flex items-center gap-2 text-slate-100">
                  <RotateCcw className="h-4 w-4 text-cyan-300" />
                  <span className="font-semibold text-white">Live preview</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {themeOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`rounded-3xl border p-3 text-center text-sm transition ${theme === option.value ? 'border-fuchsia-400 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Notifications</p>
                  <h2 className="text-xl font-semibold text-white">Alerts & updates</h2>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white">
                  <span>Marketing emails</span>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications((value) => !value)}
                    className="h-5 w-5 rounded border-white/10 bg-slate-950 text-pink-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white">
                  <span>Push notifications</span>
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={() => setPushNotifications((value) => !value)}
                    className="h-5 w-5 rounded border-white/10 bg-slate-950 text-pink-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white">
                  <span>Security alerts</span>
                  <input
                    type="checkbox"
                    checked={activityAlerts}
                    onChange={() => setActivityAlerts((value) => !value)}
                    className="h-5 w-5 rounded border-white/10 bg-slate-950 text-pink-500"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Preferences</p>
                  <h2 className="text-xl font-semibold text-white">Language & region</h2>
                </div>
              </div>

              <div className="grid gap-4">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Language</span>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  >
                    {languageOptions.map((option) => (
                      <option key={option} value={option} className="bg-slate-950 text-white">
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Timezone</span>
                  <select
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  >
                    {timezoneOptions.map((option) => (
                      <option key={option} value={option} className="bg-slate-950 text-white">
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Security</p>
                  <h2 className="text-xl font-semibold text-white">Password management</h2>
                </div>
              </div>

              <div className="space-y-4">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Current password</span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>New password</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Confirm new password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={savePassword}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5"
              >
                Update password
              </button>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Danger zone</p>
                  <h2 className="text-xl font-semibold text-white">Privacy & data</h2>
                </div>
              </div>

              <p className="text-sm text-slate-400">Manage your privacy preferences and clear any local session data stored in this browser.</p>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(SETTINGS_STORAGE_KEY)
                  setStatusMessage('Local settings cleared. Refresh the page to reset.')
                }}
                className="mt-4 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Clear local settings
              </button>
            </div>
          </div>
        </section>

        {statusMessage ? (
          <div className="rounded-[24px] border border-white/10 bg-slate-950/80 px-6 py-4 text-sm text-slate-200 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl">
            {statusMessage}
          </div>
        ) : null}
      </div>
    </main>
  )
}
