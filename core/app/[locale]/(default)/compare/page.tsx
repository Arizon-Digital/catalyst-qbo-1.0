



import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { getFormatter, getTranslations } from 'next-intl/server';
import * as z from 'zod';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { PricingFragment } from '~/client/fragments/pricing';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { BcImage } from '~/components/bc-image';
import { Link } from '~/components/link';
import { SearchForm } from '~/components/search-form';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import DescriptionCell from './_components/add-to-cart/description-cell';
 
import { AddToCart } from './_components/add-to-cart';
import { AddToCartFragment } from './_components/add-to-cart/fragment';
import { cookies } from 'next/headers';
import { CurrencyCode } from '../product/[slug]/page-data';

const MAX_COMPARE_LIMIT = 10;

const CompareParamsSchema = z.object({
  ids: z
    .union([z.string(), z.array(z.string()), z.undefined()])
    .transform((value) => {
      if (Array.isArray(value)) {
        return value;
      }
 
      if (typeof value === 'string') {
        return [...value.split(',')];
      }
 
      return undefined;
    })
    .transform((value) => value?.map((id) => parseInt(id, 10))),
});

// Helper function to format currency
const formatPrice = (price: number, currencyCode: string, format: any) => {
  const formattedPrice = format.number(price, {
    style: 'currency',
    currency: currencyCode,
  });
  
  return formattedPrice.replace('CA$', 'C$');
};

const ComparePageQuery = graphql(
  `
    query ComparePageQuery($entityIds: [Int!], $first: Int, $currencyCode: currencyCode) {
      site {
        products(entityIds: $entityIds, first: $first) {
          edges {
            node {
              entityId
              name
              path
              brand {
                name
              }
              sku
              weight {
                value
                unit
              }
              customFields {
                edges {
                  node {
                    entityId
                    name
                    value
                  }
                }
              }
              defaultImage {
                altText
                url: urlTemplate(lossy: true)
              }
              productOptions(first: 3) {
                edges {
                  node {
                    entityId
                  }
                }
              }
              description
              inventory {
                aggregated {
                  availableToSell
                }
              }
              availabilityV2 {
                description
                status
              }
              ...AddToCartFragment
              ...PricingFragment
            }
          }
        }
      }
    }
  `,
  [AddToCartFragment, PricingFragment],
);
 
export async function generateMetadata() {
  const t = await getTranslations('Compare');
 
  return {
    title: t('title'),
  };
}
 
interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Compare(props: Props) {
  const searchParams = await props.searchParams;
  const t = await getTranslations('Compare');
  const format = await getFormatter();
  const customerAccessToken = await getSessionCustomerAccessToken();

  const parsed = CompareParamsSchema.parse(searchParams);
  const productIds = parsed.ids?.filter((id) => !Number.isNaN(id));
  const currencyCode = (await cookies()).get('currencyCode')?.value as CurrencyCode || 'CAD';
 
  const { data } = await client.fetch({
    document: ComparePageQuery,
    variables: {
      entityIds: productIds ?? [],
      first: productIds?.length ? MAX_COMPARE_LIMIT : 0,
      currencyCode: currencyCode
    },
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });
 
  const products = removeEdgesAndNodes(data.site.products).map((product) => ({
    ...product,
    productOptions: removeEdgesAndNodes(product.productOptions),
    customFields: removeEdgesAndNodes(product.customFields),
  }));
 
  if (!products.length) {
    return (
      <div className="flex w-full justify-center py-16 align-middle">
        <div className="flex max-w-2xl flex-col gap-8 pb-8">
          <h1 className="text-4xl font-black lg:text-5xl">{t('nothingToCompare')}</h1>
          <p className="text-lg">{t('helpingText')}</p>
          <SearchForm />
        </div>
      </div>
    );
  }
 
  return (
    <>      
      <h1 className="pb-8 text-4xl font-black lg:text-5xl">
        {t('heading', { quantity: products.length })}
      </h1>
 
      <div className="-mx-6 overflow-auto overscroll-x-contain px-4 sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12">
        <table className="mx-auto w-full max-w-full table-fixed text-base md:w-fit">
          <caption className="sr-only">{t('Table.caption')}</caption>
 
          <colgroup>
            <col className="w-[13.5rem]" span={products.length} />
          </colgroup>
 
          <thead>
            <tr>
              {products.map((product) => (
                <th className="sr-only" key={product.entityId} scope="col">
                  {product.name}
                </th>
              ))}
            </tr>
            <tr>
              {products.map((product) => {
                if (product.defaultImage) {
                  return (
                    <td className="px-4" key={product.entityId}>
                      <Link aria-label={product.name} href={product.path}>
                        <BcImage
                          alt={product.defaultImage.altText}
                          height={300}
                          src={product.defaultImage.url}
                          width={300}
                        />
                      </Link>
                    </td>
                  );
                }
 
                return (
                  <td className="px-4" key={product.entityId}>
                    <Link aria-label={product.name} href={product.path}>
                      <div className="flex aspect-square items-center justify-center bg-gray-200 text-gray-500">
                        <p className="text-lg">{t('Table.noImage')}</p>
                      </div>
                    </Link>
                  </td>
                );
              })}
            </tr>
            <tr>
              {products.map((product) => (
                <td className="px-4 pt-4 text-gray-500" key={product.entityId}>
                  {product.brand?.name}
                </td>
              ))}
            </tr>
            <tr>
              {products.map((product) => (
                <td className="px-4 align-top text-xl font-bold lg:text-2xl" key={product.entityId}>
                  <Link href={product.path}>{product.name}</Link>
                </td>
              ))}
            </tr>
            <tr>
              {products.map((product) => {
                const showPriceRange =
                  product.prices?.priceRange.min.value !== product.prices?.priceRange.max.value;
 
                return (
                  <td className="px-4 py-4 align-bottom text-base" key={product.entityId}>
                    {product.prices && (
                      <p className="w-36 shrink-0">
                        {showPriceRange ? (
                          <>
                            {formatPrice(product.prices.priceRange.min.value, product.prices.price.currencyCode, format)}{' '}
                            -{' '}
                            {formatPrice(product.prices.priceRange.max.value, product.prices.price.currencyCode, format)}
                          </>
                        ) : (
                          <>
                            {product.prices.retailPrice?.value !== undefined && (
                              <>
                                {t('Table.Prices.msrp')}:{' '}
                                <span className="line-through">
                                  {formatPrice(product.prices.retailPrice.value, product.prices.price.currencyCode, format)}
                                </span>
                                <br />
                              </>
                            )}
                            {product.prices.salePrice?.value !== undefined &&
                            product.prices.basePrice?.value !== undefined ? (
                              <>
                                {t('Table.Prices.was')}:{' '}
                                <span className="line-through">
                                  {formatPrice(product.prices.basePrice.value, product.prices.price.currencyCode, format)}
                                </span>
                                <br />
                                <>
                                  {t('Table.Prices.now')}:{' '}
                                  {formatPrice(product.prices.price.value, product.prices.price.currencyCode, format)}
                                </>
                              </>
                            ) : (
                              product.prices.price.value && (
                                <>
                                  {formatPrice(product.prices.price.value, product.prices.price.currencyCode, format)}
                                </>
                              )
                            )}
                          </>
                        )}
                      </p>
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              {products.map((product) => {
                if (product.productOptions.length) {
                  return (
                    <td className="border-b px-4 pb-12" key={product.entityId}>
                      <Button aria-label={product.name} asChild className="hover:text-white">
                        <Link href={product.path}>{t('Table.viewOptions')}</Link>
                      </Button>
                    </td>
                  );
                }
 
                return (
                  <td className="border-b px-4 pb-12" key={product.entityId}>
                    <AddToCart data={product} />
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* Description section with height control and read more */}
            <tr className="absolute mt-6">
              <th className="sticky start-0 top-0 m-0 ps-4 text-start" id="product-description">
                {t('Table.description')}
              </th>
            </tr>
            <tr>
              {products.map((product) => (
                <td
                  className="border-b px-4 pb-8 pt-20"
                  headers="product-description"
                  key={product.entityId}
                >
                  <DescriptionCell content={product.description} />
                </td>
              ))}
            </tr>
            
            {/* Technical Data section */}
            <tr className="absolute mt-6">
              <th className="sticky start-0 top-0 m-0 ps-4 text-start" id="product-technical">
            Other Details
              </th>
            </tr>
            <tr>
              {products.map((product) => (
                <td
                  className="border-b px-4 pb-8 pt-20"
                  headers="product-technical"
                  key={product.entityId}
                >
                  <div className="space-y-2">
                    {product.sku && (
                      <p className="flex flex-col">
                        <span className="font-semibold">SKU:</span>
                        <span className="text-gray-500">{product.sku}</span>
                      </p>
                    )}
                    {product.brand?.name && (
                      <p className="flex flex-col">
                        <span className="font-semibold">Brand:</span>
                        <span className="text-gray-500">{product.brand.name}</span>
                      </p>
                    )}
                    {product.weight && (
                      <p className="flex flex-col">
                        <span className="font-semibold">Weight:</span>
                        <span className="text-gray-500">
                          {product.weight.value} {product.weight.unit}
                        </span>
                      </p>)}
                    {product.customFields?.map((field) => (
                      <p key={field.entityId} className="flex flex-col">
                        <span className="font-semibold">{field.name}:</span>
                        <span className="text-gray-500">{field.value}</span>
                      </p>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Availability section */}
            <tr className="absolute mt-6">
              <th className="sticky start-0 top-0 m-0 ps-4 text-start" id="product-availability">
                {t('Table.availability')}
              </th>
            </tr>
            <tr>
              {products.map((product) => (
                <td
                  className="border-b px-4 pb-8 pt-20"
                  headers="product-availability"
                  key={product.entityId}
                >
                  <div>
                    <p>{product.availabilityV2?.description || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.inventory.aggregated?.availableToSell !== undefined 
                        ? `${product.inventory.aggregated.availableToSell} units available`
                        : ''}
                    </p>
                  </div>
                </td>
              ))}
            </tr>
            
            {/* Final action buttons */}
            <tr>
              {products.map((product) => {
                if (product.productOptions.length) {
                  return (
                    <td className="border-b px-4 pb-24 pt-12" key={product.entityId}>
                      <Button aria-label={product.name} asChild className="hover:text-white">
                        <Link href={product.path}>{t('Table.viewOptions')}</Link>
                      </Button>
                    </td>
                  );
                }
 
                return (
                  <td className="border-b px-4 pb-24 pt-12" key={product.entityId}>
                    <AddToCart data={product} />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
 
export const runtime = 'edge';