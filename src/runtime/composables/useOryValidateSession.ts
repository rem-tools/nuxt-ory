import { Ref } from 'vue'
import { OrySession, useOryError } from './useOryState'
import { useOrySession, useNuxtApp, useRequestHeaders } from '#imports'

export const useOryValidateSession = async () : Promise<{ session: Ref<OrySession>, error: Ref }> => {
  const session = useOrySession()
  const error = useOryError()

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
