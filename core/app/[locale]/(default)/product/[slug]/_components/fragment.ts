
import { graphql } from '~/client/graphql';

export const DetailsFragment = graphql(`
  fragment DetailsFragment on Product {
    prices(includeTax: true, currencyCode: $currencyCode) {
      price {
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
    }
  }
`);