import { defineConfig } from 'vitepress'
import { sharedConfig } from './shared'
import { enLocale } from './locales/en-us'

export default defineConfig({
  ...sharedConfig,
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      ...enLocale
    }
  }
})
