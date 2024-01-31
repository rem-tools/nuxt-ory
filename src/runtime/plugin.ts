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
        return navigateTo(config.nuxtOry?.router?.redirectsTo) // Not support for external urls. Use excludePaths instead (/auth/login)
      }
    }, {
      global: true
    })
  }

  // config.nuxtOry?.config?.basePath -> Only for server side rendering. Use public.oryUrl instead for client side rendering
  const basePath = config.nuxtOry?.config?.basePath ?? config.public.oryUrl

  console.log('basePath')
  console.log(basePath)

  nuxtApp.provide('ory', new FrontendApi(
    new Configuration({
      basePath,
      baseOptions: {
        withCredentials: true
      }
    })
  ))
})
