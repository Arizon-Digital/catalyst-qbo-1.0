import { BookUser, Package, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

import { Link } from '~/components/link';

import { WelcomeMessage } from './welcome';

interface AccountItem {
  children: ReactNode;
  description?: string;
  href: string;
  title: string;
}

const AccountItem = ({ children, title, description, href }: AccountItem) => {
  return (
    <Link
      className="flex items-center border border-gray-200 p-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      href={href}
    >
      {children}
      <span>
        <h3 className="font-bold text-base font-robotoslab">{title}</h3>
        {description ? <p>{description}</p> : null}
      </span>
    </Link>
  );
};

export async function generateMetadata() {
  const t = await getTranslations('Account.Home');

  return {
    title: t('title'),
  };
}

export default function Account() {
  const t = useTranslations('Account.Home');

  return (
    <div className="mx-auto">
      <h1 className="my-8 text-2xl  font-normal lg:my-8 lg:text-2xl font-robotoslab text-center"> My Account</h1>
      <WelcomeMessage />

      <div className="mb-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 ml-12 mr-12">
        <AccountItem  href="/account/orders" title='Order'>
          <Package className="me-8 " size={48} strokeWidth={1.5} />
        </AccountItem>
        <AccountItem href="/account/addresses" title='Addresses'>
          <BookUser className="me-8" size={48} strokeWidth={1.5} />
        </AccountItem>
        <AccountItem href="/account/settings" title='Account settings'>
          <Settings className="me-8" size={48} strokeWidth={1.5} />
        </AccountItem>
        <AccountItem href="/account/return-form" title="Returns Form">
          <Package className="me-8" size={48} strokeWidth={1.5} />
        </AccountItem>
      </div>
    </div>
  );
}


