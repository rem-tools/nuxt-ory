import { defineNuxtConfig } from 'nuxt/config'
import MyModule from '..'

export default defineNuxtConfig({
  modules: [
    MyModule
  ],
  ory: {
    server: {
    },
    router: {
      // redirectsTo: 'https://account.remtools.io'
    },
    config: {
      basePath: 'https://magical-banach-6tsh6l62ls.projects.oryapis.com'
    }
  }
})
