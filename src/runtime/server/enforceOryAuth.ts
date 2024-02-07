import { defineEventHandler, getHeader } from 'h3'
import { Configuration, FrontendApi } from '@ory/client'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const basePath = config.nuxtOry?.config?.basePath ?? config.public.oryUrl

const oryInstance = new FrontendApi(
  new Configuration({
    basePath,
    baseOptions: {
      withCredentials: true
    }
  })
)

export default defineEventHandler(async (event) => {
  // @ts-ignore
  if (event.req.url.includes(config.nuxtOry?.router.redirectsTo) || config.nuxtOry?.server.excludePaths.some(p => event.req.url.includes(p))) { return }

  const cookie = getHeader(event, 'cookie')

  event.context._nuxtOry = {}

  try {
    if (config.nuxtOry?.custom) {
      const { data } = await axios.get(config.nuxtOry?.custom?.url, {
        headers: {
          Cookie: cookie
        }
      })

      event.context._nuxtOry.session = config.nuxtOry?.custom?.transform ? config.nuxtOry?.custom?.transform(data) : data
    } else {
      const { data } = await oryInstance.toSession({
        cookie
      })

      event.context._nuxtOry.session = data
    }
  } catch (err) {
    event.context._nuxtOry.error = err
  }
})
