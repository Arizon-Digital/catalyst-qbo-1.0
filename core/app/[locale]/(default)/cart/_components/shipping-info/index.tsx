

import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useReducer } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'react-hot-toast';

import { getShippingCountries } from '~/app/[locale]/(default)/cart/_components/shipping-estimator/get-shipping-countries';
import { FragmentOf } from '~/client/graphql';
import { ExistingResultType } from '~/client/util';
import { Button } from '~/components/ui/button';
import {
  Field,
  FieldControl,
  FieldLabel,
  Form,
  FormSubmit,
  Input,
  Select,
} from '~/components/ui/form';
import { cn } from '~/lib/utils';

import { ShippingInfoFragment } from './fragment';
import { submitShippingInfo } from './submit-shipping-info';

interface FormValues {
  country: string;
  state: string;
  city: string;
  postcode: string;
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('Cart.SubmitShippingInfo');

  return (
    <Button
      className="w-full items-center px-8 py-2"
      loading={pending}
      loadingText={t('spinnerText')}
      variant="secondary"
    >
      {t('submitText')}
    </Button>
  );
};

export const ShippingInfo = ({
  checkout,
  shippingCountries,
  isVisible,
  hideShippingOptions,
}: {
  checkout: FragmentOf<typeof ShippingInfoFragment>;
  shippingCountries: ExistingResultType<typeof getShippingCountries>;
  isVisible: boolean;
  hideShippingOptions: () => void;
}) => {
  const t = useTranslations('Cart.ShippingInfo');

  const shippingConsignment =
    checkout.shippingConsignments?.find((consignment) => consignment.selectedShippingOption) ||
    checkout.shippingConsignments?.[0];

  // Find Canada in shipping countries
  const canadaCountry = shippingCountries.find(country => country.code === 'CA');

  const [formValues, setFormValues] = useReducer(
    (currentValues: FormValues, newValues: Partial<FormValues>) => ({
      ...currentValues,
      ...newValues,
    }),
    {
      country: shippingConsignment?.address.countryCode ?? 'CA', // Set Canada as default
      state: shippingConsignment?.address.stateOrProvince ?? '',
      city: shippingConsignment?.address.city ?? '',
      postcode: shippingConsignment?.address.postalCode ?? '',
    },
  );

  const selectedCountry = shippingCountries.find(({ code }) => code === formValues.country);

  // Initialize with Canada and its first province if available
  useEffect(() => {
    if (canadaCountry && !formValues.country) {
      const firstProvince = canadaCountry.statesOrProvinces?.[0]?.name || '';
      setFormValues({ 
        country: 'CA',
        state: firstProvince
      });
    }
  }, [shippingCountries]);

  // Preselect first state when states array changes and state is empty
  useEffect(() => {
    if (!!selectedCountry?.statesOrProvinces && !formValues.state) {
      setFormValues({ state: selectedCountry.statesOrProvinces[0]?.name || '' });
    }
  }, [formValues.state, selectedCountry?.statesOrProvinces]);

  const onSubmit = async (formData: FormData) => {
    const { status } = await submitShippingInfo(formData, {
      checkoutId: checkout.entityId,
      lineItems:
        checkout.cart?.lineItems.physicalItems.map((item) => ({
          lineItemEntityId: item.entityId,
          quantity: item.quantity,
        })) || [],
      shippingId: shippingConsignment?.entityId ?? '',
    });

    if (status === 'error') {
      toast.error(t('errorMessage'), {
        icon: <AlertCircle className="text-error-secondary" />,
      });
    }
  };

  return (
    <Form
      action={onSubmit}
      className={cn('mx-auto shipping-form mb-4 mt-4 hidden w-full grid-cols-1 gap-y-4', isVisible && 'grid')}
    >
      <div className='flex flex-col shipping-details gap-[10px]'>
        <Field className="relative shipping-country space-y-2 flex items-center justify-between" name="country">
          <FieldLabel htmlFor="country">{t('country')}</FieldLabel>
          <FieldControl asChild>
            <Select
              autoComplete="country"
              id="country"
              onValueChange={(value: string) => {
                if (value) {
                  setFormValues({ country: value, state: '', city: '', postcode: '' });
                } else {
                  setFormValues({ country: 'CA', state: '', city: '', postcode: '' }); // Default back to Canada if cleared
                }

                hideShippingOptions();
              }}
              options={shippingCountries.map(({ code, name }) => ({
                value: code,
                label: name,
              }))}
              placeholder={t('countryPlaceholder')}
              value={formValues.country}
              defaultValue="CA"
            />
          </FieldControl>
        </Field>
        <Field className="relative space-y-2 shipping-state" name="state">
          <FieldLabel htmlFor="state">{t('state')}</FieldLabel>
          <FieldControl asChild>
            {selectedCountry?.statesOrProvinces ? (
              <Select
                disabled={selectedCountry.statesOrProvinces.length === 0}
                id="state"
                onValueChange={(value) => setFormValues({ state: value })}
                options={selectedCountry.statesOrProvinces.map(({ name }) => ({
                  value: name,
                  label: name,
                }))}
                placeholder={t('statePlaceholder')}
                value={formValues.state}
              />
            ) : (
              <Input
                autoComplete="address-level1"
                onChange={(e) => setFormValues({ state: e.target.value })}
                placeholder={t('statePlaceholder')}
                type="text"
                value={formValues.state}
              />
            )}
          </FieldControl>
        </Field>
        <Field className="relative space-y-2 shipping-city" name="city">
          <FieldLabel htmlFor="city-field">{t('city')}</FieldLabel>
          <FieldControl asChild>
            <Input
              autoComplete="address-level2"
              id="city-field"
              onChange={(e) => setFormValues({ city: e.target.value })}
              placeholder={t('cityPlaceholder')}
              type="text"
              value={formValues.city}
            />
          </FieldControl>
        </Field>
        <Field className="relative space-y-2 shipping-zipcode" name="zip">
          <FieldLabel htmlFor="zip-field">{t('postcode')}</FieldLabel>
          <FieldControl asChild>
            <Input
              autoComplete="postal-code"
              id="zip-field"
              onChange={(e) => setFormValues({ postcode: e.target.value })}
              placeholder={t('postcodePlaceholder')}
              type="text"
              value={formValues.postcode}
            />
          </FieldControl>
        </Field>
      </div>
      <FormSubmit asChild className='shipping-submit-btn'>
        <SubmitButton />
      </FormSubmit>
    </Form>
  );
};