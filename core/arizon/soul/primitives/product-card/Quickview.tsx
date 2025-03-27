

'use client';

import React, { useState, useEffect, cache } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import TabComponent from '@/arizon/soul/sections/product-detail/tab';
import { Gallery } from '~/components/ui/gallery';
import { PriceLabel } from '../price-label';
import { ProductDetailForm } from '../../sections/product-detail/product-detail-form';
import { productOptionsTransformer } from '~/data-transformers/product-options-transformer-client';
import { addToCart } from '~/app/[locale]/(default)/product/[slug]/_actions/add-to-cart';
import { pricesTransformer } from '~/data-transformers/prices-transformer';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { redirectToCheckout } from '~/app/[locale]/(default)/cart/_actions/redirect-to-checkout';
import { ProductDetail } from '../../sections/product-detail';

interface QuickViewProps {
  product: any;
}

const getProduct = (product: any) => {
  const t = useTranslations('Product.ProductDetails.Accordions');

  const format = useFormatter();
  const images = removeEdgesAndNodes(product?.images).map((image) => ({
    src: image.url,
    alt: image.altText,
  }));

  const customFields = removeEdgesAndNodes(product?.customFields);

  const specifications = [
    {
      name: t('sku'),
      value: product?.sku,
    },
    {
      name: t('weight'),
      value: `${product?.weight?.value} ${product?.weight?.unit}`,
    },
    {
      name: t('condition'),
      value: product?.condition,
    },
    ...customFields?.map((field) => ({
      name: field.name,
      value: field.value,
    })),
  ];

  const accordions = [
    ...(specifications?.length
      ? [
        {
          title: t('specifications'),
          content: (
            <div className="prose @container">
              <dl className="flex flex-col gap-4">
                {specifications?.map((field, index) => (
                  <div className="grid grid-cols-1 gap-2 @lg:grid-cols-2" key={index}>
                    <dt>
                      <strong>{field.name}</strong>
                    </dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ),
        },
      ]
      : []),
    ...(product?.warranty
      ? [
        {
          title: t('warranty'),
          content: (
            <div className="prose" dangerouslySetInnerHTML={{ __html: product.warranty }} />
          ),
        },
      ]
      : []),
  ];

  const categories = (product?.categories) ? removeEdgesAndNodes(product?.categories) : [];

  // Find the category with the longest breadcrumb trail
  const categoryWithMostBreadcrumbs = categories?.reduce((longest, current) => {
    const longestLength = longest?.breadcrumbs?.edges?.length || 0;
    const currentLength = current?.breadcrumbs?.edges?.length || 0;
    return currentLength > longestLength ? current : longest;
  }, categories[0]);

  // Create breadcrumbs structure only for the most complete path
  const categoryWithBreadcrumbs = categoryWithMostBreadcrumbs
    ? {
      ...categoryWithMostBreadcrumbs,
      breadcrumbs: {
        edges: [
          ...(categoryWithMostBreadcrumbs?.breadcrumbs?.edges || []),
          {
            node: {
              name: product.name || '',
              path: '#',
            },
          },
        ].filter(Boolean),
      },
    }
    : null;
  return {
    id: product?.entityId.toString(),
    title: product?.name,
    description: <div dangerouslySetInnerHTML={{ __html: product?.description }} />,
    plainTextDescription: product?.plainTextDescription,
    href: product?.path,
    images: product?.defaultImage
      ? [{ src: product?.defaultImage.url, alt: product?.defaultImage?.altText }, ...images]
      : images,
    productData: product,
    price: pricesTransformer(product?.prices, format),
    subtitle: product?.brand?.name,
    rating: product?.reviewSummary.averageRating,
    accordions,
    sku: product?.sku,
    breadcrumbs: categoryWithBreadcrumbs,
    redirectToCheckout: redirectToCheckout,
  };
};

const getFields = async (product: any) => {
  return await productOptionsTransformer(product?.productOptions);
};

const getCtaLabel = async (product: any) => {
  const t = useTranslations('Product.ProductDetails.Submit');

  if (product?.availabilityV2?.status === 'Unavailable') {
    return t('unavailable');
  }

  if (product?.availabilityV2?.status === 'Preorder') {
    return t('preorder');
  }

  if (!product?.inventory?.isInStock) {
    return t('outOfStock');
  }

  return t('addToCart');
};

const getCtaDisabled = async (product: any) => {

  if (product?.availabilityV2?.status === 'Unavailable') {
    return true;
  }

  if (product?.availabilityV2?.status === 'Preorder') {
    return false;
  }

  if (!product?.inventory?.isInStock) {
    return true;
  }

  return false;
};

const QuickView = ({
  product
}: QuickViewProps) => {
  const productId: number = product?.id;
  const t = useTranslations('Product');
  const [isOpen, setIsOpen] = useState(false);
  let productUpdated: any = getProduct(product);

  const openQuickView = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setIsOpen(true);
  }
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={openQuickView}
        className="z-10 flex w-full items-center justify-center gap-2 rounded-[4px] border border-amber-600 bg-[#CA9618] -600 p-0 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-white hover:text-amber-600"
      >
        <div className="flex items-center justify-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pl-1"
          >
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1-.01-8.99A4.5 4.5 0 0 1 14 10.5c0 2.49-2.01 4.5-4.5 4.5z" />
          </svg>
          <span>QUICK VIEW</span>
        </div>
      </button>

      <Dialog.Root
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <Dialog.Title></Dialog.Title>
          <Dialog.Description></Dialog.Description>
          <Dialog.Content
            className="quickview fixed left-1/2 top-1/2 !h-[900px] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white shadow-lg z-[9999]"
          >
            <div className="p-8">

              <button
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 z-[10000]"
                onClick={() => {
                  setIsOpen(false);
                }}
                type="button"
                style={{ left: 'auto', right: '16px' }}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </button>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
                <div className="mb-12 mt-4">
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    <ProductDetail
                      action={addToCart}
                      additionalInformationLabel={t('ProductDetails.additionalInformation')}
                      ctaDisabled={getCtaDisabled(product)}
                      ctaLabel={getCtaLabel(product)}
                      decrementLabel={t('ProductDetails.decreaseQuantity')}
                      fields={getFields(product)}
                      incrementLabel={t('ProductDetails.increaseQuantity')}
                      prefetch={true}
                      product={getProduct(product)}
                      productId={productId}
                      quantityLabel={t('ProductDetails.quantity')}
                      thumbnailLabel={t('ProductDetails.thumbnail')}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-6">
                    <TabComponent product={product} />
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default QuickView;