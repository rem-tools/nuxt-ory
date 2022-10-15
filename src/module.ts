import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addImportsDir, addServerHandler, createResolver } from '@nuxt/kit'
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
    configKey: 'ory',
    compatibility: {
      nuxt: '^3.0.0-rc.11'
    }
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

    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.build.transpile.push(runtimeDir)
    // nuxt.options.build.transpile.push('@ory/client')

    // Add our plugin
    addPlugin(resolve(runtimeDir, 'plugin'), {
      append: options.append // To be provided first
    })

    // Add composables to be used
    addImportsDir(resolve(runtimeDir, './composables'))

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')]
      })
    })

    if (options.server.enabled) {
      addServerHandler({
        handler: resolve(runtimeDir, './server/enforceOryAuth'),
        middleware: true
      })
    }
  }
})
