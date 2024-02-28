import type { Ref } from 'vue'
import axios from 'axios'
import type { OrySession } from './useOryState'
import { useNuxtApp, useRequestHeaders, ref, useRuntimeConfig } from '#imports'

export const useOryValidateSession = async () : Promise<{ session: Ref<OrySession>, error: Ref }> => {
  const session = ref<OrySession>(null)
  const error = ref(null)

  const { $ory } = useNuxtApp()
  const { cookie } = useRequestHeaders(['cookie'])
  const { nuxtOry } = useRuntimeConfig()

  try {
    if (nuxtOry?.custom) {
      const { data } = await axios.get(nuxtOry?.custom?.url, {
        headers: {
          Cookie: cookie
        }
      })

      session.value = nuxtOry?.custom?.transform ? nuxtOry?.custom?.transform(data) : data
    } else {
      const { data } = await $ory.toSession(...(process.server ? [{ cookie }] : []))

      session.value = data
    }
  } catch (err) {
    // @ts-ignore
    error.value = err
  }

  return {
    session,
    error
  }
}
