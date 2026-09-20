import { ExternalLink, FileCode2, Github, Monitor, Smartphone } from 'lucide-react'
import { appConfig } from '@/config/app'
import { BrandMark } from '@/components/BrandMark'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  const openRepository = () => {
    const url = 'https://github.com/your-name/your-project'
    if (window.sylunae) void window.sylunae.system.openExternal(url)
    else window.open(url, '_blank', 'noopener,noreferrer')
  }
  return <div className="page about-page page-enter">
    <header className="about-hero"><BrandMark /><span className="eyebrow">{appConfig.eyebrow}</span><h1>{appConfig.name}</h1><p>{appConfig.description}</p><Button variant="outline" onClick={openRepository}><Github />仓库占位链接<ExternalLink /></Button></header>
    <section className="about-details">
      <article><Monitor /><div><strong>Electron 桌面端</strong><p>隐藏原生标题栏、安全 preload、外部链接拦截与 Windows 安装包配置。</p></div></article>
      <article><Smartphone /><div><strong>响应式 Web</strong><p>760px 以下切换抽屉导航，处理安全区、触摸目标和小屏内容密度。</p></div></article>
      <article><FileCode2 /><div><strong>集中式配置</strong><p>名称、导航、SEO、构建元数据和视觉令牌都有明确修改入口。</p></div></article>
    </section>
  </div>
}
