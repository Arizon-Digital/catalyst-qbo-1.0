'use server';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
 

const CurrenciesQueries = graphql(`
  query getSiteCurrencies {
    site {
      currencies {
        edges {
          node {
            code
            entityId
            name
          }
        }
      }
    }
  }`
);

export const getCurrencyListData = cache(async () => {
  const { data: currencyData } = await client.fetch({
    document: CurrenciesQueries,
    fetchOptions: { next: { revalidate } },
  });

  return removeEdgesAndNodes(currencyData?.site?.currencies);
});

export const getCurrencyCodeFn = async () => {
  return (await cookies()).get('currencyCode')?.value;
}

export const setCurrencyCodeFn = async (cookieValue: string) => {
  (await cookies()).set({
    name: 'currencyCode',
    value: cookieValue,
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
  });
  return true;
}
 
 