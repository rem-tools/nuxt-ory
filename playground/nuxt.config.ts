export default defineNuxtConfig({
  modules: ['../src/module'],
  nuxtOry: {
    custom: {
      url: 'https://public.test.rem.tools/identities/users/me',
      transform: ({ result }: any) => ({
        session: result.identity,
        extra: result.company
      })
    },
    router: {
      // redirectsTo: 'https://account.remtools.io'
    },
    config: {
      basePath: 'http://localhost:4000'
    }
  },
  devtools: { enabled: true }
})
