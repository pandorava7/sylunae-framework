import { Bell, Check, ChevronsUpDown, Copy, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function ComponentsPage() {
  const [notifications, setNotifications] = useState(true)
  return <div className="page page-enter">
    <header className="page-header"><div><span className="eyebrow">SHADCN/UI</span><h1>基础组件</h1><p>组件源码已包含在项目内，可按需修改并继续通过 CLI 添加。</p></div><Badge variant="secondary">26 components</Badge></header>
    <Tabs defaultValue="form" className="component-tabs">
      <TabsList><TabsTrigger value="form">表单</TabsTrigger><TabsTrigger value="actions">操作</TabsTrigger><TabsTrigger value="cards">卡片</TabsTrigger></TabsList>
      <TabsContent value="form" className="component-showcase">
        <Card><CardHeader><CardTitle>创建配置</CardTitle><CardDescription>一组可直接复用的表单控件。</CardDescription></CardHeader><CardContent className="form-stack"><label>名称<Input placeholder="输入配置名称" /></label><label>模板<Select defaultValue="desktop"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="desktop">桌面应用</SelectItem><SelectItem value="web">Web 应用</SelectItem><SelectItem value="hybrid">混合应用</SelectItem></SelectContent></Select></label><label>描述<Textarea placeholder="描述这个配置的用途…" /></label><div className="switch-row"><span><strong>启用通知</strong><small>仅展示开关的通用状态。</small></span><Switch checked={notifications} onCheckedChange={setNotifications} /></div><label>界面密度<Slider defaultValue={[58]} /></label><label className="checkbox-row"><Checkbox defaultChecked />接受示例配置</label></CardContent><CardFooter><Button>保存配置</Button><Button variant="outline">取消</Button></CardFooter></Card>
      </TabsContent>
      <TabsContent value="actions" className="component-showcase"><Card><CardHeader><CardTitle>按钮与反馈</CardTitle><CardDescription>默认、次要、危险和图标操作。</CardDescription></CardHeader><CardContent className="button-showcase"><Button><WandSparkles />主要操作</Button><Button variant="secondary"><Check />已完成</Button><Button variant="outline"><Copy />复制</Button><Button variant="destructive">危险操作</Button><Tooltip><TooltipTrigger asChild><Button size="icon" variant="ghost"><Bell /><span className="sr-only">通知</span></Button></TooltipTrigger><TooltipContent>通知</TooltipContent></Tooltip></CardContent></Card></TabsContent>
      <TabsContent value="cards" className="component-showcase"><div className="showcase-card-grid">{['最近使用', '团队空间', '草稿箱'].map((title, index) => <Card key={title}><CardHeader><div className="card-row"><Badge variant={index === 0 ? 'default' : 'outline'}>{index === 0 ? '活跃' : '示例'}</Badge><ChevronsUpDown size={16} /></div><CardTitle>{title}</CardTitle><CardDescription>这是一个可替换的卡片内容区域。</CardDescription></CardHeader><CardContent><div className="skeleton-lines"><i /><i /><i /></div></CardContent></Card>)}</div></TabsContent>
    </Tabs>
  </div>
}
