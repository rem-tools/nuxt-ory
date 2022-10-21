import { Ref } from 'vue'
import { Session } from '@ory/client'
import { useNuxtApp, useState } from '#imports'

export type OrySession = Session|null

export const useOryError = () : Ref => {
  const { ssrContext } = useNuxtApp()

  return useState('nuxtOryError', () => ssrContext?.event?.context?._nuxtOry?.error ?? null)
}

export const useOrySession = () : Ref<OrySession> => {
  const { ssrContext } = useNuxtApp()

  return useState<OrySession>('nuxtOry', () => ssrContext?.event?.context?._nuxtOry?.session ?? null)
}
