import { ClipboardPaste, Code2, Copy, RotateCcw, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { usePreferences } from '@/app/preferences'
import { defaultThemePalettes, getThemeContrastIssue, normalizeThemePalettes, parseThemePalettes, serializeThemePalettes, themeColorFields, themeCssVariables, type ThemePalette, type ThemePalettes } from '@/app/theme'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Textarea } from './ui/textarea'

export function ThemePaletteEditor() {
  const { preferences, setPreferences } = usePreferences()
  const [editingMode, setEditingMode] = useState<keyof ThemePalettes>(preferences.theme === 'dark' ? 'dark' : 'light')
  const [cssCode, setCssCode] = useState(() => serializeThemePalettes(preferences.themePalettes))
  const [message, setMessage] = useState('')
  const cssInput = useRef<HTMLTextAreaElement>(null)

  useEffect(() => setCssCode(serializeThemePalettes(preferences.themePalettes)), [preferences.themePalettes])

  const commit = (palettes: ThemePalettes, successMessage = '') => {
    const issue = getThemeContrastIssue(palettes)
    if (issue) { setMessage(`未应用：${issue}`); return false }
    setPreferences((current) => ({ ...current, themePalettes: palettes }))
    setMessage(successMessage)
    return true
  }
  const updateColor = (key: keyof ThemePalette, value: string) => {
    commit({ ...preferences.themePalettes, [editingMode]: { ...preferences.themePalettes[editingMode], [key]: value.toLowerCase() } })
  }
  const copyCss = async () => {
    const code = serializeThemePalettes(preferences.themePalettes)
    setCssCode(code)
    try { await navigator.clipboard.writeText(code) }
    catch { cssInput.current?.select(); document.execCommand('copy') }
    setMessage('CSS 已复制。')
  }
  const applyCss = () => {
    try {
      const parsed = parseThemePalettes(cssCode, preferences.themePalettes)
      if (commit(parsed, 'CSS 色板已应用。')) setCssCode(serializeThemePalettes(parsed))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'CSS 色板无法识别。')
    }
  }
  const reset = () => {
    const palettes = normalizeThemePalettes(defaultThemePalettes)
    setPreferences((current) => ({ ...current, themePalettes: palettes }))
    setCssCode(serializeThemePalettes(palettes))
    setMessage('已恢复默认配色。')
  }

  return <section className="settings-pane palette-pane">
    <div className="settings-title"><span><Code2 size={18} /></span><div><h3>全局配色</h3><p>逐项调色，或复制 CSS 交给 AI 调整后粘贴回来。</p></div></div>
    <Tabs value={editingMode} onValueChange={(value) => setEditingMode(value as keyof ThemePalettes)}>
      <TabsList className="palette-tabs"><TabsTrigger value="light">浅色配色</TabsTrigger><TabsTrigger value="dark">深色配色</TabsTrigger></TabsList>
      {(['light', 'dark'] as const).map((mode) => <TabsContent value={mode} key={mode} className="palette-grid">
        {themeColorFields.map(({ key, label }) => <label className="color-field" key={key}>
          <input type="color" value={preferences.themePalettes[mode][key]} onChange={(event) => updateColor(key, event.target.value)} aria-label={`${label}颜色`} />
          <span><strong>{label}</strong><code>{themeCssVariables[key]}</code></span>
          <output>{preferences.themePalettes[mode][key]}</output>
        </label>)}
      </TabsContent>)}
    </Tabs>
    <div className="palette-safety"><ShieldCheck size={15} /><span>已启用对比度检查；不可读的颜色组合不会保存。</span></div>
    <div className="palette-code-heading"><div><strong>CSS 色板</strong><small>保留变量名，并使用六位十六进制色码。</small></div><div><Button variant="outline" size="sm" onClick={reset}><RotateCcw />恢复默认</Button><Button variant="outline" size="sm" onClick={() => void copyCss()}><Copy />复制 CSS</Button></div></div>
    <Textarea ref={cssInput} className="palette-code" value={cssCode} onChange={(event) => { setCssCode(event.target.value); setMessage('') }} spellCheck={false} aria-label="全局配色 CSS" />
    <div className="palette-code-actions"><span role="status">{message}</span><Button onClick={applyCss}><ClipboardPaste />应用 CSS</Button></div>
  </section>
}
