'use server'

import React from 'react'
import type { Order, User } from '@prisma/client'

import { getCurrentUser } from '@/app/actions/user/actions'

interface UserWithOrder extends User {
  orders: Order[]
}

const Profile = async () => {
  const user = (await getCurrentUser()) as unknown as UserWithOrder

  return (
    <div className="container mx-auto my-8 p-4">
      <div className="-mx-4 flex flex-wrap">
        <div className="mb-4 w-full px-4 lg:mb-0 lg:flex lg:w-1/2 lg:flex-col">
          <div className="flex flex-1 flex-col rounded bg-white p-4 shadow">
            <h2 className="mb-4 text-xl font-bold">User Information</h2>
            <div className="flex-1">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
            <button
              type="button"
              className="mt-4 rounded bg-light-green px-4 py-2 text-white transition duration-300 hover:bg-green-600"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="w-full px-4 lg:flex lg:w-1/2 lg:flex-col">
          <div className="flex flex-1 flex-col rounded bg-white p-4 shadow">
            <h2 className="mb-4 text-xl font-bold">Order History</h2>
            <ul className="flex-1">
              {user.orders.map((order) => (
                <li key={order.id} className="mb-3 border-b p-3">
                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(order.createDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.total.toFixed(2)}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
