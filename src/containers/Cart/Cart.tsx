import CartWrapper from '@/components/Cart/CartWrapper'
import CartBody from '@/components/Cart/CartBody'
import { getCart } from '@/app/actions/cart/actions'
import type { CartData } from '@/components/Cart'

const Cart = async () => {
  const cartData = (await getCart()) as unknown as CartData

  return (
    <CartWrapper cartId={cartData.id!} cartCount={cartData.count!}>
      <CartBody cartData={cartData} />
    </CartWrapper>
  )
}

export default Cart
