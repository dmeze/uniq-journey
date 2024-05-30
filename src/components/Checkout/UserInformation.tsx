'use server'

import type { User } from '@prisma/client'

import FormSteps from '@/components/Checkout/FormSteps'
import { getCurrentUser } from '@/app/actions/user/actions'
import { getCart } from '@/app/actions/cart/actions'
import type { CartData } from '@/components/Cart'

const UserInformation = async () => {
  const user = (await getCurrentUser()) as User
  const cartData = (await getCart()) as CartData

  return <FormSteps user={user} cartTotal={(cartData.total || 0) * 100} />
}

export default UserInformation
