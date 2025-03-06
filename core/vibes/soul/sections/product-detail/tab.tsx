'use client';

import React, { useState } from 'react';
import TechData from './techdata';
import Bulk from './bulkprice';
import Deliveryinformation from './DeliveryInformation';
import { FragmentOf } from '~/client/graphql';
import { WarrantyFragment } from './warranty';

interface TabComponentProps {
  product: FragmentOf<typeof WarrantyFragment> & {
    description: string;
    techdata: any;
    Bulkprice: any;
    DelivaryInformation: any;
    reviews: any;
    sku: string;
  };
}

const TabComponent: React.FC<TabComponentProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('Description');
  
  const productWithoutWarranty = {
    ...product,
    warranty: undefined
  };

  const tabContent = {
    Description: { data: product.description, label: 'Description' },
    TechnicalData: { data: product.techdata, label: 'Technical Data' },
    BulkPricing: { data: product.Bulkprice, label: 'Bulk Pricing' },
    DeliveryInformation: { data: product.DelivaryInformation, label: 'Delivery Information' },
    Reviews: { data: product.reviews, label: 'Reviews' },
    ...(product.warranty && {
      SpareParts: { data: product.warranty, label: 'Spare Parts' }
    })
  };

  const renderDescriptionContent = () => {
    return (
      <div className="space-y-6">
        {/* Description section with margin */}
        <div className="md:ml-8">
          {/* Description heading with golden underline */}
          <div className="relative pb-4">
            <h1 className="text-2xl font-bold text-[#03465c]">Description</h1>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
          </div>
          
          {/* Description content with styled elements */}
          <div 
            dangerouslySetInnerHTML={{ __html: product.description }} 
            className="description-content [&>h2]:font-oswald [&>h2]:text-[30px] [&>h2]:font-normal [&>h2]:my-[25px] [&>h4]:font-semibold [&>h4]:mt-9 [&>p]:mb-6"
          />
        </div>
        
        {/* Technical Data content without margin */}
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
        return <Deliveryinformation product={product} />;
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
      {/* Tab layout for desktop view */}
      <div className="hidden md:block">
        <div className="justify-left mb-4 flex pl-8">
          {Object.entries(tabContent).map(([tab, value]) => (
            <button
              key={tab}
              className={`p-3 ${
                activeTab === tab ? 'bg-white text-[#03465c]' : 'bg-[#E2E2E2] text-[#03465c]'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {value?.label?.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="bg-white p-4 text-left">
          <div className="text-base text-[#03465c]">
            {renderTabContent(activeTab)}
          </div>
        </div>
      </div>

      {/* Static table layout for mobile view */}
      <div className="block rounded-lg bg-[#e7f5f8] md:hidden">
        <table className="w-full table-auto text-left">
          <tbody className="text-sm text-[#03465c]">
            {Object.entries(tabContent).map(([tab, value]) => (
              <tr key={tab} className="border-b border-[#03465c]/10">
                {/* <th className="p-4 font-bold">{value.label}</th> */}
                <td className="p-4">{renderTabContent(tab)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabComponent;