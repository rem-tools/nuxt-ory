import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addImportsDir, addServerHandler } from '@nuxt/kit'
import { ConfigurationParameters } from '@ory/client'
import defu from 'defu'

export interface ConfigurationOptions {
  config: ConfigurationParameters,
  append: boolean,
  server: {
    enabled: boolean,
    excludePaths: string[]
  },
  router: {
    redirectsTo: string,
    excludePaths: string[]
  }
  proxy: boolean
}

export default defineNuxtModule<ConfigurationOptions>({
  meta: {
    name: 'nuxt-ory',
    configKey: 'ory'
  },
  defaults: {
    append: false,
    server: {
      enabled: true,
      excludePaths: []
    },
    router: {
      redirectsTo: null,
      excludePaths: []
    },
    config: {},
    proxy: true
  },
  setup (options, nuxt) {
    // Inject config to runtime
    nuxt.options.runtimeConfig.nuxtOry = options

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // Add our plugin
    addPlugin(resolve(runtimeDir, 'plugin'), {
      append: options.append // To be provided first
    })

    // Add composables to be used
    addImportsDir(resolve(runtimeDir, './composables'))

    if (options.server.enabled) {
      addServerHandler({
        handler: resolve(runtimeDir, './server/enforceOryAuth.ts'),
        middleware: true,
        lazy: true
      })
    }
  }
})
