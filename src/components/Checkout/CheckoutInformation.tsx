import { getCart } from '@/app/actions/cart/actions'
import CartBody from '@/components/Cart/CartBody'

const CheckoutInformation = async () => {
  const cartData = await getCart()
  return <CartBody cartData={cartData} />
}

export default CheckoutInformation
