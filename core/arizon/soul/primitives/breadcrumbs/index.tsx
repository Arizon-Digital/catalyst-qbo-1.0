import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { FragmentOf } from '~/client/graphql';

import { Breadcrumbs as ComponentsBreadcrumbs } from '~/components/ui/breadcrumbs/breadcrumbs';

import { BreadcrumbsCategoryFragment } from '~/components/breadcrumbs/fragment';

interface Props {
  category: FragmentOf<typeof BreadcrumbsCategoryFragment>;
}

export const Breadcrumbs = ({ category }: Props) => {
  const breadcrumbs = removeEdgesAndNodes(category.breadcrumbs).map(({ name, path }) => ({
    label: name,
    href: path ?? '#',
  }));

  if (breadcrumbs.length < 1) {
    return null;
  }

  return <ComponentsBreadcrumbs breadcrumbs={breadcrumbs} />;
};
