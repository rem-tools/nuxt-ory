import { Configuration, V0alpha2Api } from '@ory/client'
import defu from 'defu'
import { useRuntimeConfig, useNuxtApp } from '#imports'

export default () : V0alpha2Api => {
  const { nuxtOry } = useRuntimeConfig()
  const { ssrContext } = useNuxtApp()

  return ssrContext?.event?.context?._nuxtOry?.client ?? new V0alpha2Api(
    new Configuration(defu(nuxtOry?.config, {
      baseOptions: {
        withCredentials: true
      }
    }))
  )
}
