import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

const navbar: DefaultTheme.NavItem[] = [
  { text: 'Home', link: '/' },
  { text: 'Examples', link: '/markdown-examples' }
]

const sidebar: DefaultTheme.Sidebar = [
  {
    text: 'Examples',
    items: [
      { text: 'Markdown Examples', link: '/markdown-examples' },
      { text: 'Runtime API Examples', link: '/api-examples' }
    ]
  }
]

export const enLocale: LocaleSpecificConfig<DefaultTheme.Config> = {
  ...navbar,
  themeConfig: {
    sidebar,
    editLink: {
      pattern:
        'https://github.com/taskylizard/vitepress-template/edit/main/docs/:path',
      text: 'Suggest Changes'
    }
  }
}
