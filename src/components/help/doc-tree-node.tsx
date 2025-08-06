import type { IClassProps } from '@/interfaces/class-props'
import type { DocNode } from '@/lib/docs'
import type { IChildrenProps } from '@interfaces/children-props'
import { cn } from '@lib/shadcn-utils'
import { createContext, useContext, useState } from 'react'
import { ChevronRightIcon } from '../icons/chevron-right-icon'
import { VCenterRow } from '../layout/v-center-row'

const DocNodeContext = createContext<{
  selected: string
  setSelected: (selected: string) => void
  expanded: boolean
  slug: string[]
}>({
  selected: '',
  setSelected: () => {},

  slug: [],
  expanded: false,
})

interface IDocNodeProps extends IChildrenProps {
  selected: string
  setSelected: (selected: string) => void
  expanded: boolean
  slug: string[]
}

export const DocNodeProvider = ({
  selected,
  setSelected,
  expanded,
  slug,
  children,
}: IDocNodeProps) => {
  // useEffect(() => {
  //   // sync internal value to external if it changes
  //   setSelected(selected)
  // }, [selected])

  return (
    <DocNodeContext.Provider value={{ selected, setSelected, slug, expanded }}>
      {children}
    </DocNodeContext.Provider>
  )
}

export function DocTreeNode({
  node,
  slug,
  level = 0,
  expanded = false,
  className,
}: IClassProps & {
  node: DocNode
  slug: string[]
  level?: number
  expanded?: boolean
}) {
  const [selected, setSelected] = useState(slug.join('/'))

  return (
    <DocNodeProvider
      selected={selected}
      setSelected={setSelected}
      slug={slug}
      expanded={expanded}
    >
      <ul className={cn('flex flex-col', className)}>
        {node.children.map((child, index) => (
          <BaseDocTreeNode key={index} node={child} level={level} />
        ))}
      </ul>
    </DocNodeProvider>
  )
}

function BaseDocTreeNode({ level, node }: { level: number; node: DocNode }) {
  const { selected, setSelected, slug, expanded } = useContext(DocNodeContext)
  const hasChildren = node.children && node.children.length > 0

  // auto determine which nodes are open by comparing the path at each level
  // with the node path at the same level. If they mirror each other, keep
  // all the nodes open
  const [isOpen, setIsOpen] = useState(
    expanded || node.slug[level] === slug[level]
  )

  const name = node.title // .name.replace(/[\_\-]/g, ' ')

  const isSelected = selected === node.slug.join('/')

  //const slug = getSlug(node.path.join('/'))

  return (
    <li className="flex flex-col gap-y-0.5 ">
      <VCenterRow className="h-9 gap-x-0.5">
        <span
          className="data-[checked=true]:bg-theme w-1 h-5 rounded-full shrink-0"
          data-checked={isSelected}
        />

        <VCenterRow
          className={cn(
            'justify-between items-center grow shrink-0 rounded-theme h-full gap-x-1',
            isSelected
              ? 'bg-muted/70 font-semibold'
              : 'text-foreground/70 hover:text-foreground'
          )}
        >
          {hasChildren ? (
            <button
              className="flex flex-row items-center grow justify-between h-full gap-x-2 pr-1"
              onClick={() => {
                setIsOpen(!isOpen)

                setSelected(node.slug.join('/'))
              }}
              style={{
                paddingLeft: `${level * 0.5 + 0.25}rem`,
              }}
            >
              <span className="flex flex-row items-center justify-start grow">
                {name}
              </span>

              <VCenterRow className="justify-center w-4">
                <ChevronRightIcon
                  className="trans-transform"
                  style={{
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                />
              </VCenterRow>
            </button>
          ) : (
            <a
              href={'/' + node.slug.join('/')}
              className="flex flex-row items-center justify-start grow h-full"
              style={{
                paddingLeft: `${level * 0.5 + 0.5}rem`,
              }}
            >
              {name}
            </a>
          )}
        </VCenterRow>
      </VCenterRow>
      {node && node.children && isOpen && (
        <ul className="flex flex-col gap-y-0.5">
          {node.children.map((child, index) => (
            <BaseDocTreeNode key={index} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}
