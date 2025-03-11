'use client';

import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Button } from '~/components/ui/button';
import { redirectToCheckout } from "~/app/[locale]/(default)/cart/_actions/redirect-to-checkout";
import { useCommonContext } from '~/components/common-context/common-provider';

const InternalButton = ({title}: {title?:string}) => {
  const t = useTranslations('Cart');
  const { pending } = useFormStatus();

  return (
    <Button className="block w-full !text-[13px] !p-[9px_12px] bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90" loading={pending} loadingText={t('loading')}>
      {title ? title : 'CHECKOUT NOW'}
    </Button>
  );
};

export const CheckoutButtonPopUp = ({ cartId, title }: { cartId: string, title?: string }) => {
  const cartContext = useCommonContext();
  if(!cartId) {
    cartId = cartContext.getCartId;
  }
  return (
    <form action={redirectToCheckout} className='w-full'>
      <input name="cartId" type="hidden" value={cartId} />
      <InternalButton title={title} />
    </form>
  );
};