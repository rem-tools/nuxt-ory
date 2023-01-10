import { FrontendApi } from '@ory/client'
import { useNuxtApp } from '#imports'

export const useOry = () : FrontendApi => {
  return useNuxtApp().$ory
}
