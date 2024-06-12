import { getOrders } from '@/app/actions/order/actions'
import type { MyContext } from '@/bot'

export const getOrdersList = async (ctx: MyContext) => {
  const orders = await getOrders()

  if (orders.length === 0) {
    await ctx.reply('No orders found.')
    return
  }

  const orderList = orders
    .map((order, index) => {
      const productDetails = order.products
        .map((product) => {
          const perfumeName = product.perfume?.name || product.userPerfume?.name
          const aromas = product.userPerfume
            ? product.userPerfume.aromas
                .map(({ aroma }) => aroma.name)
                .join(', ')
            : ''
          const userPerfumeDetails = product.userPerfume
            ? `${product.userPerfume.name ? `Title: ${product.userPerfume.name}` : ''}
           ${product.userPerfume.description ? `Description: ${product.userPerfume.description}` : ''}
           ${product.userPerfume.imageUrl ? `ImageUrl: ${product.userPerfume.imageUrl}` : ''}
           Aromas: ${aromas}`
            : ''

          return `Product: ${perfumeName}
              Quantity: ${product.quantity}
              Price: ${product.price}
              Size: ${product.size}
              ${userPerfumeDetails}`
        })
        .join('\n')

      const user = `User: ${order.user.name}
                  Phone: ${order.user.phone}
                  City: ${order.user.city}
                  Warehouse: ${order.user.warehouse}`

      return `Order ${index + 1}: ${order.id} - ${order.status}\n${productDetails}\n${user}`
    })
    .join('\n\n')

  await ctx.reply(`Orders List:\n\n${orderList}`)
}
