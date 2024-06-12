import { Suspense } from 'react'

import ProfileContainer from '@/containers/Profile'
import PageLoader from '@/components/Loaders/PageLoader'

const Profile = () => (
  <Suspense fallback={<PageLoader />}>
    <ProfileContainer />
  </Suspense>
)

export default Profile
