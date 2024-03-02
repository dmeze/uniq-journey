import CartWrapper from '@/components/Cart/CartWrapper'
import CartBody from '@/components/Cart/CartBody'
import { getCart } from '@/app/actions/cart/actions'

const Cart = async () => {
  const cartData = await getCart()

  return (
    <CartWrapper cartId={cartData.id!} cartCount={cartData.count!}>
      <CartBody cartData={cartData} />
    </CartWrapper>
  )
}

export default Cart
