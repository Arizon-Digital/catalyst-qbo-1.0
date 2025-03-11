import React, { Suspense } from 'react';
import { ProductSnippet, ProductSnippetSkeleton } from '../components/product-snippet';

const OrderItemLayout = ({ lineItems }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {lineItems.map((shipment) => (
        <li key={shipment.entityId} className="py-4">
          <Suspense fallback={<ProductSnippetSkeleton isExtended={true} />}>
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <ProductSnippet
                    imagePriority={true}
                    imageSize="square"
                    isExtended={true}
                    product={assembleProductData(shipment)}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {shipment.productName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {shipment.quantity}
                      </p>
                    </div>
                    <div className="flex-shrink-0 whitespace-nowrap">
                      <p className="text-base font-medium text-gray-900">
                        {shipment.extendedListPrice.formatted}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
        </li>
      ))}
    </ul>
  );
};

export default OrderItemLayout;