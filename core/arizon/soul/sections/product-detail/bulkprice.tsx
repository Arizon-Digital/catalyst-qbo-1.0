
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FragmentOf, graphql } from '~/client/graphql';
import HubspotContactForm  from './hubspot';


// GraphQL fragment for Bulk Pricing
export const Bulkprice = graphql(`
  fragment BulkPriceFragment on Product {
    bulk_discount_rates {
      min
      max
      type
      discount {
        formatted
      }
    }
  }
`);

interface Props {
  product: FragmentOf<typeof Bulkprice>;
}

const Bulk: React.FC<Props> = ({ product }) => {
  const t = useTranslations('Product.Bulk');

  // Check if there are bulk discount rates
  if (!product.bulk_discount_rates || product.bulk_discount_rates.length === 0) {
    return (
      <div className="tab-content" id="tab-bulk" data-emthemesmodez-mobile-collapse>
        <h2 className="page-heading">Bulk Pricing</h2>
        <hr className="product-info-hr" />
        <div className="productView-bulk-tabContent overflow-x-hidden" data-emthemesmodez-mobile-collapse-content>
          <p>
            For bulk discount on this product, contact our dedicated sales team today by filling out the form below:
          </p>
          <HubspotContactForm />
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content m-0 p-0 " id="tab-bulk" data-emthemesmodez-mobile-collapse>
      <h2 className="page-heading">Bulk Pricing</h2>
      <hr className="product-info-hr" />
      <div className="productView-bulk-tabContent" data-emthemesmodez-mobile-collapse-content>
      ----  <ul className="bulk-pricing-list">
          {product.bulk_discount_rates.map((rate, index) => (
            <li key={index} className="bulk-pricing-item">
              <span className="bulk-pricing-range" id="bulk-pricing-range">
                {rate.min === rate.max
                  ? t('products.bulk_pricing.range_single', { min: rate.min })
                  : t('products.bulk_pricing.range', { min: rate.min, max: rate.max })}
              </span>
              <span className="bulk-pricing-value" id="bulk-pricing-value">
                {rate.type === 'percent' && t('products.bulk_pricing.percent', { discount: rate.discount.formatted })}
                {rate.type === 'fixed' && t('products.bulk_pricing.fixed', { discount: rate.discount.formatted })}
                {rate.type === 'price' && t('products.bulk_pricing.price', { discount: rate.discount.formatted })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Bulk;

