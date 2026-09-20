try {
  const value = JSON.parse(localStorage.getItem('sylunae-framework.preferences') || '{}') as { theme?: string }
  const theme = value.theme === 'dark' || value.theme === 'light'
    ? value.theme
    : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle('dark', theme === 'dark')
} catch { /* Invalid preferences are normalized after React starts. */ }
