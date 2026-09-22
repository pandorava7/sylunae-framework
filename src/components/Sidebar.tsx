import { memo, useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { ChevronDown, Info, Menu, MoreHorizontal, Settings } from 'lucide-react'
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
  const drag = useRef<{ x: number; lastX: number; width: number; shell: HTMLElement; handle: HTMLDivElement; pointerId: number; frame: number | null } | null>(null)
  const [mobileViewport, setMobileViewport] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const compact = collapsed && !mobileViewport

  const select = (route: RouteId) => { onSelect(route); onCloseMobile() }
  const previewWidth = (rawWidth: number) => {
    const next = rawWidth <= SIDEBAR_COLLAPSE_THRESHOLD ? SIDEBAR_COLLAPSED : Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, rawWidth))
    drag.current?.shell.style.setProperty('--sidebar-width', `${next}px`)
    document.body.classList.toggle('sidebar-preview-collapsed', next === SIDEBAR_COLLAPSED)
    document.body.classList.toggle('sidebar-preview-expanded', next !== SIDEBAR_COLLAPSED)
  }
  const stopResizeAt = useCallback((clientX?: number) => {
    const current = drag.current
    if (!current) return
    if (current.frame !== null) cancelAnimationFrame(current.frame)
    const rawWidth = current.width + (clientX ?? current.lastX) - current.x
    const nextCollapsed = rawWidth <= SIDEBAR_COLLAPSE_THRESHOLD
    const nextWidth = nextCollapsed ? expandedWidth : Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, rawWidth))
    drag.current = null
    if (current.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId)
    document.body.classList.remove('sidebar-resizing', 'sidebar-preview-collapsed', 'sidebar-preview-expanded')
    onResize(nextWidth, nextCollapsed)
  }, [expandedWidth, onResize])
  const startResize = (event: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(max-width: 760px)').matches) return
    const shell = event.currentTarget.closest<HTMLElement>('.app-shell')
    if (!shell) return
    stopResizeAt()
    drag.current = { x: event.clientX, lastX: event.clientX, width, shell, handle: event.currentTarget, pointerId: event.pointerId, frame: null }
    event.currentTarget.setPointerCapture(event.pointerId)
    document.body.classList.add('sidebar-resizing')
  }
  const resize = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    drag.current.lastX = event.clientX
    const next = drag.current.width + event.clientX - drag.current.x
    if (drag.current.frame !== null) cancelAnimationFrame(drag.current.frame)
    drag.current.frame = requestAnimationFrame(() => previewWidth(next))
  }
  const stopResize = (event: PointerEvent<HTMLDivElement>) => {
    stopResizeAt(event.clientX)
  }

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)')
    const updateViewport = () => setMobileViewport(media.matches)
    const stopFromPointer = (event: globalThis.PointerEvent) => {
      if (drag.current?.pointerId === event.pointerId) stopResizeAt(event.clientX)
    }
    const stopFromInterruption = () => stopResizeAt()
    const stopWhenHidden = () => { if (document.hidden) stopResizeAt() }
    media.addEventListener('change', updateViewport)
    window.addEventListener('pointerup', stopFromPointer, true)
    window.addEventListener('pointercancel', stopFromPointer, true)
    window.addEventListener('blur', stopFromInterruption)
    document.addEventListener('visibilitychange', stopWhenHidden)
    return () => {
      media.removeEventListener('change', updateViewport)
      window.removeEventListener('pointerup', stopFromPointer, true)
      window.removeEventListener('pointercancel', stopFromPointer, true)
      window.removeEventListener('blur', stopFromInterruption)
      document.removeEventListener('visibilitychange', stopWhenHidden)
      if (drag.current?.frame !== null && drag.current?.frame !== undefined) cancelAnimationFrame(drag.current.frame)
      document.body.classList.remove('sidebar-resizing', 'sidebar-preview-collapsed', 'sidebar-preview-expanded')
    }
  }, [stopResizeAt])

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
        {appConfig.navigation.map((item) => {
          const Icon = item.icon
          if (item.kind === 'link') return <button
            key={item.id}
            className={active === item.id ? 'active' : ''}
            onClick={() => select(item.id)}
            title={item.label}
            aria-current={active === item.id ? 'page' : undefined}
          ><Icon size={19} strokeWidth={1.7} /><span>{item.label}</span></button>

          const expanded = item.children.some((child) => child.id === active)
          return <div className={`nav-group${expanded ? ' expanded' : ''}`} key={item.id}>
            <button className={expanded ? 'active' : ''} onClick={() => select(item.children[0].id)} title={item.label} aria-expanded={expanded}>
              <Icon size={19} strokeWidth={1.7} /><span>{item.label}</span>{!collapsed && <ChevronDown className="nav-group-chevron" size={15} strokeWidth={1.8} />}
            </button>
            <div className="nav-children" aria-hidden={!expanded}>
              {item.children.map((child) => {
                const ChildIcon = child.icon
                return <button key={child.id} className={active === child.id ? 'active' : ''} onClick={() => select(child.id)} title={child.label} tabIndex={expanded ? 0 : -1} aria-current={active === child.id ? 'page' : undefined}>
                  <ChildIcon size={17} strokeWidth={1.7} /><span>{child.label}</span>
                </button>
              })}
            </div>
          </div>
        })}
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

      <div className="sidebar-resize-handle" role="separator" aria-orientation="vertical" aria-label="调整导航栏宽度" aria-valuemin={SIDEBAR_COLLAPSED} aria-valuemax={SIDEBAR_MAX} aria-valuenow={collapsed ? SIDEBAR_COLLAPSED : width} onPointerDown={startResize} onPointerMove={resize} onPointerUp={stopResize} onPointerCancel={stopResize} onLostPointerCapture={() => stopResizeAt()} />
    </aside>
  </>
})
