'use server';

import { getFormatter, getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql, VariablesOf } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { CurrencyCode } from '../page-data';

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

const getProductPrices = cache(async (variables: ProductPricesQueryVariables) => {
  const customerAccessToken = await getSessionCustomerAccessToken();
  const { data } = await client.fetch({
    document: ProductPricesQuery,
    variables,
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });

  return data.site.product;
});

export const Prices = async ({ entityId, optionValueIds }: ProductPricesQueryVariables) => {
  const currencyCode = (await cookies()).get('currencyCode')?.value as CurrencyCode | undefined;
  
  const product = await getProductPrices({ entityId, optionValueIds, currencyCode });
  const t = await getTranslations('Product.Details');
  const format = await getFormatter();
  
  const showPriceRange =
    product?.prices?.priceRange.min.value !== product?.prices?.priceRange.max.value;

  if (!product?.prices) {
    return null;
  }

  return (
    <>
      {product.prices && (
        <div className="my-6 text-2xl font-bold lg:text-3xl .productView-price .price--main">
          {showPriceRange ? (
            <span className=' .productView-price .price--main'>
              {format.number(product.prices.priceRange.min.value, {
                style: 'currency',
                currency: product.prices.price.currencyCode,
              })}{' '}
              -{' '}
              {format.number(product.prices.priceRange.max.value, {
                style: 'currency',
                currency: product.prices.price.currencyCode,
              })}
            </span>
          ) : (
            <>
              {product.prices.retailPrice?.value !== undefined && (
                <span>
                  {t('Prices.msrp')}:{' '}
                  <span className="line-through">
                    {format.number(product.prices.retailPrice.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                  <br />
                </span>
              )}
              {product.prices.salePrice?.value !== undefined &&
                product.prices.basePrice?.value !== undefined ? (
                <>
                  <span>
                    {t('Prices.was')}:{' '}
                    <span className="line-through">
                      {format.number(product.prices.basePrice.value, {
                        style: 'currency',
                        currency: product.prices.price.currencyCode,
                      })}
                    </span>
                  </span>
                  <br />
                  <span className=' .productView-price .price--main'>
                    {t('Prices.now')}:{' '}
                    {format.number(product.prices.price.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                </>
              ) : (
                product.prices.price.value && (
                  <span className='.productView-price .price--main'>
                    {format.number(product.prices.price.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                )
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};