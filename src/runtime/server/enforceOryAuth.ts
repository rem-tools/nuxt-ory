import { defineEventHandler, getHeader } from 'h3'
import { Configuration, FrontendApi } from '@ory/client'
import defu from 'defu'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

const { nuxtOry } = useRuntimeConfig()

const oryInstance = new FrontendApi(
  new Configuration(defu(nuxtOry?.config, {
    baseOptions: {
      withCredentials: true
    }
  }))
)

export default defineEventHandler(async (event) => {
  // @ts-ignore
  if (event.req.url.includes(nuxtOry?.router.redirectsTo) || nuxtOry?.server.excludePaths.some(p => event.req.url.includes(p))) { return }

  const cookie = getHeader(event, 'cookie')

  event.context._nuxtOry = {}

  try {
    if (nuxtOry?.custom) {
      const { data } = await axios.get(nuxtOry?.custom?.url, {
        headers: {
          Cookie: cookie
        }
      })

      event.context._nuxtOry.session = nuxtOry?.custom?.transform ? nuxtOry?.custom?.transform(data) : data
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
