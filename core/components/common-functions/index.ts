'use server';
 
import { cache } from 'react';
import { cookies } from 'next/headers';
import { getCart } from '~/client/queries/get-cart';
import { getProduct } from '~/app/[locale]/(default)/product/[slug]/page-data';
 
export const getProductData = cache(async (variables: any) => {
  return await getProduct(variables);
});

export const getCartId = async() => {
  const cookieStore = await cookies();
  return cookieStore.get('cartId')?.value;
}

export const getCartData = async() => {
  let cartId = await getCartId();
  if(cartId) {
    return await getCart(cartId);
  }
}

export const getCurrencyCodeData = async() => {
  const cookieStore = await cookies();
  return cookieStore.get('currencyCode')?.value || 'CAD';
}
 