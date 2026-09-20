import { describe, expect, it } from 'vitest'
import { defaultPreferences, normalizePreferences, SIDEBAR_MAX, SIDEBAR_MIN } from '@/app/preferences'

describe('normalizePreferences', () => {
  it('uses safe defaults for invalid data', () => {
    expect(normalizePreferences(null)).toEqual(defaultPreferences)
    expect(normalizePreferences({ theme: 'neon', sidebarWidth: 'wide' })).toEqual(defaultPreferences)
  })

  it('clamps persisted sidebar widths', () => {
    expect(normalizePreferences({ sidebarWidth: 1 }).sidebarWidth).toBe(SIDEBAR_MIN)
    expect(normalizePreferences({ sidebarWidth: 9999 }).sidebarWidth).toBe(SIDEBAR_MAX)
  })

  it('repairs invalid custom palette values without dropping valid colors', () => {
    const normalized = normalizePreferences({ themePalettes: { light: { bg: '#fafafa', text: 'invalid' } } })
    expect(normalized.themePalettes.light.bg).toBe('#fafafa')
    expect(normalized.themePalettes.light.text).toBe(defaultPreferences.themePalettes.light.text)
  })
})
