import { getTranslations } from 'next-intl/server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { bypassReCaptcha } from '~/lib/bypass-recaptcha';

import { ResetPasswordForm } from './_components/reset-password-form';
import { ResetPasswordFormFragment } from './_components/reset-password-form/fragment';
import { Forgotpasswordbreadcrumb as ComponentsBreadcrumbs } from '~/components/ui/breadcrumbs/forgotpasswordbreadcrumbs';
const Forgotpasswordbreadcrumb: any = [
  {
    label: 'Forgot Password',
    href: '/login/forgot-password/',
  },
];
const ResetPageQuery = graphql(
  `
    query ResetPageQuery {
      site {
        settings {
          reCaptcha {
            ...ResetPasswordFormFragment
          }
        }
      }
    }
  `,
  [ResetPasswordFormFragment],
);

export async function generateMetadata() {
  const t = await getTranslations('Login.ForgotPassword');

  return {
    title: t('title'),
  };
}

export default async function Reset() {
  const t = await getTranslations('Login.ForgotPassword');

  const { data } = await client.fetch({
    document: ResetPageQuery,
    fetchOptions: { next: { revalidate } },
  });

  const recaptchaSettings = await bypassReCaptcha(data.site.settings?.reCaptcha);

  return (
    <div className="mx-auto my-6 max-w-[35rem] pageheading">
      <div className="mb-8 text-4xl font-black lg:text-5xl">
      <ComponentsBreadcrumbs breadcrumbs={Forgotpasswordbreadcrumb} className="mb-8 text-4xl font-black lg:text-5xl"/>
      </div>
      <h2 className="mb-8 text-4xl font-black lg:text-5xl">{t('heading')}</h2>
      < ResetPasswordForm reCaptchaSettings={recaptchaSettings} />
    </div>
  );
}

export const runtime = 'edge';
