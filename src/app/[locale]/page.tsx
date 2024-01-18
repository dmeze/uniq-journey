import { useTranslations } from 'next-intl'

const Home = () => {
  const t = useTranslations('Home')
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24" />
  )
}

export default Home
