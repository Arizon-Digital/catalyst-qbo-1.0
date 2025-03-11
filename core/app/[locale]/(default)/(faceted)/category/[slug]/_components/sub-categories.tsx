import { useTranslations } from 'next-intl';

import { FragmentOf, graphql } from '~/client/graphql';
import { Link } from '~/components/link';

export const CategoryTreeFragment = graphql(`
  fragment CategoryTreeFragment on Site {
    categoryTree(rootEntityId: $categoryId) {
      entityId
      name
      description
      path
      children {
        entityId
        name
        path
        children {
          entityId
          name
          path
        }
      }
    }
  }
`);

type FragmentResult = FragmentOf<typeof CategoryTreeFragment>;
type CategoryTree = FragmentResult['categoryTree'];

interface Props {
  categoryTree: CategoryTree;
}

export function SubCategories({ categoryTree }: Props) {
  const t = useTranslations('FacetedGroup.MobileSideNav');

  if (!categoryTree[0]?.children?.length) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="p-[8px_18px] border-b border-b-[#dcdcdc] font-[700] text-[15px]">{categoryTree[0]?.name}</h3>

      <ul className="flex flex-col gap-4 p-[8px_18px] font-[500] text-[15px]">
        {categoryTree[0].children.map((category) => (
          <li key={category.entityId}>
            <Link href={category.path}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
