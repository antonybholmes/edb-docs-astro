import fs from 'fs'
import { globby } from 'globby'
import matter from 'gray-matter'

export const DOCS_DIR = './src/content/docs'

export interface DocNode {
  type: 'dir' | 'article'
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

  console.log(files)

  const rootNode: DocNode = {
    type: 'dir',
    title: '/',
    description: 'Documentation Root',
    weight: 0,
    slug: [],
    children: [],
  }

  let currentNode: DocNode = rootNode

  for (const file of files) {
    const path = file //.replace('.md', '')
    const slug = path.replace(rootDir + '/', '').split('/')

    const raw = fs.readFileSync(file, 'utf-8')

    const { data } = matter(raw)

    const subslugs = slug.map((_, i) => slug.slice(0, i + 1))

    currentNode = rootNode

    // build directories
    for (const subslug of subslugs) {
      const fullPath = rootDir + '/' + subslug.join('/')

      const stats = fs.statSync(fullPath)
      const isDirectory = stats.isDirectory()

      if (isDirectory) {
        let dirName = fullPath.split('/').slice(-1)[0]
        let weight = Number.MAX_VALUE

        if (fs.existsSync(`${fullPath}/index.json`)) {
          const indexFile = fs.readFileSync(`${fullPath}/index.json`, 'utf-8')

          const indexData = JSON.parse(indexFile)

          dirName = indexData.title || dirName
          weight = indexData.index || weight
        }

        let nextNode: DocNode | undefined = currentNode.children.find(
          (c) => c.title === dirName
        )

        if (!nextNode) {
          nextNode = {
            type: 'dir',
            title: dirName,
            description: '',
            weight: weight,
            slug: subslug,
            children: [],
          }
          currentNode.children.push(nextNode)
        }

        currentNode = nextNode
      }
    }

    currentNode.children.push({
      type: 'article',
      title: data.title || slug[slug.length - 1],
      description: data.description || '',
      weight: data.weight || Number.MAX_VALUE,
      slug: slug.join('/').replace('.md', '').split('/'),
      children: [],
    })
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
    if (node.type === 'article') {
      orderedSlugs.push({ slug: node.slug.join('/'), title: node.title })
    }
    stack.push(...node.children.toReversed())
  }

  return [rootNode, orderedSlugs]
}
