import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { accessibleForeground, defaultThemePalettes, normalizeThemePalettes, themeColorFields, themeCssVariables, type ThemePalettes } from './theme'

export type ThemeMode = 'system' | 'light' | 'dark'

export interface Preferences {
  theme: ThemeMode
  sidebarWidth: number
  sidebarCollapsed: boolean
  reduceMotion: boolean
  themePalettes: ThemePalettes
}

const STORAGE_KEY = 'sylunae-framework.preferences'
export const SIDEBAR_MIN = 220
export const SIDEBAR_MAX = 440
export const SIDEBAR_COLLAPSED = 70
export const SIDEBAR_COLLAPSE_THRESHOLD = 176

export const defaultPreferences: Preferences = {
  theme: 'system',
  sidebarWidth: 252,
  sidebarCollapsed: false,
  reduceMotion: false,
  themePalettes: defaultThemePalettes,
}

export function normalizePreferences(input: unknown): Preferences {
  if (!input || typeof input !== 'object') return defaultPreferences
  const value = input as Partial<Preferences>
  const theme = value.theme === 'light' || value.theme === 'dark' || value.theme === 'system' ? value.theme : defaultPreferences.theme
  const sidebarWidth = typeof value.sidebarWidth === 'number' && Number.isFinite(value.sidebarWidth)
    ? Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, value.sidebarWidth))
    : defaultPreferences.sidebarWidth
  return {
    theme,
    sidebarWidth,
    sidebarCollapsed: Boolean(value.sidebarCollapsed),
    reduceMotion: Boolean(value.reduceMotion),
    themePalettes: normalizeThemePalettes(value.themePalettes),
  }
}

function loadPreferences(): Preferences {
  try { return normalizePreferences(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')) }
  catch { return defaultPreferences }
}

function resolveTheme(mode: ThemeMode, prefersDark: boolean) {
  return mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode
}

interface PreferencesContextValue {
  preferences: Preferences
  setPreferences: (next: Preferences | ((current: Preferences) => Preferences)) => void
  resetPreferences: () => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferencesState] = useState(loadPreferences)
  const setPreferences = useCallback((next: Preferences | ((current: Preferences) => Preferences)) => {
    setPreferencesState((current) => normalizePreferences(typeof next === 'function' ? next(current) : next))
  }, [])
  const resetPreferences = useCallback(() => setPreferencesState(defaultPreferences), [])

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)) }, [preferences])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const theme = resolveTheme(preferences.theme, media.matches)
      document.documentElement.dataset.theme = theme
      document.documentElement.classList.toggle('dark', theme === 'dark')
      document.documentElement.dataset.reduceMotion = preferences.reduceMotion ? 'true' : 'false'
      const palette = preferences.themePalettes[theme]
      themeColorFields.forEach(({ key }) => document.documentElement.style.setProperty(themeCssVariables[key], palette[key]))
      document.documentElement.style.setProperty('--brand-foreground', accessibleForeground(palette.brand, palette.accentDeep))
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', palette.bg)
      void window.sylunae?.system.setTitlebarTheme(theme)
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [preferences.theme, preferences.reduceMotion, preferences.themePalettes])

  const value = useMemo(() => ({ preferences, setPreferences, resetPreferences }), [preferences, setPreferences, resetPreferences])
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const value = useContext(PreferencesContext)
  if (!value) throw new Error('usePreferences must be used inside PreferencesProvider')
  return value
}
