import { memo, useEffect, useRef, useState, type PointerEvent } from 'react'
import { Info, Menu, MoreHorizontal, Settings } from 'lucide-react'
import { SIDEBAR_COLLAPSED, SIDEBAR_COLLAPSE_THRESHOLD, SIDEBAR_MAX, SIDEBAR_MIN } from '@/app/preferences'
import { appConfig, type RouteId } from '@/config/app'
import { BrandMark } from './BrandMark'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

interface SidebarProps {
  active: RouteId
  collapsed: boolean
  width: number
  expandedWidth: number
  mobileOpen: boolean
  settingsOpen: boolean
  onSelect: (route: RouteId) => void
  onResize: (width: number, collapsed: boolean) => void
  onOpenSettings: () => void
  onOpenMobile: () => void
  onCloseMobile: () => void
}

export const Sidebar = memo(function Sidebar({
  active, collapsed, width, expandedWidth, mobileOpen, settingsOpen, onSelect, onResize, onOpenSettings, onOpenMobile, onCloseMobile,
}: SidebarProps) {
  const drag = useRef<{ x: number; width: number; shell: HTMLElement; frame: number | null } | null>(null)
  const [mobileViewport, setMobileViewport] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const compact = collapsed && !mobileViewport

  const select = (route: RouteId) => { onSelect(route); onCloseMobile() }
  const previewWidth = (rawWidth: number) => {
    const next = rawWidth <= SIDEBAR_COLLAPSE_THRESHOLD ? SIDEBAR_COLLAPSED : Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, rawWidth))
    drag.current?.shell.style.setProperty('--sidebar-width', `${next}px`)
    document.body.classList.toggle('sidebar-preview-collapsed', next === SIDEBAR_COLLAPSED)
    document.body.classList.toggle('sidebar-preview-expanded', next !== SIDEBAR_COLLAPSED)
  }
  const startResize = (event: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(max-width: 760px)').matches) return
    const shell = event.currentTarget.closest<HTMLElement>('.app-shell')
    if (!shell) return
    drag.current = { x: event.clientX, width, shell, frame: null }
    event.currentTarget.setPointerCapture(event.pointerId)
    document.body.classList.add('sidebar-resizing')
  }
  const resize = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const next = drag.current.width + event.clientX - drag.current.x
    if (drag.current.frame) cancelAnimationFrame(drag.current.frame)
    drag.current.frame = requestAnimationFrame(() => previewWidth(next))
  }
  const stopResize = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    if (drag.current.frame) cancelAnimationFrame(drag.current.frame)
    const rawWidth = drag.current.width + event.clientX - drag.current.x
    const nextCollapsed = rawWidth <= SIDEBAR_COLLAPSE_THRESHOLD
    const nextWidth = nextCollapsed ? expandedWidth : Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, rawWidth))
    drag.current = null
    document.body.classList.remove('sidebar-resizing', 'sidebar-preview-collapsed', 'sidebar-preview-expanded')
    onResize(nextWidth, nextCollapsed)
  }

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)')
    const updateViewport = () => setMobileViewport(media.matches)
    media.addEventListener('change', updateViewport)
    return () => {
      media.removeEventListener('change', updateViewport)
      if (drag.current?.frame) cancelAnimationFrame(drag.current.frame)
      document.body.classList.remove('sidebar-resizing', 'sidebar-preview-collapsed', 'sidebar-preview-expanded')
    }
  }, [])

  return <>
    <button className="mobile-menu" onClick={onOpenMobile} aria-label="打开导航"><Menu size={20} /></button>
    {mobileOpen && <button className="sidebar-backdrop" onClick={onCloseMobile} aria-label="关闭导航" />}
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`} aria-hidden={mobileViewport && !mobileOpen ? true : undefined} inert={mobileViewport && !mobileOpen ? true : undefined}>
      <button className="brand" onClick={() => select('home')} aria-label="返回开始页">
        <BrandMark />
        <span className="brand-copy"><strong>{appConfig.name}</strong><small>{appConfig.eyebrow}</small></span>
      </button>

      <nav aria-label="主导航">
        <div className="nav-caption">应用</div>
        {appConfig.navigation.map(({ id, label, icon: Icon }) => <button
          key={id}
          className={active === id ? 'active' : ''}
          onClick={() => select(id)}
          title={label}
          aria-current={active === id ? 'page' : undefined}
        ><Icon size={19} strokeWidth={1.7} /><span>{label}</span></button>)}
      </nav>

      <div className="sidebar-footer">
        {compact ? <DropdownMenu>
          <DropdownMenuTrigger asChild><button className={settingsOpen || active === 'about' ? 'active' : ''} title="更多操作" aria-label="更多操作"><MoreHorizontal size={20} /></button></DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuItem onSelect={() => select('about')}><Info />关于</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => { onOpenSettings(); onCloseMobile() }}><Settings />设置</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> : <>
          <button className={active === 'about' ? 'active' : ''} onClick={() => select('about')} title="关于" aria-label="关于">
            <Info size={19} strokeWidth={1.7} /><span>关于</span>
          </button>
          <button className={settingsOpen ? 'active' : ''} onClick={() => { onOpenSettings(); onCloseMobile() }} title="设置" aria-haspopup="dialog" aria-expanded={settingsOpen}>
            <Settings size={19} strokeWidth={1.7} /><span>设置</span>
          </button>
        </>}
      </div>

      <div className="sidebar-resize-handle" role="separator" aria-orientation="vertical" aria-label="调整导航栏宽度" aria-valuemin={SIDEBAR_COLLAPSED} aria-valuemax={SIDEBAR_MAX} aria-valuenow={collapsed ? SIDEBAR_COLLAPSED : width} onPointerDown={startResize} onPointerMove={resize} onPointerUp={stopResize} onPointerCancel={stopResize} />
    </aside>
  </>
})
