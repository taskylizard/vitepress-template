import { defineConfig } from 'vitepress'
import UnoCSS from 'unocss/vite'
import { presetUno, presetIcons, transformerDirectives } from 'unocss'
import { figure } from '@mdit/plugin-figure'
import { emojiRender, movePlugin, defs } from './emojis'
import { fileURLToPath } from 'node:url'

export const sharedConfig = defineConfig({
  title: 'VitePress Template',
  description: '🚩 Fully fledged documentation setup',
  base: process.env.BASE_URL || '/',
  lang: 'en-US',
  lastUpdated: false /** Improves build performance */,
  cleanUrls: true,
  appearance: true,
  titleTemplate: ':title • template',
  head: [
    ['meta', { name: 'theme-color', content: '#ADF0DD' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['link', { rel: 'icon', href: '/favicon.svg' }]
  ],
  vite: {
    plugins: [
      UnoCSS({
        presets: [
          presetUno(),
          presetIcons({
            extraProperties: {
              display: 'inline-block',
              'vertical-align': 'middle'
            }
          })
        ],
        transformers: [transformerDirectives()]
      }),
      {
        name: 'custom:adjust-order',
        configResolved(config) {
          movePlugin(
            config.plugins as any,
            'vitepress',
            'before',
            'unocss:transformers:pre'
          )
        }
      }
    ],
    resolve: {
      alias: [
        {
          find: /^.*VPSwitchAppearance\.vue$/,
          replacement: fileURLToPath(
            new URL(
              './theme/components/VPSwitchAppearance.vue',
              import.meta.url
            )
          )
        }
      ]
    }
  },
  markdown: {
    emoji: { defs },
    config(md) {
      md.use(emojiRender)
      md.use(figure)
    }
  },
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          searchOptions: {
            combineWith: 'AND',
            fuzzy: false,
            // @ts-ignore
            boostDocument: (
              _,
              term,
              storedFields: Record<string, string | string[]>
            ) => {
              const titles = (storedFields?.titles as string[])
                .filter((t) => Boolean(t))
                .map((t) => t.toLowerCase())
              // Uprate if term appears in titles. Add bonus for higher levels (i.e. lower index)
              const titleIndex =
                titles
                  .map((t, i) => (t?.includes(term) ? i : -1))
                  .find((i) => i >= 0) ?? -1
              if (titleIndex >= 0) return 10000 - titleIndex

              return 1
            }
          }
        },
        // Add title ang tags field in frontmatter to search
        // You can exclude a page from search by adding search: false to the page's frontmatter.
        _render(src, env, md) {
          // without `md.render(src, env)`, the some information will be missing from the env.
          let html = md.render(src, env)
          let tagsPart = ''
          let headingPart = ''
          let contentPart = ''
          let fullContent = ''
          const sortContent = () =>
            [headingPart, tagsPart, contentPart] as const
          let { frontmatter, content } = env

          if (!frontmatter) return html

          if (frontmatter.search === false) return ''

          contentPart = content ||= src

          const headingMatch = content.match(/^#{1} .*/m)
          const hasHeading = !!(
            headingMatch &&
            headingMatch[0] &&
            headingMatch.index !== undefined
          )

          if (hasHeading) {
            const headingEnd = headingMatch.index! + headingMatch[0].length
            headingPart = content.slice(0, headingEnd)
            contentPart = content.slice(headingEnd)
          } else if (frontmatter.title) {
            headingPart = `# ${frontmatter.title}`
          }

          const tags = frontmatter.tags
          if (tags && Array.isArray(tags) && tags.length)
            tagsPart = `Tags: #${tags.join(', #')}`

          fullContent = sortContent().filter(Boolean).join('\n\n')

          html = md.render(fullContent, env)

          return html
        }
      }
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/taskylizard/vitepress-template'
      }
    ]
  }
})
