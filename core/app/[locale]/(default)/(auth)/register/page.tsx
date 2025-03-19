import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Breadcrumbs as ComponentsBreadcrumbs } from '~/components/ui/breadcrumbs';

import { bypassReCaptcha } from '~/lib/bypass-recaptcha';

import { RegisterCustomerForm } from './_components/register-customer-form';
import { getRegisterCustomerQuery } from './page-data';

const FALLBACK_COUNTRY = {
  entityId: 226,
  name: 'United States',
  code: 'US',
};

export async function generateMetadata() {
  const t = await getTranslations('Register');

  return {
    title: t('title'),
  };
}

export default async function Register() {
  const t = await getTranslations('Register');
  const breadcrumbs: any = [
    {
      label: 'CREATE ACCOUNT',
      href: '#',
    },
  ];

  const registerCustomerData = await getRegisterCustomerQuery({
    address: { sortBy: 'SORT_ORDER' },
    customer: { sortBy: 'SORT_ORDER' },
  });

  if (!registerCustomerData) {
    notFound();
  }

  const {
    addressFields,
    customerFields,
    countries,
    defaultCountry = FALLBACK_COUNTRY.name,
    reCaptchaSettings,
  } = registerCustomerData;

  const reCaptcha = await bypassReCaptcha(reCaptchaSettings);

  const {
    code = FALLBACK_COUNTRY.code,
    entityId = FALLBACK_COUNTRY.entityId,
    statesOrProvinces,
  } = countries.find(({ name }) => name === defaultCountry) || {};

  return (
    <div className="mx-auto mb-10 register-page-parent text-base lg:w-2/3 pageheading" id='width'>
     <div className='flex items-center justify-center'>
      <ComponentsBreadcrumbs
        className="login-div login-breadcrumb mx-auto  px-[1px]"
        breadcrumbs={breadcrumbs}
      />
      </div>
      <h1 className="text-2xl font-normal text-center mb-9 font-robotoslab">{t('heading')}</h1>
      <RegisterCustomerForm
        addressFields={addressFields}
        customerFields={customerFields}
        reCaptchaSettings={reCaptcha}
        countries={countries}
        defaultCountry={{ entityId, code, states: statesOrProvinces ?? [] }}
      />
    </div>
  );
}

// export const runtime = 'edge';