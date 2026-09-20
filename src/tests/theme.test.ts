import { describe, expect, it } from 'vitest'
import { defaultThemePalettes, getThemeContrastIssue, parseThemePalettes, serializeThemePalettes } from '@/app/theme'

describe('theme palette CSS', () => {
  it('round-trips the supported CSS variables', () => {
    expect(parseThemePalettes(serializeThemePalettes(defaultThemePalettes), defaultThemePalettes)).toEqual(defaultThemePalettes)
  })

  it('rejects unreadable foreground and background combinations', () => {
    const palettes = { ...defaultThemePalettes, light: { ...defaultThemePalettes.light, text: '#ffffff' } }
    expect(getThemeContrastIssue(palettes)).toContain('对比度')
  })
})
