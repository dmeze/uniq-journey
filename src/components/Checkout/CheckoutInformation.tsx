import { getCart } from '@/app/actions/cart/actions'
import CartBody from '@/components/Cart/CartBody'
import type { CartData } from '@/components/Cart'

const CheckoutInformation = async () => {
  const cartData = (await getCart()) as unknown as CartData
  return <CartBody cartData={cartData} />
}

export default CheckoutInformation
