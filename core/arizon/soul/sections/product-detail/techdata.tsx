

import React from 'react';
import { useTranslations } from 'next-intl';
import { FragmentOf, graphql } from '~/client/graphql';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { PricingFragment } from '~/client/fragments/pricing';

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
`, [PricingFragment]);

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
        <h2 className="text-4xl font-normal text-[#000000] font-oswald">Product Information</h2>
        <hr className=" border-t-2 !border-[#ca9618] my-2" />
        
        <div className="product-details">
          {product.brand?.name && (
            <div className="product-details-item flex justify-between items-center font-robotoslab text-base font-semibold text-black mb-2">
              <span>BRAND:</span>
              <span>
                <img
                  src={`https://www.qualitybearingsonline.com/content/img/brands/product-details/${product.brand.name}.png`}
                  alt={`${product.brand.name} Brand Logo`}
                  className="product-details-logo"
                />
              </span>
            </div>
          )}
          
          {product.sku && (
            <div className="product-details-item flex justify-between items-center font-robotoslab text-base font-semibold text-black mb-2">
              <span>SKU:</span>
              <span className="font-normal">{product.sku}</span>
            </div>
          )}
          
          {Boolean(product.availabilityV2?.description) && (
            <div className="product-details-item flex justify-between items-center font-robotoslab text-base font-semibold text-black mb-2">
              <span>AVAILABILITY:</span>
              <span className="font-semibold">{product.availabilityV2.description}</span>
            </div>
          )}
          
          {product.weight && (
            <div className="product-details-item flex justify-between items-center font-robotoslab text-base font-semibold text-black mb-2">
              <span>WEIGHT:</span>
              <span className="font-normal">
                {product.weight.value} {product.weight.unit}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="product-reviews-header">
        <h2 className="text-4xl font-normal text-[#000000] font-oswald">Technical Data</h2>
        <hr className="border-t-2 !border-[#ca9618] my-2" />
        <br />
      </div>
      
      {customFields.length > 0 &&
        customFields.map((customField) => (
          <div key={customField.entityId} className="custom-field flex justify-between font-robotoslab text-base font-extralight text-black mb-2">
            <h3 className="product-details-item flex justify-between items-center font-robotoslab text-base font-semibold text-black">{customField.name}:</h3>
            <p className="custom">{customField.value}</p>
          </div>
        ))
      }
    </div>
  );
};

export default TechData;