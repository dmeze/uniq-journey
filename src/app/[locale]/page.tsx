import HomeContainer from '@/containers/Home'

const Home = ({
  searchParams,
}: {
  searchParams: { aromas: string; id: string }
}) => <HomeContainer searchParams={searchParams} />

export default Home
