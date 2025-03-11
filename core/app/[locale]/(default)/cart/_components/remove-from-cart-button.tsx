'use client';

import { useTranslations } from 'next-intl';
import { useFormStatus } from 'react-dom';
import { BcImage } from '~/components/bc-image';

import { Button } from '~/components/ui/button';

interface Props {
  icon: string
  }

  export const RemoveFromCartButton = ({icon}: Props) => {
  const { pending } = useFormStatus();
  const t = useTranslations('Cart.SubmitRemoveItem');

  return (
    <Button
    className=" remove-cart-btn w-auto items-center p-0 text-primary hover:bg-transparent disabled:text-primary disabled:hover:text-primary"
    loading={pending}
    loadingText={t('spinnerText')}
    type="submit"
    variant="subtle"
    >
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

  <path d="M3 6h18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  
 
  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  
  <path d="M9 11v6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M12 11v6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M15 11v6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

    </Button>
    );
};
