import { defineEventHandler, getHeader } from 'h3'
import { Configuration, V0alpha2Api } from '@ory/client'
import defu from 'defu'
import { useRuntimeConfig } from '#imports'

const { nuxtOry } = useRuntimeConfig()

const oryInstance = new V0alpha2Api(
  new Configuration(defu(nuxtOry?.config, {
    baseOptions: {
      withCredentials: true
    }
  }))
)

export default defineEventHandler(async (event) => {
  if (event.req.url.includes(nuxtOry?.router.redirectsTo) || nuxtOry?.server.excludePaths.some(p => event.req.url.includes(p))) { return }

  const cookie = getHeader(event, 'cookie')

  event.context._nuxtOry = {}
  event.context._nuxtOry.client = oryInstance

  try {
    const { data } = await oryInstance.toSession(undefined, cookie as string)

    event.context._nuxtOry.session = data
  } catch (err) {
    event.context._nuxtOry.error = err
  }
})
