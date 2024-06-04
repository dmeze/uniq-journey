'use client'

import { useState } from 'react'
import type { Order, OrderItem, Perfume } from '@prisma/client'

interface OrderWithProducts extends Order {
  products: OrderWithPerfumes[]
}

interface OrderWithPerfumes extends OrderItem {
  perfume: Perfume
}

const OrderHistory = ({ orders }: { orders: OrderWithProducts[] }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const handleToggle = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  return (
    <div className="flex flex-1 flex-col rounded bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-dark-green-500">
        Order History
      </h2>
      <ul className="max-h-[19.5rem] space-y-4 overflow-y-auto">
        {orders.map((order) => (
          <li key={order.id} className="rounded p-4">
            <button
              type="button"
              className="w-full text-left"
              onClick={() => handleToggle(order.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-dark-green-200">
                    Order ID: {order.id}
                  </h3>
                  <p className="text-dark-green">
                    Date:{' '}
                    {new Date(order.createDate).toLocaleString('en-GB', {
                      timeZone: 'UTC',
                    })}
                  </p>
                  <p className="text-dark-green">Total: {order.total} ₴</p>
                  <p className="text-dark-green">Status: {order.status}</p>
                </div>
                <div>
                  {expandedOrderId === order.id ? (
                    <span className="text-dark-green">▲</span>
                  ) : (
                    <span className="text-dark-green">▼</span>
                  )}
                </div>
              </div>
            </button>
            {expandedOrderId === order.id && (
              <div className="mt-4 border-t border-light-green-200 pt-4">
                <h4 className="mb-2 text-lg font-semibold text-dark-green-200">
                  Products
                </h4>
                <ul className="space-y-2">
                  {order.products.map((product) => (
                    <li key={product.perfumeId} className="text-dark-green">
                      <p>
                        <strong>Name:</strong> {product.perfume.name}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {product.quantity}
                      </p>
                      <p>
                        <strong>Price:</strong> {product.price} ₴
                      </p>
                      <p>
                        <strong>Size:</strong> {product.size}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OrderHistory