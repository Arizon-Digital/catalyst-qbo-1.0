import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

// TODO: Add recaptcha token
// import { bypassReCaptcha } from '~/lib/bypass-recaptcha';

import { DynamicFormSection } from '@/arizon/soul/sections/dynamic-form-section';
import { formFieldTransformer } from '~/data-transformers/form-field-transformer';
import {
  PASSWORD_FIELDS,
  ALL_FIELDS,
} from '~/data-transformers/form-field-transformer/utils';
import { exists } from '~/lib/utils';

import { registerCustomer } from './_actions/register-customer';
import { getRegisterCustomerQuery } from './page-data';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Register');

  return {
    title: t('title'),
  };
}

export default async function Register() {
  const t = await getTranslations('Register');

  const registerCustomerData = await getRegisterCustomerQuery({
    address: { sortBy: 'SORT_ORDER' },
    customer: { sortBy: 'SORT_ORDER' },
  });

  if (!registerCustomerData) {
    notFound();
  }

  const { addressFields, customerFields } = registerCustomerData;


  return (
    <DynamicFormSection
      action={registerCustomer}
      fields={[
        ...addressFields
          .filter((field) => ALL_FIELDS.includes(field.entityId))
          .map(formFieldTransformer)
          .filter(exists),
        ...customerFields
          .filter((field) => PASSWORD_FIELDS.includes(field.entityId))
          .map(formFieldTransformer)
          .filter(exists),
      ]}
      submitLabel={t('Form.submit')}
      title={t('heading')}
    />
  );
}
