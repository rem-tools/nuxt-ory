import { Ref } from 'vue'
import { OrySession } from './useOryState'
import { useNuxtApp, useRequestHeaders, ref } from '#imports'

export const useOryValidateSession = async () : Promise<{ session: Ref<OrySession>, error: Ref }> => {
  const session = ref<OrySession>(null)
  const error = ref(null)

  if (session.value) { return { session, error } }

  const { $ory } = useNuxtApp()
  const { cookie } = useRequestHeaders(['cookie'])

  try {
    const { data } = await $ory.client.toSession(...(process.server ? [undefined, cookie] : []))

    session.value = data
  } catch (err) {
    error.value = err
  }

  return {
    session,
    error
  }
}
