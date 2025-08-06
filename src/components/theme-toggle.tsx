import { useEffect, useState } from 'react'

import { ComputerIcon } from '@icons/computer'
import { MoonIcon } from '@icons/moon-icon'
import { SunIcon } from '@icons/sun'
import { VCenterRow } from './layout/v-center-row'

type Theme = 'light' | 'dark' | 'system'

const BUTTON_CLS =
  'rounded-full w-7 h-7 aspect-square shrink-0 data-[active=true]:bg-muted flex items-center justify-center opacity-70 hover:opacity-100 focus-visible:opacity-100 data-[active=true]:opacity-100'

function getSystemTheme() {
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: string) {
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
}

export function ThemeToggle() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('system')

  // Load saved theme or detect system preference
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'system'
    setTheme(saved as Theme)
    applyTheme(saved)

    // Listen to system changes if using system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemChangeHandler = () => {
      if (localStorage.getItem('theme') === 'system') {
        applyTheme('system')
      }
    }
    mediaQuery.addEventListener('change', systemChangeHandler)
    return () => mediaQuery.removeEventListener('change', systemChangeHandler)
  }, [])

  function clickTheme(theme: Theme) {
    setTheme(theme)
    localStorage.setItem('theme', theme)
    applyTheme(theme)
  }

  const cycleTheme = () => {
    const next =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    applyTheme(next as Theme)
  }

  function getIcon(theme: Theme) {
    switch (theme) {
      case 'light':
        return <SunIcon className="w-4" />
      case 'dark':
        return <MoonIcon className="w-4" />
      default:
        return <ComputerIcon className="w-4 -scale-x-100" />
    }
  }

  // placeholder to stop layout shift. We must wait until component
  // has mounted before using theme value
  // if (!mounted) {
  //   return <Button aria-label="Toggle dark mode" size="lg-icon" />
  // }

  return (
    <>
      {/* <Button
        variant="muted-light"
        size="icon"
        onClick={cycleTheme}
        aria-label="Toggle theme"
        title="Toggle theme"
        className="lg:hidden justify-center fill-foreground cursor-pointer"
      >
        {getIcon(theme)}
      </Button> */}

      <VCenterRow className="border border-border rounded-full overflow-hidden p-0.5">
        <button
          onClick={() => clickTheme('light')}
          className={BUTTON_CLS}
          data-active={theme === 'light'}
          title="Light theme"
          aria-label="Set theme to light"
        >
          <SunIcon className="w-4" />
        </button>
        <button
          onClick={() => clickTheme('dark')}
          className={BUTTON_CLS}
          data-active={theme === 'dark'}
          title="Dark theme"
          aria-label="Set theme to dark"
        >
          <MoonIcon className="w-4" />
        </button>
        <button
          onClick={() => clickTheme('system')}
          className={BUTTON_CLS}
          data-active={theme === 'system'}
          title="System theme"
          aria-label="Set theme to system"
        >
          <ComputerIcon className="w-4 -scale-x-100" />
        </button>
      </VCenterRow>
    </>
  )
}
