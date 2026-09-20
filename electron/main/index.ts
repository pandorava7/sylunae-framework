import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import type { TitlebarTheme } from '../../src/shared/electron'

const TITLEBAR_HEIGHT = 42

function titlebarOverlay(theme: TitlebarTheme) {
  return {
    color: '#00000000',
    symbolColor: theme === 'dark' ? '#a1a1a1' : '#707070',
    height: TITLEBAR_HEIGHT,
  }
}

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1380,
    height: 880,
    minWidth: 360,
    minHeight: 560,
    show: false,
    backgroundColor: '#ffffff',
    icon: app.isPackaged ? undefined : fileURLToPath(new URL('../../build/icon.png', import.meta.url)),
    titleBarStyle: 'hidden',
    titleBarOverlay: titlebarOverlay('light'),
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: true,
    },
  })

  window.once('ready-to-show', () => window.show())
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) void shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env.ELECTRON_RENDERER_URL) void window.loadURL(process.env.ELECTRON_RENDERER_URL)
  else void window.loadFile(fileURLToPath(new URL('../renderer/index.html', import.meta.url)))
}

function registerIpc(): void {
  ipcMain.handle('shell:open-external', (_event, value: unknown) => {
    if (typeof value !== 'string' || !/^https?:\/\//i.test(value)) return false
    void shell.openExternal(value)
    return true
  })
  ipcMain.handle('shell:set-titlebar-theme', (event, value: unknown) => {
    if (value !== 'light' && value !== 'dark') return
    BrowserWindow.fromWebContents(event.sender)?.setTitleBarOverlay(titlebarOverlay(value))
  })
}

app.whenReady().then(() => {
  registerIpc()
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
