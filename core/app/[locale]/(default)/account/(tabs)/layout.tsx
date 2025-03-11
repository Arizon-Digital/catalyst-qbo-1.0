import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { TabNavigation, TabType } from './_components/tab-navigation';

const tabList = ['orders', 'addresses', 'wishlists', 'settings'] as const;

export type TabType = (typeof tabList)[number];

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string; tab?: TabType }>;
}

export default async function AccountTabLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <>
      <TabNavigation />
      {children}
    </>
  );
}
