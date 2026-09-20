export interface ThemePalette {
  bg: string
  surface: string
  surface2: string
  surface3: string
  sidebarBg: string
  text: string
  mutedText: string
  faint: string
  line: string
  brand: string
  accentSoft: string
  accentDeep: string
  danger: string
  dangerSoft: string
  success: string
  successSoft: string
}

export interface ThemePalettes {
  light: ThemePalette
  dark: ThemePalette
}

export const themeColorFields: Array<{ key: keyof ThemePalette; label: string }> = [
  { key: 'bg', label: '页面背景' },
  { key: 'surface', label: '主要容器' },
  { key: 'surface2', label: '次级容器' },
  { key: 'surface3', label: '强调容器' },
  { key: 'sidebarBg', label: '侧边栏' },
  { key: 'text', label: '主要文字' },
  { key: 'mutedText', label: '次要文字' },
  { key: 'faint', label: '弱化文字' },
  { key: 'line', label: '边框分隔线' },
  { key: 'brand', label: '品牌主色' },
  { key: 'accentSoft', label: '浅强调色' },
  { key: 'accentDeep', label: '深强调色' },
  { key: 'danger', label: '危险状态' },
  { key: 'dangerSoft', label: '危险背景' },
  { key: 'success', label: '成功状态' },
  { key: 'successSoft', label: '成功背景' },
]

export const themeCssVariables: Record<keyof ThemePalette, string> = {
  bg: '--bg', surface: '--surface', surface2: '--surface-2', surface3: '--surface-3', sidebarBg: '--sidebar-bg',
  text: '--text', mutedText: '--muted-text', faint: '--faint', line: '--line', brand: '--brand',
  accentSoft: '--accent-soft', accentDeep: '--accent-deep', danger: '--danger', dangerSoft: '--danger-soft',
  success: '--success', successSoft: '--success-soft',
}

export const defaultThemePalettes: ThemePalettes = {
  light: {
    bg: '#ffffff', surface: '#ffffff', surface2: '#f7f7f7', surface3: '#eeeeee', sidebarBg: '#f8f8f8',
    text: '#202020', mutedText: '#707070', faint: '#a0a0a0', line: '#e8e8e8', brand: '#2f2f2f',
    accentSoft: '#f2f2f2', accentDeep: '#171717', danger: '#c94a4a', dangerSoft: '#fbeeee',
    success: '#4f8060', successSoft: '#edf5ef',
  },
  dark: {
    bg: '#171717', surface: '#1f1f1f', surface2: '#292929', surface3: '#333333', sidebarBg: '#202020',
    text: '#ededed', mutedText: '#a1a1a1', faint: '#6f6f6f', line: '#333333', brand: '#ededed',
    accentSoft: '#2c2c2c', accentDeep: '#ffffff', danger: '#df7070', dangerSoft: '#382323',
    success: '#76a985', successSoft: '#233128',
  },
}

const colorPattern = /^#[0-9a-f]{6}$/i

export function normalizeThemePalettes(value?: Partial<Record<keyof ThemePalettes, Partial<ThemePalette>>>): ThemePalettes {
  const normalize = (mode: keyof ThemePalettes) => Object.fromEntries(themeColorFields.map(({ key }) => {
    const candidate = value?.[mode]?.[key]
    return [key, typeof candidate === 'string' && colorPattern.test(candidate) ? candidate.toLowerCase() : defaultThemePalettes[mode][key]]
  })) as unknown as ThemePalette
  return { light: normalize('light'), dark: normalize('dark') }
}

function rgb(color: string) {
  const value = Number.parseInt(color.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function luminance(color: string) {
  return rgb(color).map((channel) => {
    const value = channel / 255
    return value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
  }).reduce((total, value, index) => total + value * [.2126, .7152, .0722][index], 0)
}

export function contrastRatio(foreground: string, background: string) {
  const [first, second] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (first + .05) / (second + .05)
}

export function getThemeContrastIssue(palettes: ThemePalettes) {
  const checks: Array<{ foreground: keyof ThemePalette; backgrounds: Array<keyof ThemePalette>; minimum: number }> = [
    { foreground: 'text', backgrounds: ['bg', 'surface', 'surface2', 'surface3', 'sidebarBg'], minimum: 4.5 },
    { foreground: 'mutedText', backgrounds: ['bg', 'surface', 'surface2', 'sidebarBg'], minimum: 3 },
    { foreground: 'faint', backgrounds: ['bg', 'surface', 'sidebarBg'], minimum: 1.8 },
    { foreground: 'accentDeep', backgrounds: ['accentSoft'], minimum: 3 },
    { foreground: 'danger', backgrounds: ['dangerSoft', 'surface'], minimum: 3 },
    { foreground: 'success', backgrounds: ['successSoft'], minimum: 3 },
  ]
  for (const mode of ['light', 'dark'] as const) {
    for (const check of checks) {
      for (const background of check.backgrounds) {
        const ratio = contrastRatio(palettes[mode][check.foreground], palettes[mode][background])
        if (ratio < check.minimum) {
          const foregroundLabel = themeColorFields.find(({ key }) => key === check.foreground)?.label ?? check.foreground
          const backgroundLabel = themeColorFields.find(({ key }) => key === background)?.label ?? background
          return `${mode === 'light' ? '浅色' : '深色'}配色的「${foregroundLabel} / ${backgroundLabel}」对比度为 ${ratio.toFixed(1)}:1，至少需要 ${check.minimum}:1。`
        }
      }
    }
  }
  return null
}

export function accessibleForeground(...backgrounds: string[]) {
  const score = (foreground: string) => Math.min(...backgrounds.map((background) => contrastRatio(foreground, background)))
  return score('#ffffff') >= score('#202020') ? '#ffffff' : '#202020'
}

export function serializeThemePalettes(palettes: ThemePalettes) {
  const block = (selector: string, palette: ThemePalette) => `${selector} {\n${themeColorFields.map(({ key }) => `  ${themeCssVariables[key]}: ${palette[key]};`).join('\n')}\n}`
  return `/* 全局配色：保留变量名并使用六位十六进制色码。 */\n\n${block(':root', palettes.light)}\n\n${block(":root[data-theme='dark']", palettes.dark)}`
}

export function parseThemePalettes(css: string, current: ThemePalettes) {
  const next = normalizeThemePalettes(current)
  let changed = 0
  for (const [, selector, declarations] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const mode = selector.includes('dark') ? 'dark' : selector.includes(':root') ? 'light' : null
    if (!mode) continue
    for (const { key } of themeColorFields) {
      const variable = themeCssVariables[key].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const match = declarations.match(new RegExp(`${variable}\\s*:\\s*(#[0-9a-fA-F]{6})\\s*;?`))
      if (match) { next[mode][key] = match[1].toLowerCase(); changed += 1 }
    }
  }
  if (!changed) throw new Error('没有识别到支持的颜色变量。')
  return next
}
