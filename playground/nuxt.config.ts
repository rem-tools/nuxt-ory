import { defineNuxtConfig } from 'nuxt/config'
import MyModule from '..'

export default defineNuxtConfig({
  modules: [
    MyModule
  ],
  ory: {
    custom: {
      url: 'https://public.test.rem.tools/identities/users/me',
      transform: ({ result }) => ({
        session: result.identity,
        extra: result.company
      })
    },
    router: {
      // redirectsTo: 'https://account.remtools.io'
    },
    config: {
      basePath: 'https://magical-banach-6tsh6l62ls.projects.oryapis.com'
    }
  }
})
