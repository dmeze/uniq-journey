'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Cart, Logo, Search, User } from '@/components/Icons/Icons'
import { navs, PROFILE_PAGE } from '@/components/Header/constants'
import { create } from '@/app/actions/actions'
import { setIsCartOpened } from '@/features/cart/cartSlice'

const Header = () => {
  const dispatch = useDispatch()
  const t = useTranslations('Header')

  useEffect(() => {
    create().then()
  }, [])

  const handleOpenCart = () => {
    dispatch(setIsCartOpened())
  }

  return (
    <header className="bg-white-yellow shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="hidden space-x-8 md:inline-block">
            {navs.map(({ title, href }) => (
              <Link
                href={href}
                className="px-3 py-2 text-xl font-black uppercase text-dark-green duration-200 hover:text-light-green-200"
                key={title}
              >
                {t(title)}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            <Logo />
            <p className="h-11 w-28 text-wrap text-2xl font-black uppercase leading-6 text-dark-green">
              {t('title')}
            </p>
          </div>
          <div className="ml-72 flex h-full items-center space-x-1">
            <div className="flex h-full w-10 cursor-pointer items-center justify-center">
              <Search />
            </div>
            <div className="flex h-full w-10 cursor-pointer items-center justify-center">
              <Link href={PROFILE_PAGE}>
                <User />
              </Link>
            </div>
            <button
              aria-label="Cart"
              type="button"
              className="flex h-full w-10 cursor-pointer items-center justify-center"
              onClick={handleOpenCart}
            >
              <Cart />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
