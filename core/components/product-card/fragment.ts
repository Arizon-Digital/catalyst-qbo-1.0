import { PricingFragment } from '~/client/fragments/pricing';
import { graphql } from '~/client/graphql';

export const ProductCardFragment = graphql(
  `
    fragment ProductCardFragment on Product {
      entityId
      name
      defaultImage {
        altText
        url: urlTemplate(lossy: true)
        urlResize: url(width: 340, height: 340, lossy: true)
      }
        description
      sku
      weight {
        value
        unit
      }
      condition
      customFields {
        edges {
          node {
            entityId
            name
            value
          }
        }
      }
      warranty
      path
      brand {
        name
        path
      }
      reviewSummary {
        numberOfReviews
        averageRating
      }
      ...PricingFragment
    }
  `,
  [PricingFragment],
);
