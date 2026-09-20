import { ArrowRight, Gauge, LayoutPanelLeft, MonitorSmartphone, Palette, Sparkles, Zap } from 'lucide-react'
import { appConfig } from '@/config/app'
import { navigate } from '@/app/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  { icon: LayoutPanelLeft, title: '应用壳', description: '可折叠、可拖拽的导航与独立内容区。' },
  { icon: Palette, title: '设计系统', description: '集中维护的颜色、字号、圆角与 shadcn/ui。' },
  { icon: MonitorSmartphone, title: '多端适配', description: '同一渲染层兼容网页、桌面端与手机宽度。' },
  { icon: Zap, title: '性能优先', description: '路由级拆包、按需挂载与低频状态持久化。' },
]

export default function HomePage() {
  return <div className="page home-page page-enter">
    <section className="hero-panel">
      <div className="hero-copy">
        <Badge variant="secondary"><Sparkles />基础框架已就绪</Badge>
        <span className="eyebrow">{appConfig.eyebrow}</span>
        <h1>从稳定的壳开始，<br />把精力留给真正的产品。</h1>
        <p>{appConfig.description}</p>
        <div className="hero-actions">
          <Button onClick={() => navigate('workspace')}>查看内容模板 <ArrowRight /></Button>
          <Button variant="outline" onClick={() => navigate('components')}>浏览组件</Button>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="mini-window"><span /><span /><span /><div className="mini-sidebar" /><div className="mini-content"><i /><i /><i /></div></div>
        <div className="performance-chip"><Gauge size={17} /><span><strong>Ready</strong><small>Electron + Web</small></span></div>
      </div>
    </section>
    <section className="feature-grid">
      {features.map(({ icon: Icon, title, description }) => <Card key={title} className="feature-card"><CardHeader><span className="feature-icon"><Icon size={19} /></span><CardTitle>{title}</CardTitle></CardHeader><CardContent><CardDescription>{description}</CardDescription></CardContent></Card>)}
    </section>
  </div>
}
