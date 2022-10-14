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
    }
  }
})
