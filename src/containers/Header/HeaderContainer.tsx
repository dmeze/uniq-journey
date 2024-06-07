import Header from '@/components/Header/Header'
import { getCurrentUser } from '@/app/actions/user/actions'
import type { UserProfileProps } from '@/containers/Profile/Profile'

const HeaderContainer = async () => {
  const user = (await getCurrentUser()) as unknown as UserProfileProps

  return <Header user={user} />
}

export default HeaderContainer
