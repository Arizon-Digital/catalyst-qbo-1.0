

import { getFormatter, getTranslations } from 'next-intl/server';
import { FragmentOf, graphql } from '~/client/graphql';

import { ShippingEstimator } from './shipping-estimator';
import { GeographyFragment, ShippingEstimatorFragment } from './shipping-estimator/fragment';
import { getShippingCountries } from './shipping-estimator/get-shipping-countries';

const MoneyFieldsFragment = graphql(`
  fragment MoneyFields on Money {
    currencyCode
    value
  }
`);

export const CheckoutSummaryFragment = graphql(
  `
    fragment CheckoutSummaryFragment on Checkout {
      ...ShippingEstimatorFragment
      ...CouponCodeFragment
      subtotal {
        ...MoneyFields
      }
      grandTotal {
        ...MoneyFields
      }
      taxTotal {
        ...MoneyFields
      }
      cart {
        currencyCode
        discountedAmount {
          ...MoneyFields
        }
      }
    }
  `,
  [MoneyFieldsFragment, ShippingEstimatorFragment],
);

interface Props {
  checkout: FragmentOf<typeof CheckoutSummaryFragment>;
  geography: FragmentOf<typeof GeographyFragment>;
}

export const CheckoutSummary = async ({ checkout, geography }: Props) => {
  console.log("checkout summary");
  const t = await getTranslations('Cart.CheckoutSummary');
  const format = await getFormatter();

  const { cart, grandTotal, subtotal, taxTotal } = checkout;

  const shippingCountries = await getShippingCountries({ geography });

  const formatCurrency = (value: number | undefined, currencyCode: string | undefined) => {
    return format.number(value || 0, {
      style: 'currency',
      currency: currencyCode,
    })?.replace('CA$', 'C$');
  };

  return (
    <>
      <div className="flex justify-between py-3">
        <span className="font-semibold">Subtotal:</span>
        <span>
          {formatCurrency(subtotal?.value, cart?.currencyCode)}
        </span>
      </div>

      <ShippingEstimator checkout={checkout} shippingCountries={shippingCountries} />

      {/* {cart?.discountedAmount && (
        <div className="flex justify-between border-t border-t-gray-200 py-4">
          <span className="font-semibold">{t('discounts')}</span>
          <span>
            -
            {formatCurrency(cart.discountedAmount.value, cart.currencyCode)}
          </span>
        </div>
      )} */}

      {/* <CouponCode checkout={checkout} /> */}

      {/* {taxTotal && (
        <div className="flex justify-between border-t border-t-gray-200 py-4">
          <span className="font-semibold">{t('tax')}</span>
          <span>
            {formatCurrency(taxTotal.value, cart?.currencyCode)}
          </span>
        </div>
      )} */}

      <div className="flex cart-gtotal justify-between border-t border-t-gray-200 py-3 text-medium font-bold lg:text-2xl">
        Grand Total:
        <span>
          {formatCurrency(grandTotal?.value, cart?.currencyCode)}
        </span>
      </div>
    </>
  );
};
