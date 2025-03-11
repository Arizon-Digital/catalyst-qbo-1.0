import { cache } from 'react';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { ProductItemFragment } from '~/client/fragments/product-item';
import { graphql, VariablesOf } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

import { DescriptionFragment } from './_components/description';
import { DetailsFragment } from './_components/details';
import { GalleryFragment } from './_components/gallery/fragment';
import { WarrantyFragment } from './_components/warranty';
import { BreadcrumbsFragment } from '~/components/breadcrumbs/fragment';
 
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
          seo {
            pageTitle
            metaDescription
            metaKeywords
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
 
export const getProduct = cache(async (variables: Variables) => {
  const customerAccessToken = await getSessionCustomerAccessToken();

  const { data } = await client.fetch({
    document: ProductPageQuery,
    variables,
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });
 
  return data.site.product;
});
 
 