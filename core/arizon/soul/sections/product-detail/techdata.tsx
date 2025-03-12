



import React from 'react';
import { useTranslations } from 'next-intl';
import { FragmentOf, graphql } from '~/client/graphql';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { PricingFragment } from '~/client/fragments/pricing';
// 

export const TechDataFragment = graphql(`
  fragment TechDataFragment on Product {
    sku
    condition
    availability
    description
    brand {
      name
    }
    availabilityV2 {
      description
    }
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
  }
`, [
 
  PricingFragment,
]);

interface Props {
  product: FragmentOf<typeof TechDataFragment>;
}

const TechData: React.FC<Props> = ({ product }) => {
  const t = useTranslations('Product.TechData');

  let customFields: any = [];
  if(product?.customFields) {
    customFields = removeEdgesAndNodes(product.customFields);
  }

  // Return null if no technical data is available
  if (!product.sku && !product.condition && !product.availability && 
      !product.brand && !product.weight) {
    return null;
  }

  return (
    <div className="tech-data">
      <div className="product-info">
        <h2 className="page-heading">Product Information</h2>
        <hr className="product-info-hr" />

        <div className="product-details">
          {product.brand?.name && (
            <>
              <span className="product-details-item">
                <strong>BRANDS:</strong>
                <img
                  src={`https://www.qualitybearingsonline.com/content/img/brands/product-details/${product.brand.name}.png`}
                  alt={`${product.brand.name} Brand Logo`}
                  className="product-details-logo"
                />
              </span>
            </>
          )}

          {product.sku && (
            <>
              <span className="product-details-item">
                <strong>SKU:</strong> <div className='value font-semibold'>{product.sku}</div>
              </span>
            </>
          )}

          {Boolean(product.availabilityV2?.description) && (
            <div className='product-details-itemss'>
              <h3 className="font-semibold flex id">
                Availability: <p className="font-semibold">{product.availabilityV2.description}</p>
              </h3>
            </div>
          )}

          {product.weight && (
            <>
              <span className="product-details-item">
                <strong>Weight:</strong> 
                <div className='value'>
                  {product.weight.value} {product.weight.unit}
                </div>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="product-reviews-header">
        <h2 className="page-heading">Technical Data</h2>
        <hr className="product-info-hr" />
        <br />
      </div>

      {customFields.length > 0 &&
        customFields.map((customField) => (
          <div key={customField.entityId} className='custom-field'>
            <h3 className="font-semibold">{customField.name}</h3>
            <p className='custom'>{customField.value}</p>
          </div>
        ))
      }

      
    </div>
  );
};

export default TechData;