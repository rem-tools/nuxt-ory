import { fileURLToPath } from 'url'
import {
  defineNuxtModule,
  addPlugin,
  addImportsDir,
  addServerHandler,
  createResolver,
  useLogger,
  addImportsSources
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
    name: 'nuxt-ory',
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
    nuxt.options.runtimeConfig.nuxtOry = options

    if (!nuxt.options.runtimeConfig.nuxtOry.config) {
      logger.error('Ory configuration is missing')
    }

    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.build.transpile.push(runtimeDir)

    // nuxt.options.alias['@ory/client'] = '@ory/client/dist/index.js'
    nuxt.options.vite.optimizeDeps.exclude.push('@ory/client')

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

    if (options.server.enabled) {
      addServerHandler({
        handler: resolve(runtimeDir, './server/enforceOryAuth'),
        middleware: true
      })
    }
  }
})
