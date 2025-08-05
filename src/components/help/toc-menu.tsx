import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { VCenterRow } from '../layout/v-center-row'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../shadcn/ui/themed/popover'
import { TableOfContents } from '../toc'

export function TocMenu() {
  const [open, setOpen] = useState(false)

  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    // Collect all h1, h2, h3 from the page that have IDs (added by rehype-slug)
    const elements = Array.from(
      // document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]')
      // h1 is reserved for the main title, so we can skip it
      document.querySelectorAll('h2[id], h3[id], h4[id]')
    ) as HTMLElement[]

    const headingData = elements.map((el) => ({
      id: el.id,
      text: el.innerText,
      level: Number(el.tagName.substring(1)),
    }))

    const onScroll = () => {
      const scrollPosition = window.scrollY + 100 // offset for better detection
      let current = headingData[0]?.text

      for (const heading of headingData) {
        const element = document.getElementById(heading.id)
        if (element && element.offsetTop <= scrollPosition) {
          current = heading.text
        } else {
          break
        }
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <VCenterRow className="gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            data-state={open ? 'open' : 'closed'}
            className="shrink-0 grow-0 text-sm flex flex-row gap-2 items-center bg-background border border-border rounded-theme px-2 py-1.5 hover:bg-muted/50 data-[state=open]:bg-muted/50 focus-visible:bg-muted/50 outline-none"
            title="Open docs menu"
          >
            <span> On This Page </span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="flex flex-col w-72 p-4"
          side="bottom"
          sideOffset={4}
          align="start"
        >
          <TableOfContents title="" />
        </PopoverContent>
      </Popover>

      {activeId && (
        <span className="text-sm text-foreground/70">
          <strong>{activeId}</strong>
        </span>
      )}
    </VCenterRow>
  )
}
