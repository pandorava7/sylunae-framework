import { Info, Laptop, Moon, Palette, RotateCcw, Settings, Sun } from 'lucide-react'
import { useState } from 'react'
import { usePreferences, type ThemeMode } from '@/app/preferences'
import { appConfig } from '@/config/app'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Switch } from './ui/switch'
import { ThemePaletteEditor } from './ThemePaletteEditor'

const themeOptions: Array<{ value: ThemeMode; label: string; icon: typeof Laptop }> = [
  { value: 'system', label: '跟随系统', icon: Laptop },
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
]

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [section, setSection] = useState<'appearance' | 'about'>('appearance')
  const { preferences, setPreferences, resetPreferences } = usePreferences()

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent size="xl" mobileSize="fullscreen" className="settings-modal">
      <DialogHeader className="sr-only">
        <DialogTitle>设置</DialogTitle>
        <DialogDescription>调整框架外观并查看运行环境。</DialogDescription>
      </DialogHeader>
      <div className="settings-layout">
        <aside className="settings-nav">
          <div className="settings-brand"><span><Settings size={18} /></span><div><strong>设置</strong><small>定制应用框架</small></div></div>
          <nav aria-label="设置导航">
            <button className={section === 'appearance' ? 'active' : ''} onClick={() => setSection('appearance')}><Palette size={17} />外观</button>
            <button className={section === 'about' ? 'active' : ''} onClick={() => setSection('about')}><Info size={17} />关于</button>
          </nav>
          <div className="settings-nav-footer"><span>{appConfig.shortName}</span><small>{appConfig.eyebrow}</small></div>
        </aside>
        <main className="settings-content">
          {section === 'appearance' ? <>
            <header className="settings-content-header"><span className="eyebrow">APPEARANCE</span><h2>外观</h2><p>这些设置会在 Web 与桌面端之间保持相同的视觉行为。</p></header>
            <section className="settings-pane">
              <div className="settings-title"><span><Palette size={18} /></span><div><h3>页面主题</h3><p>使用系统主题，或固定为浅色与深色。</p></div></div>
              <div className="theme-options">
                {themeOptions.map(({ value, label, icon: Icon }) => <button key={value} className={preferences.theme === value ? 'active' : ''} onClick={() => setPreferences((current) => ({ ...current, theme: value }))}><Icon size={20} /><span>{label}</span></button>)}
              </div>
            </section>
            <ThemePaletteEditor />
            <section className="settings-pane setting-row">
              <div><strong>减少动态效果</strong><p>关闭非必要动效，仍保留必要的状态反馈。</p></div>
              <Switch checked={preferences.reduceMotion} onCheckedChange={(checked) => setPreferences((current) => ({ ...current, reduceMotion: checked }))} aria-label="减少动态效果" />
            </section>
            <Button variant="outline" onClick={resetPreferences}><RotateCcw />恢复默认设置</Button>
          </> : <>
            <header className="settings-content-header"><span className="eyebrow">ABOUT</span><h2>关于框架</h2><p>业务无关、可直接派生的基础应用壳。</p></header>
            <section className="settings-pane about-grid">
              <div><span>运行环境</span><strong>{window.sylunae ? 'Electron 桌面端' : 'Web 浏览器'}</strong></div>
              <div><span>应用版本</span><strong>0.1.0</strong></div>
              <div><span>渲染引擎</span><strong>{window.sylunae ? `Chromium ${window.sylunae.versions.chrome}` : '当前浏览器'}</strong></div>
              <div><span>设计系统</span><strong>shadcn/ui + Tailwind CSS</strong></div>
            </section>
          </>}
        </main>
      </div>
    </DialogContent>
  </Dialog>
}
