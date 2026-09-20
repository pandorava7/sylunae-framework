import { contextBridge, ipcRenderer } from 'electron'
import type { SylunaeShellAPI, TitlebarTheme } from '../../src/shared/electron'

const api: SylunaeShellAPI = Object.freeze({
  platform: 'electron',
  versions: Object.freeze({
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  }),
  system: Object.freeze({
    openExternal: (url: string) => ipcRenderer.invoke('shell:open-external', url),
    setTitlebarTheme: (theme: TitlebarTheme) => ipcRenderer.invoke('shell:set-titlebar-theme', theme),
  }),
})

contextBridge.exposeInMainWorld('sylunae', api)
