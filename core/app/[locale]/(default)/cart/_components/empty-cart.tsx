import { useTranslations } from 'next-intl';
import { Breadcrumbs as ComponentsBreadcrumbs } from '~/components/ui/breadcrumbs';

export const EmptyCart = () => {
  const t = useTranslations('Cart');
  const breadcrumbs: any = [
    {
      label: 'YOUR CART',
      href: '/cart/',
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <ComponentsBreadcrumbs breadcrumbs={breadcrumbs} />
      {/* <h1 className="pb-6 text-4xl font-black lg:pb-10 lg:text-5xl">{t('heading')}</h1> */}
      <h1 className="cart-heading mb-[0.75rem] text-[25px] font-normal">Your Cart (0 items)</h1>
      <div className="flex grow flex-col items-center justify-center gap-6 py-20">
        <h2 className="text-xl font-bold lg:text-2xl">{t('empty')}</h2>
        {/* <p className="text-center">{t('emptyDetails')}</p> */}
      </div>
    </div>
  );
};
