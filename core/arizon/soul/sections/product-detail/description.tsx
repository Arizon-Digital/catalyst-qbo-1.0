
import { useTranslations } from 'next-intl';
import { FragmentOf, graphql } from '~/client/graphql';

import { log } from 'console';
import TechData  from './techdata';
import TabComponent from './tab';

export const DescriptionFragment = graphql(`
  fragment DescriptionFragment on Product {
    description
  }
`);

interface Props {
  product: FragmentOf<typeof DescriptionFragment>;
}




export const Description = ({ product }: any) => {
  const t = useTranslations('Product.Description');
  if (!product.description) {
    return null; // Return null if no description
  }

  return (
    <>
      
      {/* Pass product description to the TabComponent */}
      {/* <TabComponent product={product} /> */}
      {/* <TechData product={product} /> */}
    </>
    
  );
};


