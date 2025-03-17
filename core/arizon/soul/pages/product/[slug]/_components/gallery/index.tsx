'use client';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { FragmentOf } from '~/client/graphql';
import { Gallery as ComponentsGallery } from '~/components/ui/gallery';

import { GalleryFragment } from './fragment';
import { useEffect } from 'react';

interface Props {
  product: FragmentOf<typeof GalleryFragment>;
}

export const Gallery = ({ product }: Props) => {
  const images = (product.images) ? removeEdgesAndNodes(product.images) : [];

  // Pick the top-level default image
  const topLevelDefaultImg = images.find((image) => image.isDefault);

  // If product.defaultImage exists, and product.defaultImage.url is not equal to the url of the isDefault image in images,
  // mark the existing isDefault image to "isDefault = false" and append the correct default image to images
  if (product.defaultImage && topLevelDefaultImg?.url !== product.defaultImage.url) {
    images.forEach((image) => {
      image.isDefault = false;
    });

    images.push({
      url: product.defaultImage.url,
      altText: product.defaultImage.altText,
      isDefault: true,
    });
  }
  useEffect(() => {
    let getRecentlyViewedItems: any = localStorage.getItem('qbo_recently_viewed_items');
    let recentlyViewedItems: any = JSON?.parse(getRecentlyViewedItems) || [];
    let productId = product?.entityId;
    let productFound = recentlyViewedItems?.find((item: any) => item == productId);
   
    if(!productFound) {
      recentlyViewedItems.push(Number(productId));
      localStorage.setItem('qbo_recently_viewed_items', JSON.stringify(recentlyViewedItems));
    }
  }, []);
  const defaultImageIndex = images.findIndex((image) => image.isDefault);

  return (
    <div className=" mb-10 sm:-mx-0 md:mb-12">
      <div className="lg:sticky lg:top-0">
        <ComponentsGallery
          defaultImageIndex={defaultImageIndex}
          images={images.map((image) => ({ src: image.url, altText: image.altText }))}
        />
      </div>
    </div>
  );
};
