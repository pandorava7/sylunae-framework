import type { SylunaeShellAPI } from './shared/electron'

declare global {
  interface Window {
    sylunae?: SylunaeShellAPI
  }
}

export {}
