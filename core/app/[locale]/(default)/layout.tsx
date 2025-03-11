import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren, Suspense } from 'react';
import { Cart } from '~/Arizon/soul/sections/cart';
import { Footer } from '~/Arizon/soul/sections/footer';
import { Header, HeaderSkeleton } from '~/components/header';






interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function DefaultLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);
  
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header  cart={<Cart />} />
      </Suspense>

      <main className=" main-layout-css flex-1 px-4 2xl:container sm:px-10 lg:px-12 2xl:mx-auto 2xl:px-0 pdpwidth">
        {children}
      </main>

      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
