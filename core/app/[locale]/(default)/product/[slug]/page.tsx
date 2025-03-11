import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';



import { Description } from './_components/description';
import { Details } from './_components/details';
import { Gallery } from './_components/gallery';
import { ProductViewed } from './_components/product-viewed';
import { RelatedProducts } from './_components/related-products';
import { Reviews } from './_components/reviews';
import { Warranty } from './_components/warranty';
import { CurrencyCode, getProduct } from './page-data';
import { cookies } from 'next/headers';
import { Breadcrumbs } from '~/Arizon/soul/primitives/breadcrumbs';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getOptionValueIds({ searchParams }: { searchParams: Awaited<Props['searchParams']> }) {
  const { slug, ...options } = searchParams;

  return Object.keys(options)
    .map((option) => ({
      optionEntityId: Number(option),
      valueEntityId: Number(searchParams[option]),
    }))
    .filter(
      (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
    );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const productId = Number(params.slug);
  const optionValueIds = getOptionValueIds({ searchParams });
  const currencyCode = (await cookies()).get('currencyCode')?.value as CurrencyCode | undefined;

  const product = await getProduct({
    entityId: productId,
    optionValueIds,
    useDefaultOptionSelections: true,
    currencyCode,
  });
  // console.log('Product:::::::::::::::::', JSON.stringify(product));

  if (!product) {
    return {};
  }

  const { pageTitle, metaDescription, metaKeywords } = product.seo;
  const { url, altText: alt } = product.defaultImage || {};

  return {
    title: pageTitle || product.name,
    description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    openGraph: url
      ? {
          images: [
            {
              url,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function Product(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { locale, slug } = params;

  setRequestLocale(locale);

  const t = await getTranslations('Product');

  const productId = Number(slug);

  const optionValueIds = getOptionValueIds({ searchParams });
  const currencyCode = (await cookies()).get('currencyCode')?.value as CurrencyCode | undefined;

  const product = await getProduct({
    entityId: productId,
    optionValueIds,
    useDefaultOptionSelections: true,
    currencyCode,
  });

  if (!product) {
    return notFound();
  }

  const categories = removeEdgesAndNodes(product.categories) as CategoryNode[];
 
  // Find the category with the longest breadcrumb trail
  const categoryWithMostBreadcrumbs = categories.reduce((longest, current) => {
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



  return (
    <>
      {categoryWithBreadcrumbs && <Breadcrumbs category={categoryWithBreadcrumbs} />}

      <div className="mb-12 mt-4 lg:grid lg:grid-cols-2 lg:gap-8">
        <Gallery product={product} />
        <Details optionValueIds={optionValueIds} product={product} />
      </div>
      <div className="lg:col-span-2" id="tabsection">
        <Description product={product} />
        <Warranty product={product} />
        <Suspense fallback={t('loading')}>
          {/* <Reviews productId={product.entityId} /> */}
        </Suspense>
      </div>

      <Suspense fallback={t('loading')}>
        <div className="related-product-pdp [&_.product-item-plp]:!w-[unset]">
          <RelatedProducts productId={product.entityId} />
        </div>
      </Suspense>

      <ProductViewed product={product} />
    </>
  );
}

export const runtime = 'edge';
