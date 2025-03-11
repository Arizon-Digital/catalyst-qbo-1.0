'use client';
 
import { Badge, ShoppingCart } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { z } from 'zod';
 
import { useCart } from './cart-provider';
import Minicart from '../ui/header/minicart';

const CartQuantityResponseSchema = z.object({
  count: z.number(),
  cartItems: z.any()
});
 
interface CartIconProps {
  count?: number;
  cartObj?: any;
}
 
export const CartIcon = ({ count: serverCount }: CartIconProps) => {
  const { count, setCount } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState('');
  const locale = useLocale();
  const t = useTranslations('Components.Header.MiniCart');

  useEffect(() => {
    async function fetchCartQuantity() {
      const response = await fetch(`/api/cart-quantity/?locale=${locale}`);
      const parsedData: any = CartQuantityResponseSchema.parse(await response.json());
      setCartItems(parsedData?.cartItems);
      setCount(parsedData.count);
      setCartId(parsedData?.cartId);
    }

    if (serverCount !== undefined) {
      setCount(serverCount);
    } else {
      // When a page is rendered statically via the 'force-static' route config option, cookies().get() always returns undefined,
      // which ultimately means that the `serverCount` here will always be undefined on initial render, even if there actually is
      // a populated cart. Thus, we perform a client-side check in this case.
      void fetchCartQuantity();
    }
  }, [serverCount, locale, setCount]);
 
  if (!count) {
    return <ShoppingCart aria-label={t('cart')} />;
  }
 
  return (
    <>
      <span className="sr-only">Cart Items</span>
      <Minicart count={count}/>
    </>
  );
};
 
