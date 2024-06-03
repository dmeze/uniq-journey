'use server'

import type { Order, OrderItem, Perfume, User } from '@prisma/client'

import { getCurrentUser } from '@/app/actions/user/actions'
import UserProfile from '@/components/Profile/UserProfile'
import OrderHistory from '@/components/Profile/OrderHistory'

export interface UserProfileProps extends User {
  orders: (Order & { products: (OrderItem & { perfume: Perfume })[] })[]
}

const Profile = async () => {
  const user = (await getCurrentUser()) as unknown as UserProfileProps

  return (
    <div className="container mx-auto my-8 p-4">
      <div className="flex flex-wrap">
        <div className="mb-4 w-full px-4 lg:mb-0 lg:w-1/2">
          <UserProfile user={user} />
        </div>
        <div className="w-full px-4 lg:w-1/2">
          <OrderHistory orders={user.orders} />
        </div>
      </div>
    </div>
  )
}

export default Profile
