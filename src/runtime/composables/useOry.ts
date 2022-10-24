import { V0alpha2Api } from '@ory/client'
import { useNuxtApp } from '#imports'

export const useOry = () : V0alpha2Api => {
  return useNuxtApp().$ory
}
