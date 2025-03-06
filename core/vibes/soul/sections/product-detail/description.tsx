
import { useTranslations } from 'next-intl';
import { FragmentOf, graphql } from '~/client/graphql';
import TabComponent from '../_components/tab';
import { log } from 'console';
import TechData  from './techdata';

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
      <TabComponent product={product} />
      {/* <TechData product={product} /> */}
    </>
    
  );
};


