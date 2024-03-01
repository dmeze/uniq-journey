import React from 'react'

const Profile = () => {
  const userInfo = {
    name: 'John Doe',
    email: 'john@example.com',
  }

  const orderHistory = [
    { orderId: '123', date: '2021-01-01', total: 99.99, status: 'Delivered' },
  ]

  return (
    <div className="container mx-auto my-8 p-4">
      <div className="-mx-4 flex flex-wrap">
        <div className="mb-4 w-full px-4 lg:mb-0 lg:flex lg:w-1/2 lg:flex-col">
          <div className="flex flex-1 flex-col rounded bg-white p-4 shadow">
            <h2 className="mb-4 text-xl font-bold">User Information</h2>
            <div className="flex-1">
              <p>
                <strong>Name:</strong> {userInfo.name}
              </p>
              <p>
                <strong>Email:</strong> {userInfo.email}
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
              {orderHistory.map((order) => (
                <li key={order.orderId} className="mb-3 border-b p-3">
                  <p>
                    <strong>Order ID:</strong> {order.orderId}
                  </p>
                  <p>
                    <strong>Date:</strong> {order.date}
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
