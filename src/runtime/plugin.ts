import { Configuration, FrontendApi } from '@ory/client'
import { useOryError } from './composables/useOryState'
import {
  addRouteMiddleware,
  defineNuxtPlugin, navigateTo,
  useRuntimeConfig
} from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const error = useOryError()
  const config = useRuntimeConfig()

  if (config.nuxtOry?.router?.redirectsTo) {
    addRouteMiddleware('ory-redirect-if-error', (to) => {
      if (to.fullPath.includes(config.nuxtOry?.router.redirectsTo) || config.nuxtOry?.router.excludePaths.some(p => to.path.includes(p))) { return true }

      if (error.value) {
        return navigateTo(config.nuxtOry?.router?.redirectsTo,
          {
            external: true,
          })
      }
    }, {
      global: true
    })
  }

  const basePath = config.nuxtOry?.config?.basePath ?? config.public.oryUrl

  nuxtApp.provide('ory', new FrontendApi(
    new Configuration({
      basePath,
      baseOptions: {
        withCredentials: true
      }
    })
  ))
})
