export function PageLoader({ label = '正在加载页面…' }: { label?: string }) {
  return <div className="page-loader" role="status"><span className="spinner" /><span>{label}</span></div>
}
