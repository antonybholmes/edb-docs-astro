'use client'

import type { IClassProps } from '@interfaces/class-props'

import { QCP } from '@/query'
import { httpFetch } from '@lib/http/http-fetch'
import { useQuery } from '@tanstack/react-query'
import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import { Autocomplete } from '../autocomplete'
import { SearchIcon } from '../icons/search-icon'

export interface SearchIndexNode {
  t: string // title
  d: string // description
  w: string // words for fuzzy search
  u: string // url
}

function HelpAutocomplete({ className }: IClassProps) {
  const [searchResults, setResults] = useState<SearchIndexNode[]>([])

  // Fetch search data from /search.json
  const { data } = useQuery({
    queryKey: ['searchData'],
    queryFn: async () => {
      const res =
        await httpFetch.getJson<SearchIndexNode[]>('/search-index.json')

      return res
    },
  })

  const searchIndex = useMemo(() => {
    if (!data) return null

    //logger.log('Creating search index', data)

    return new Fuse(data, {
      keys: ['t', 'd', 'w'], // Fields to search
      threshold: 0.4, // Fuzzy match level
      ignoreLocation: true,
    })
  }, [data])

  function handleSearch(query: string) {
    if (!searchIndex) {
      return
    }

    //console.log(query)

    const results = searchIndex.search(query)

    setResults(results.map((result) => result.item))
  }

  return (
    <Autocomplete onTextChange={handleSearch} className={className}>
      {searchResults.map((item, li) => (
        <li key={li}>
          <a
            href={item.u}
            className="hover:bg-muted/50 focus-visible:bg-muted/50 outline-none h-9  flex flex-row items-center px-3 gap-x-2"
            aria-label={item.t}
          >
            <SearchIcon className="shrink-0" />

            <span className="font-medium">{item.t}</span>

            <span className="text-xs text-foreground/50 truncate">
              {item.d}
            </span>
          </a>
        </li>
      ))}
    </Autocomplete>
  )
}

export function HelpAutocompleteQuery({ className }: IClassProps) {
  return (
    <QCP>
      <HelpAutocomplete className={className} />
    </QCP>
  )
}
