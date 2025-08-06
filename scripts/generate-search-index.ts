// scripts/generate-search-index.tsx
import fs from 'fs'
import { globby } from 'globby'
import matter from 'gray-matter'
import path from 'path'

interface DocEntry {
  t: string // title
  d: string // description
  u: string // url
  w: string // words for fuzzy search
}

async function generateSearchIndex() {
  const docsPath = path.resolve('src/content/docs')
  const outputPath = path.resolve('public/search-index.json')

  const files = await globby(['**/*.md', '**/*.mdx'], { cwd: docsPath })

  const index: DocEntry[] = []

  for (const file of files) {
    const fullPath = path.join(docsPath, file)
    const fileContent = fs.readFileSync(fullPath, 'utf-8')

    const { data, content } = matter(fileContent)

    const title = data.title ?? file.replace(/\.mdx?$/, '')
    const url = '/' + file.replace(/\.mdx?$/, '')

    const keywords = (data.keywords || [])
      .map((keyword: string) => keyword.toLowerCase().split(/\s+/))
      .flat()

    const matches = [...content.matchAll(/^#{2,6}\s+(.*)/gm)]

    const words = new Set<string>() //title.toLowerCase().split(/\s+/))

    for (const keyword of keywords) {
      words.add(keyword)
    }

    for (const match of matches) {
      const headingText = match[1].trim()

      for (const word of headingText.toLowerCase().split(/\s+/)) {
        words.add(word)
      }
    }

    const filteredWords = [...words]
      .sort()
      .filter(
        (word) =>
          word.length > 2 &&
          !['the', 'and', 'for', 'with', 'that', 'this', 'is', 'of'].includes(
            word
          )
      )

    console.log(filteredWords)

    // const contentWords = content
    //   .replace(/<[^>]+>/g, '') // Remove HTML tags
    //   .replace(/[\W_]+/g, ' ') // Remove non-word characters
    //   .replace(/\s+/g, ' ') // Normalize whitespace
    //   .toLowerCase()
    //   .split(' ')
    //   .filter((word) => word.length > 2 && !words.has(word))

    // for (const word of contentWords) {
    //   words.add(word)
    // }

    // Join unique words back into a string
    //const uniqueContent = [...words].sort().join(' ')

    index.push({
      t: title,
      d: data.description || '',
      u: url,
      w: filteredWords.join(' '), //content.slice(0, 1000).replace(/\s+/g, ' '), // trim & normalize
    })
  }

  fs.writeFileSync(outputPath, JSON.stringify(index)) //, null, 2))
  console.log(
    `✅ Created search index with ${index.length} docs → public/search-index.json`
  )
}

generateSearchIndex().catch((err) => {
  console.error('❌ Failed to generate search index:', err)
  process.exit(1)
})
