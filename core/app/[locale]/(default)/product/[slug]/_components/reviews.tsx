import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { getFormatter, getTranslations } from 'next-intl/server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { Rating } from '~/components/ui/rating';

import { ProductReviewSchema, ProductReviewSchemaFragment } from './product-review-schema';

const ReviewsQuery = graphql(
  `
    query ReviewsQuery($entityId: Int!) {
      site {
        product(entityId: $entityId) {
          reviews(first: 5) {
            edges {
              node {
                ...ProductReviewSchemaFragment
                author {
                  name
                }
                entityId
                title
                text
                rating
                createdAt {
                  utc
                }
              }
            }
          }
        }
      }
    }
  `,
  [ProductReviewSchemaFragment],
);

interface Props {
  product: {
    entityId: number;
  };
}

export const Reviews = async ({ product }: Props) => {
  const t = await getTranslations('Product.Reviews');
  const format = await getFormatter();

  const { data } = await client.fetch({
    document: ReviewsQuery,
    variables: { entityId: product.entityId },
    fetchOptions: { next: { revalidate } },
  });

  const productData = data.site.product;

  if (!productData) {
    return null;
  }

  const reviews = removeEdgesAndNodes(productData.reviews);

  return (
    <>
      <h3 className="mb-4 mt-8 text-xl font-bold md:text-2xl">
        {t('heading')}
        {reviews.length > 0 && (
          <span className="ms-2 ps-1 text-gray-500">
            <span className="sr-only">{t('reviewsCount')}</span>
            {reviews.length}
          </span>
        )}
      </h3>

      <ul className="lg:grid lg:grid-cols-2 lg:gap-8">
        {reviews.length === 0 ? (
          <li>
            <p className="pb-6 pt-1">{t('unreviewed')}</p>
          </li>
        ) : (
          reviews.map((review) => {
            return (
              <li key={review.entityId}>
                <p className="mb-3 flex flex-nowrap text-primary">
                  <Rating rating={review.rating} />
                  <span className="sr-only">{t('reviewRating', { rating: review.rating })}</span>
                </p>
                <h4 className="text-base font-semibold">{review.title}</h4>
                <p className="mb-2 text-gray-500">
                  {t('reviewAuthor', { author: review.author.name })}{' '}
                  {format.dateTime(new Date(review.createdAt.utc), {
                    dateStyle: 'medium',
                  })}
                </p>
                <p className="mb-6">{review.text}</p>
              </li>
            );
          })
        )}
      </ul>

      {/* Add Feefo Script */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold mb-4">More Reviews from Feefo</h4>
        <div
          className="feefo-review-widget-product"
          data-product-sku="default-sku" 
        ></div>
        <script
          type="text/javascript"
          src="https://api.feefo.com/api/javascript/quality-bearings-online"
          async
        ></script>
      </div>

      {reviews.length > 0 && <ProductReviewSchema productId={product.entityId} reviews={reviews} />}
    </>
  );
};

export default Reviews;
