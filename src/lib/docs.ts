import fs from 'fs'
import { globby } from 'globby'
import matter from 'gray-matter'

export const DOCS_DIR = './src/content/docs'

export interface DocNode {
  title: string
  description: string
  weight: number
  slug: string[]
  children: DocNode[]
}

// sort children by weight and title
export function sortNode(node: DocNode) {
  node.children.sort((a, b) => {
    if (a.weight === b.weight) {
      return a.title.localeCompare(b.title)
    }
    return a.weight - b.weight
  })
}

export async function buildNodeTree(
  rootDir: string
): Promise<[DocNode, { slug: string; title: string }[]]> {
  const files = await globby(`${rootDir}/**/*.md`)

  const matterMap: Record<string, any> = {}
  for (const file of files) {
    const slug = file.replace(rootDir + '/', '').replace(/\.mdx?$/, '')

    const raw = fs.readFileSync(file, 'utf-8')
    const { data } = matter(raw)
    matterMap[slug] = data
  }

  const rootNode: DocNode = {
    title: '/',
    description: 'Documentation Root',
    weight: 0,
    slug: [],
    children: [],
  }

  let currentNode: DocNode = rootNode

  for (const file of files) {
    const path = file //.replace('.md', '')
    const slug = path
      .replace(rootDir + '/', '')
      .replace(/\.mdx?$/, '')
      .split('/')

    const subslugs = slug.map((_, i) => slug.slice(0, i + 1))

    currentNode = rootNode

    // build directories
    for (const subslug of subslugs) {
      const slugStr = subslug.join('/')
      const fullPath = rootDir + '/' + slugStr
      const indexFile = fullPath + '/index.json'
      //const stats = fs.statSync(fullPath)
      //const isDirectory = stats.isDirectory()

      let dirName = fullPath.split('/').slice(-1)[0]
      let weight = Number.MAX_VALUE
      let description = ''

      if (fs.existsSync(indexFile)) {
        console.log('Found index file for', indexFile)
        const indexData = JSON.parse(fs.readFileSync(indexFile, 'utf-8'))
        dirName = indexData.title || dirName
        weight = indexData.weight || weight
      }

      if (slugStr in matterMap) {
        const m = matterMap[slugStr]!
        description = m.description || description
        dirName = m.title || dirName
        weight = m.weight || weight
      }

      let nextNode: DocNode | undefined = currentNode.children.find(
        (c) => c.title === dirName
      )

      if (!nextNode) {
        nextNode = {
          title: dirName,
          description,
          weight,
          slug: subslug,
          children: [],
        }
        currentNode.children.push(nextNode)
      }

      currentNode = nextNode
    }

    // currentNode.children.push({
    //   type: 'article',
    //   title: data.title || slug[slug.length - 1],
    //   description: data.description || '',
    //   weight: data.weight || Number.MAX_VALUE,
    //   slug: slug.join('/').replace('.md', '').split('/'),
    //   children: [],
    // })
  }

  let stack = [rootNode]

  while (stack.length > 0) {
    const node = stack.pop()!
    sortNode(node)
    stack.push(...node.children)
  }

  const orderedSlugs: { slug: string; title: string }[] = []

  stack = [rootNode]

  while (stack.length > 0) {
    const node = stack.pop()!

    orderedSlugs.push({ slug: node.slug.join('/'), title: node.title })

    stack.push(...node.children.toReversed())
  }

  return [rootNode, orderedSlugs]
}
