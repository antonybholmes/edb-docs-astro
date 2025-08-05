import { useEffect, useState } from 'react'

import { ComputerIcon } from '@icons/computer'
import { MoonIcon } from '@icons/moon-icon'
import { SunIcon } from '@icons/sun'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './shadcn/ui/themed/dropdown-menu'

type Theme = 'light' | 'dark' | 'system'

function getSystemTheme() {
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: string) {
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
}

export function ThemeMenu() {
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
        return <MoonIcon className="w-3.5" />
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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
          className="justify-center fill-foreground"
        >
          {getIcon(theme)}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        onEscapeKeyDown={() => setOpen(false)}
        onInteractOutside={() => setOpen(false)}
        align="end"
        className="fill-foreground"
      >
        <DropdownMenuItem
          onClick={() => clickTheme('light')}
          aria-label="Set theme to light"
        >
          <SunIcon className="w-4" />

          <span>Light mode</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => clickTheme('dark')}
          aria-label="Set theme to dark"
        >
          <MoonIcon className="w-3.5" />

          <span>Dark mode</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => clickTheme('system')}
          aria-label="Set theme to system"
        >
          <ComputerIcon className="w-4 -scale-x-100" />

          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
