import { Configuration, V0alpha2Api } from '@ory/client'
import defu from 'defu'
import {
  addRouteMiddleware,
  defineNuxtPlugin, navigateTo,
  useOryError,
  useRuntimeConfig
} from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const error = useOryError()
  const { nuxtOry } = useRuntimeConfig()

  if (nuxtOry?.router?.redirectsTo) {
    addRouteMiddleware('ory-redirect-if-error', (to) => {
      if (to.fullPath.includes(nuxtOry?.router.redirectsTo) || nuxtOry?.router.excludePaths.some(p => to.path.includes(p))) { return true }

      if (error.value) {
        return navigateTo(nuxtOry?.router?.redirectsTo, {
          external: /^https?:\/\//.test(nuxtOry?.router?.redirectsTo)
        })
      }
    }, {
      global: true
    })
  }

  return {
    provide: {
      ory: {
        client: new V0alpha2Api(
          new Configuration(defu(nuxtOry?.config, {
            baseOptions: {
              withCredentials: true
            }
          }))
        )
      }
    }
  }
})
