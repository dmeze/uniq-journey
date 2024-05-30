'use server'

import type { User } from '@prisma/client'

import FormSteps from '@/components/Checkout/FormSteps'
import { getCurrentUser } from '@/app/actions/user/actions'

const UserInformation = async () => {
  const user = (await getCurrentUser()) as User

  return <FormSteps user={user} />
}

export default UserInformation
