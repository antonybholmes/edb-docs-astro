// @ts-check

import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://edbdocs.rdf-lab.org',
  compressHTML: true,
  output: 'static',
  // i18n: {
  //   locales: ['en'],
  //   defaultLocale: 'en',
  //   routing: {
  //     prefixDefaultLocale: true,
  //     redirectToDefaultLocale: true,
  //   },
  // },
  integrations: [mdx(), sitemap(), react()],
  // markdown: {
  //   // Applied to .md and .mdx files
  //   remarkPlugins: [remarkSectionize],
  // },
  vite: {
    plugins: [tailwindcss()],
  },
})
