




'use client';

import React, { useState } from 'react';
import TechData from './techdata';
import Bulk from './bulkprice';
import Deliveryinformation from './DeliveryInformation';
import { FragmentOf } from '~/client/graphql';
import { WarrantyFragment } from './warranty';
import FeefoReview from './Feeforeview';

interface TabComponentProps {
  product: FragmentOf<typeof WarrantyFragment> & {
    description: string;
    techdata: any;
    Bulkprice: any;
    DelivaryInformation: any;
    reviews: any;
    sku: string;
  }|any;
  makeswiftDeliveryInfo?:any;
}

const TabComponent: React.FC<TabComponentProps> = ({ product, makeswiftDeliveryInfo }) => {
  const [activeTab, setActiveTab] = useState('Description');

 
  
  const productWithoutWarranty = {
    ...product,
    warranty: undefined
  };

  const tabContent = {
    Description: { data: product?.description, label: 'Description' },
    TechnicalData: { data: product?.techdata, label: 'Technical Data' },
    BulkPricing: { data: product?.Bulkprice, label: 'Bulk Pricing' },
    DeliveryInformation: { data: product?.DelivaryInformation, label: 'Delivery Information' },
    Reviews: { data: product?.reviews, label: 'Reviews' },
    ...(product?.warranty && {
      SpareParts: { data: product?.warranty, label: 'Spare Parts' }
    })
  };

  const renderDescriptionContent = () => {
    return (
      <div className="space-y-6">
        {/* Description section */}
        <div>
          {/* Description heading with golden underline */}
          <div className="relative pb-4">
            <h1 className="text-3xl font-normal !text-[#1A2348] font-oswald">Description</h1>
            <div className="border-t-2 !border-[#ca9618] my-2"></div>
          </div>
          
          {/* Description content with styled elements */}
          <div 
            dangerouslySetInnerHTML={{ __html: product.description }} 
            className="description-content [&>h2]:font-oswald [&>h2]:text-[30px] [&>h2]:font-normal [&>h2]:my-[25px] [&>h4]:font-semibold [&>h4]:mt-9 [&>p]:mb-6 font-robotoslab text-black mt-4"
          />
        </div>
        
        {/* Technical Data content */}
        <TechData product={productWithoutWarranty} />
      </div>
    );
  };

  const renderTabContent = (tab: string) => {
    switch (tab) {
      case 'Description':
        return renderDescriptionContent();
      case 'TechnicalData':
        return <TechData product={productWithoutWarranty} />;
      case 'BulkPricing':
        return <Bulk product={product} />;
      case 'DeliveryInformation':
        return makeswiftDeliveryInfo;
      case 'Reviews':
        return <FeefoReview sku={product.sku} />;
      case 'SpareParts':
        return <div dangerouslySetInnerHTML={{ __html: product.warranty }} />;
      default:
        return <div>{tabContent[tab]?.data}</div>;
    }
  };

  return (
    <div className="mb-10">
    
      <div className="hidden md:block">
       
      <div className="relative mx-auto w-full max-w-screen-2xl px-6  @xl:px-6  @4xl:px-8 mt-5 font-robotoslab">
         
          <div className="flex bg-[#E2E2E2] border border-gray-300 mt-8 font-robotoslab">
            {Object.entries(tabContent).map(([tab, value]) => (
              <button
                key={tab}
                className={`px-6 py-3 border-r border-gray-300 ${
                  activeTab === tab 
                    ? 'bg-white text-[#1A2348] font-medium border-b-0' 
                    : 'bg-[#E2E2E2] text-[#1A2348] hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {value?.label}
              </button>
            ))}
          </div>
          
          {/* Tab content with full-width background and border */}
          <div className="w-full bg-white p-6 text-left border border-t-0  border-[#dcdcdc]-300 rounded-md shadow-[0_3px_0_#dcdcdc]">
            <div className="text-base text-[#1A2348]">
              {renderTabContent(activeTab)}
            </div>
          </div>
        </div>
      </div>

      <div className="block rounded-lg bg-[#fff] md:hidden">
  <table className="w-full table-auto text-left pl-1 ">
    <tbody className="text-sm text-[#1A2348]">
      {Object.entries(tabContent)
        .filter(([tab]) => tab !== 'TechnicalData') // Filter out TechnicalData for mobile
        .map(([tab, value]) => (
          <tr key={tab} className="border-b border-[#1A2348]/10">
            <td className="p-1">{renderTabContent(tab)}</td>
          </tr>
        ))}
    </tbody>
  </table>
</div>
</div>
  );
};

export default TabComponent;