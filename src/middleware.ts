import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'ua'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
