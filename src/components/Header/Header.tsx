import { useTranslations } from 'next-intl'

const Header = () => {
  const t = useTranslations('Utils')

  return (
    <header>
      <div>{t('title')}</div>
    </header>
  )
}

export default Header
