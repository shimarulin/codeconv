import theme from '@nuxt/content-theme-docs'

const t = theme({
  i18n: {
    locales: () => [
      {
        code: 'ru',
        iso: 'ru-RU',
        file: 'ru-RU.js',
        name: 'Русский',
      },
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.js',
        name: 'English',
      },
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true,
    },
  },
  googleFonts: {
    subsets: 'cyrillic',
    families: {
      Ubuntu: true,
      'DM+Sans': false,
      'DM+Mono': false,
    },
  },
  // docs: {
  //   primaryColor: '#000acd',
  // },
  // tailwindcss: {},
  // pwa: {
  //   manifest: {
  //     name: 'Codeconv tools',
  //   },
  // },
  // router: {
  //   trailingSlash: true,
  // },
})

console.log(t)

export default t
