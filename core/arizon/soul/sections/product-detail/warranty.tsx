import { useTranslations } from 'next-intl';

import { FragmentOf, graphql } from '~/client/graphql';
import { getWebpageData } from '../../../webpages/contact/[id]/page-data';

export const WarrantyFragment = graphql(`
  fragment WarrantyFragment on Product {
    warranty
  }
`);

interface Props {
  product: FragmentOf<typeof WarrantyFragment>;
}

export const Warranty = ({ product }: Props) => {
  const t = useTranslations('Product.Warranty');

  if (!product.warranty) {
    return null;
  }

  // return (
  //   <>
  //   <div className='tech-data'>
  //   <div className='product-reviews-header'>
  //     <h2  className="mb-4 mt-8 text-xl font-bold md:text-2xl page-heading">Spare Parts</h2>
  //     <hr className="product-info-hr" />
  //     </div>
  //     <p dangerouslySetInnerHTML={{ __html: product.warranty }}></p>
  //     </div>
  //   </>
  // );
};
