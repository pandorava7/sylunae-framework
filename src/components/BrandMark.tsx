import { MoonStar } from 'lucide-react'

export function BrandMark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark${small ? ' small' : ''}`} aria-hidden="true">
    <MoonStar size={small ? 15 : 20} strokeWidth={1.8} />
  </span>
}
