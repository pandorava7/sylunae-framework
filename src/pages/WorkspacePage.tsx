import { Activity, ArrowUpRight, Clock3, MoreHorizontal, Plus, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

const placeholders = [
  { title: '主要工作流', note: '替换为项目的核心任务', progress: 76, state: '进行中' },
  { title: '次要工作流', note: '适合列表、记录或资源', progress: 42, state: '计划中' },
  { title: '扩展模块', note: '通过懒加载保持首屏轻量', progress: 18, state: '待开始' },
]

export default function WorkspacePage() {
  return <div className="page page-enter">
    <header className="page-header"><div><span className="eyebrow">WORKSPACE</span><h1>工作区</h1><p>一个没有业务绑定的内容页结构，可以直接替换为项目功能。</p></div><Button><Plus />新建项目</Button></header>
    <div className="workspace-toolbar"><div className="search-field"><Search size={16} /><Input aria-label="搜索" placeholder="搜索内容…" /></div><Button variant="outline"><Clock3 />最近更新</Button></div>
    <div className="metric-grid">
      <Card><CardHeader><CardTitle>活跃项目</CardTitle><Activity /></CardHeader><CardContent><strong>12</strong><p>较上周增加 3 个</p></CardContent></Card>
      <Card><CardHeader><CardTitle>完成率</CardTitle><ArrowUpRight /></CardHeader><CardContent><strong>68%</strong><p>保持稳定推进</p></CardContent></Card>
      <Card><CardHeader><CardTitle>等待处理</CardTitle><Clock3 /></CardHeader><CardContent><strong>07</strong><p>今天建议优先处理</p></CardContent></Card>
    </div>
    <section className="content-card">
      <div className="section-heading"><div><h2>项目概览</h2><p>这里展示通用的行式内容与状态表达。</p></div><Button variant="ghost" size="icon" aria-label="更多"><MoreHorizontal /></Button></div>
      <div className="placeholder-list">{placeholders.map((item) => <article key={item.title}><div className="placeholder-leading"><span>{item.title.slice(0, 1)}</span><div><strong>{item.title}</strong><small>{item.note}</small></div></div><div className="placeholder-progress"><Progress value={item.progress} /><span>{item.progress}%</span></div><Badge variant="outline">{item.state}</Badge></article>)}</div>
    </section>
  </div>
}
