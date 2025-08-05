// scripts/generate-search-index.tsx
import fs from 'fs'
import { globby } from 'globby'
import matter from 'gray-matter'
import path from 'path'

interface DocEntry {
  t: string // title
  u: string // url
  c: string // content
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

    const matches = [...content.matchAll(/^#{2,6}\s+(.*)/gm)]

    const words = new Set<string>() //title.toLowerCase().split(/\s+/))

    for (const match of matches) {
      const headingText = match[1].trim()

      words.add(headingText.toLowerCase())
    }

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
      u: url,
      c: [...words].sort().join(' '), //content.slice(0, 1000).replace(/\s+/g, ' '), // trim & normalize
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
