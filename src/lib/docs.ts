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
