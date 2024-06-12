import type { OrderStatus } from '@prisma/client'

import type { MyContext, MyConversation } from '@/bot'
import { getOrders, updateOrderStatus } from '@/app/actions/order/actions'

export const updateOrderStatusConversation = async (
  conversation: MyConversation,
  ctx: MyContext,
) => {
  const orders = await getOrders()

  if (orders.length === 0) {
    await ctx.reply('No orders found.')
    return
  }

  const orderList = orders.map((order, index) => {
    const productDetails = order.products
      .map((product) => {
        const perfumeName = product.perfume?.name || product.userPerfume?.name

        return `Product: ${perfumeName} Quantity: ${product.quantity} Price: ${product.price} Size: ${product.size}`
      })
      .join('\n')

    return {
      text: `Order ${index + 1}: ${order.id} - ${order.status}\n${productDetails}\n`,
      callback_data: `select_order_${order.id}`,
    }
  })

  const keyboard = {
    inline_keyboard: orderList.map((order) => [
      { text: order.text, callback_data: order.callback_data },
    ]),
  }

  await ctx.reply('Select an order to update the status:', {
    reply_markup: keyboard,
  })

  const { callbackQuery } = await conversation.wait()
  const data = callbackQuery?.data

  if (data?.startsWith('select_order_')) {
    const orderId = data.replace('select_order_', '')

    const statusKeyboard = {
      inline_keyboard: [
        [
          {
            text: 'PENDING',
            callback_data: `update_status_${orderId}_PENDING`,
          },
          {
            text: 'SHIPPING',
            callback_data: `update_status_${orderId}_SHIPPING`,
          },
          { text: 'DONE', callback_data: `update_status_${orderId}_DONE` },
        ],
      ],
    }

    await ctx.reply('Select the new status for the order:', {
      reply_markup: statusKeyboard,
    })

    const { callbackQuery: statusCallbackQuery } = await conversation.wait()
    const statusData = statusCallbackQuery?.data

    if (statusData?.startsWith('update_status_')) {
      const [orderIdKey, status] = statusData
        .replace('update_status_', '')
        .split('_')

      const { message } = await updateOrderStatus(
        orderIdKey,
        status as OrderStatus,
      )

      await ctx.reply(message)
    }
  }
}
