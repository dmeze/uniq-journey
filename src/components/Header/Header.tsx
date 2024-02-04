import { useTranslations } from 'next-intl'

import { Cart, Logo, Search, User } from '@/components/Icons/Icons'
import { navs } from '@/components/Header/constants'

const Header = () => {
  const t = useTranslations('Header')

  return (
    <header className="bg-white-yellow shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="hidden space-x-8 sm:inline-block">
            {navs.map((nav) => (
              <a
                href="#"
                className="px-3 py-2 text-xl font-black uppercase text-dark-green"
              >
                {t(nav)}
              </a>
            ))}
          </div>
          <div className="flex items-center">
            <Logo />
            <p className="h-11 w-28 text-wrap text-2xl font-black uppercase leading-6 text-dark-green">
              {t('title')}
            </p>
          </div>
          <div className="flex h-full items-center space-x-1">
            <div className="flex h-full w-10 cursor-pointer items-center justify-center">
              <Search />
            </div>
            <div className="flex h-full w-10 cursor-pointer items-center justify-center">
              <User />
            </div>
            <div className="flex h-full w-10 cursor-pointer items-center justify-center">
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
