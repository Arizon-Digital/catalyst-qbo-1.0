


import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import React, { useEffect } from 'react';

import { Link } from '~/components/link';
import ProductPriceDisplay from '~/app/[locale]/(default)/product/[slug]/_components/exclvat';
import { BcImage } from '~/components/bc-image';

const ViewedItems = ({ recentlyViewed }: { recentlyViewed: any }) => {
    const recentlyViewedItems = removeEdgesAndNodes(recentlyViewed);

    const getProductUrl = (item: any) => {
        if (item.path) return item.path;
        if (item.url) return item.url;
        return item.entityId ? `/product/${item.entityId}` : '#';
    };

    useEffect(() => {
        
        console.log('Recently viewed items:', recentlyViewedItems);
    }, [recentlyViewedItems]);

    return (
        <div>
            <ul id="viewed-items-list">
                {recentlyViewedItems.length > 0 ? (
                    recentlyViewedItems.map((item, i) => {
                        const productUrl = getProductUrl(item);
                        
                       
                        const price = item.pricesWithTax?.price || item.prices?.price;
                        const salePrice = item.pricesWithTax?.salePrice || item.prices?.salePrice;
                        
                       
                        const finalPrice = salePrice || price;
                        
                        const extendedSalePrice = {
                            value: finalPrice?.value || 0,
                            currencyCode: 'CAD'
                        };

                        return (
                            <li key={i} className="viewed-item">
                                <div>
                                    <BcImage
                                        width={320}
                                        height={320}
                                        className="imagerecents"
                                        src={item?.defaultImage?.url320wide}
                                        alt={item?.defaultImage?.altText}
                                    />
                                    
                                    <div className="price-ss">
                                        <div className="recently">
                                            <Link href={productUrl} className="hover:underline text-blue-600">
                                                {item.name || 'Item'}
                                            </Link>
                                        </div>
                                        <div className="miniprice">
                                            <ProductPriceDisplay
                                                page="bag"
                                                currencyData={extendedSalePrice.currencyCode}
                                                product={{
                                                    prices: {
                                                        price: {
                                                            value: extendedSalePrice.value,
                                                            currencyCode: extendedSalePrice.currencyCode,
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })
                ) : (
                    <li>No recently viewed items.</li>
                )}
            </ul>
        </div>
    );
};

export default ViewedItems;