'use server';

import { client } from "~/client";
import { graphql, VariablesOf } from "~/client/graphql";
import { getSessionCustomerAccessToken } from "~/auth";
import { CartItemFragment } from "~/app/[locale]/(default)/cart/_components/cart-item";
import { TAGS } from "~/client/tags";
import { cookies } from "next/headers";
import { revalidate } from "~/client/revalidate-target";


const GET_RECENTLY_VIEWED_PRODUCTS = graphql(`
    query recentlyViewedProducts($productIds: [Int!], $currencyCode: currencyCode!) {
        site {
            products(entityIds: $productIds) {
                edges {
                    node {
                        entityId
                        name
                        sku
                        path
                        pricesWithTax: prices(includeTax: true, currencyCode: $currencyCode) {
                            price { value currencyCode }
                        }
                        defaultImage {
                            url320wide: url(width: 320)
                            isDefault
                            altText
                        }
                    }
                }
            }
            currency(currencyCode: $currencyCode) {
                display {
                    symbol
                    symbolPlacement
                    decimalPlaces
                }
            }
        }
    }
`);


const ProductPricesQuery = graphql(`
  query ProductPrices($entityId: Int!, $optionValueIds: [OptionValueId!], $currencyCode: currencyCode) {
    site {
      product(entityId: $entityId, optionValueIds: $optionValueIds) {
        prices(includeTax: true, currencyCode: $currencyCode) {
          price {
            value
            currencyCode
          }
          basePrice {
            value
            currencyCode
          }
          retailPrice {
            value
            currencyCode
          }
          salePrice {
            value
            currencyCode
          }
          priceRange {
            min {
              value
              currencyCode
            }
            max {
              value
              currencyCode
            }
          }
        }
        excludeTax: prices(currencyCode: $currencyCode) {
          price {
            value
            currencyCode
          }
          basePrice {
            value
            currencyCode
          }
          retailPrice {
            value
            currencyCode
          }
          salePrice {
            value
            currencyCode
          }
          priceRange {
            min {
              value
              currencyCode
            }
            max {
              value
              currencyCode
            }
          }
        }
      }
    }
  }
`);

type ProductPricesQueryVariables = VariablesOf<typeof ProductPricesQuery>;

export const getProductPrices = (async (variables: ProductPricesQueryVariables) => {
  const customerAccessToken = await getSessionCustomerAccessToken();
  const { data } = await client.fetch({
    document: ProductPricesQuery,
    variables,
    customerAccessToken,
    fetchOptions: { next: { revalidate } },
  });

  return data.site.product;
});

const UpdateCurrencyQuery = graphql(`
  mutation cartCurrencyUpdate($cartEntityId: String!, $currencyCode: String!) {
    cart {
      updateCartCurrency(input: {cartEntityId: $cartEntityId, data: {currencyCode: $currencyCode}}) {
        cart {
          entityId
          currencyCode
          lineItems {
            ...CartItemFragment
          }
        }
      }
    }
  }
`, [CartItemFragment],);

export const getRecentlyViewedProducts = async (productIds: any, currencyCode: any) => {
  const { data } = await client.fetch({
    document: GET_RECENTLY_VIEWED_PRODUCTS,
    variables: {productIds: productIds, currencyCode: currencyCode}
  });
  return data?.site.products;
}

export const updateCartCurrency = async (currencyCode: string) => {
  const cookieStore = await cookies();
  const cookieCartId = cookieStore.get('cartId')?.value;
  if(cookieCartId) {
    const {data}  = await client.fetch({
      document: UpdateCurrencyQuery,
      variables: {cartEntityId: cookieCartId, currencyCode: currencyCode},
      fetchOptions: {
        cache: 'no-store'
      },
    });
    let cartId = data?.cart?.updateCartCurrency?.cart?.entityId;
    if(cartId) {
      cookieStore.set({
        name: 'cartId',
        value: cartId,
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
      });
    }
    return data?.cart?.updateCartCurrency?.cart;
  }
  return null;
}