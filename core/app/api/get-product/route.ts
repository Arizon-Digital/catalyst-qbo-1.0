import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { NextRequest, NextResponse } from 'next/server';
import { cache } from 'react';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { ProductItemFragment } from '~/client/fragments/product-item';
import { graphql, VariablesOf } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { BreadcrumbsFragment } from '~/components/breadcrumbs/fragment';
 
import { DescriptionFragment } from '~/app/[locale]/(default)/product/[slug]/_components/description';
import { DetailsFragment } from '~/app/[locale]/(default)/product/[slug]/_components/fragment';
import { GalleryFragment } from '~/app/[locale]/(default)/product/[slug]/_components/gallery/fragment';
import { WarrantyFragment } from '~/app/[locale]/(default)/product/[slug]/_components/warranty';

const ProductPageQuery = graphql(
  `
    query ProductPageQuery(
      $entityId: Int!
      $optionValueIds: [OptionValueId!]
      $useDefaultOptionSelections: Boolean
      $currencyCode: currencyCode
    ) {
      site {
        product(
          entityId: $entityId
          optionValueIds: $optionValueIds
          useDefaultOptionSelections: $useDefaultOptionSelections
        ) {
          ...GalleryFragment
          ...DetailsFragment
          ...ProductItemFragment
          ...DescriptionFragment
          ...WarrantyFragment
          entityId
          name
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
            url: urlTemplate(lossy: true)
            altText
          }
          categories(first: 3) {
            edges {
              node {
                ...BreadcrumbsFragment
              }
            }
          }
        }
      }
    }
  `,
  [
    BreadcrumbsFragment,
    GalleryFragment,
    DetailsFragment,
    ProductItemFragment,
    DescriptionFragment,
    WarrantyFragment,
  ],
);
 
type Variables = VariablesOf<typeof ProductPageQuery>;
export type CurrencyCode = Variables['currencyCode'];

export const GET = async (
  _request: NextRequest
) => {
  const searchParams: any = _request?.nextUrl?.searchParams
  const productId = searchParams.get('productId');
  const currencyCode = searchParams.get('currencyCode');
  const customerAccessToken = await getSessionCustomerAccessToken();
  let variables = {
    entityId: Number(productId),
    optionValueIds: [],
    currencyCode,
    useDefaultOptionSelections: true,
  };
  const { data } = await client.fetch({
    document: ProductPageQuery,
    variables,
    customerAccessToken,
    fetchOptions: { next: { revalidate } },
  });

  return NextResponse.json(data.site.product);
};

export const runtime = 'edge';
