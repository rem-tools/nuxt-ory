import { fileURLToPath } from 'url'
import {
  defineNuxtModule,
  addPlugin,
  addServerHandler,
  createResolver,
  useLogger,
  extendViteConfig
} from '@nuxt/kit'
import { ConfigurationParameters } from '@ory/client'
import defu from 'defu'

export interface ConfigurationOptions {
  config: ConfigurationParameters,
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
    name: '@rem.tools/nuxt-ory',
    configKey: 'ory',
    compatibility: {
      nuxt: '^3.0.0-rc.11'
    }
  },
  defaults: {
    server: {
      enabled: true,
      excludePaths: []
    },
    router: {
      redirectsTo: null,
      excludePaths: []
    },
    config: null,
    proxy: true
  },
  setup (options, nuxt) {
    const logger = useLogger('[@rem.tools/nuxt-ory]')

    // Inject config to runtime
    nuxt.options.runtimeConfig.nuxtOry = defu(nuxt.options.runtimeConfig?.nuxtOry, options)

    if (!nuxt.options.runtimeConfig.nuxtOry.config) {
      logger.warn('Ory configuration is missing, using defaults instead')
    }

    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.build.transpile.push(runtimeDir)

    // Add our plugin
    addPlugin(resolve(runtimeDir, 'plugin'))

    // Add composables to be used
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, './composables'))
    })

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')]
      })
    })

    // Optimize Ory Client
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.include.push('@ory/client')
    })

    if (options.server.enabled) {
      addServerHandler({
        handler: resolve(runtimeDir, './server/enforceOryAuth'),
        middleware: true
      })
    }
  }
})
