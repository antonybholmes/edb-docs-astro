import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts'

export async function GET(context: APIContext): Promise<Response> {
  const posts = await getCollection('docs')
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? '',
    items: posts.map((post) => ({
      ...post.data,
      link: `/${post.id}/`,
    })),
  })
}
