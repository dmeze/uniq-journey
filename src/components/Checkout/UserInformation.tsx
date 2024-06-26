'use server'

import type { User } from '@prisma/client'
import { redirect } from 'next/navigation'

import FormSteps from '@/components/Checkout/FormSteps'
import { getCurrentUser } from '@/app/actions/user/actions'
import { getCart } from '@/app/actions/cart/actions'
import type { CartData } from '@/components/Cart'
import type { OrderPerfumeItems } from '@/app/actions/order/actions'

const UserInformation = async () => {
  const user = (await getCurrentUser()) as User
  const cartData = (await getCart()) as CartData

  if (!user?.name && !cartData?.count) redirect('/')

  return (
    <FormSteps
      user={user}
      items={cartData.products as unknown as OrderPerfumeItems[]}
      cartTotal={(cartData.total || 0) * 100}
    />
  )
}

export default UserInformation
