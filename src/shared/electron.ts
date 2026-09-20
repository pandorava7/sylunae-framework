export type TitlebarTheme = 'light' | 'dark'

export interface SylunaeShellAPI {
  readonly platform: 'electron'
  readonly versions: Readonly<Record<'electron' | 'chrome' | 'node', string>>
  system: {
    openExternal(url: string): Promise<boolean>
    setTitlebarTheme(theme: TitlebarTheme): Promise<void>
  }
}
