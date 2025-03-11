'use client';

import { useTranslations } from 'next-intl';
import { ChangeEvent, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Breadcrumbs as ComponentsBreadcrumbs } from '~/components/ui/breadcrumbs';

import { Link } from '~/components/link';
import { Button } from '~/components/ui/button';
import {
  Field,
  FieldControl,
  FieldLabel,
  FieldMessage,
  Form,
  FormSubmit,
  Input,
} from '~/components/ui/form';
import { Message } from '~/components/ui/message';

import { useAccountStatusContext } from '../../../account/(tabs)/_components/account-status-provider';
import { login } from '../_actions/login';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('Login');

  return (
    <Button
      className="md:w-auto" id='signinbutton'
      loading={pending}
      loadingText={t('Form.submitting')}
      variant="primary"
    >
      SIGN IN    </Button>
  );
};

export const LoginForm = () => {
  const t = useTranslations('Login');

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [state, formAction] = useActionState(login, { status: 'idle' });
  const { accountState } = useAccountStatusContext();

  const isFormInvalid = state?.status === 'error';

  const handleInputValidation = (e: ChangeEvent<HTMLInputElement>) => {
    const validationStatus = e.target.validity.valueMissing;

    switch (e.target.name) {
      case 'email': {
        setIsEmailValid(!validationStatus);

        return;
      }

      case 'password': {
        setIsPasswordValid(!validationStatus);
      }
    }
  };

  return (
    <>
      {accountState.status === 'success' && (
        <Message className="col-span-full mb-8 w-full text-gray-500" variant={accountState.status}>
          <p>{accountState.message}</p>
        </Message>
      )}

      {isFormInvalid && (
        <Message className="mb-8 lg:col-span-2" variant="error">
          <p>{t('Form.error')}</p>
        </Message>
      )}
      <Form action={formAction} className="mb-8 flex flex-col gap-3 md:mb-14 bg-white border border-[#dcdcdc] rounded-[4px] shadow-[0_3px_0_#dcdcdc] p-[.75rem]">
        <Field className="relative space-y-2 pb-7" name="email">
          <FieldLabel htmlFor="email">Email Address:</FieldLabel>
          <FieldControl asChild>
            <Input
              autoComplete="email"
              error={!isEmailValid}
              id="email"
              onChange={handleInputValidation}
              onInvalid={handleInputValidation}
              required
              type="email"
            />
          </FieldControl>
          <FieldMessage
            className="absolute inset-x-0 bottom-0 inline-flex w-full text-xs text-error"
            match="valueMissing"
          >
            {t('Form.enterEmailMessage')}
          </FieldMessage>
        </Field>
        <Field className="relative space-y-2 pb-7"id='password' name="password">
          <FieldLabel className='leading-[1.5] font-[300]' htmlFor="password">Password:</FieldLabel>
          <FieldControl asChild>
            <Input
              error={!isPasswordValid}
              id="password"
              onChange={handleInputValidation}
              onInvalid={handleInputValidation}
              required
              type="password"
            />
          </FieldControl>
          <FieldMessage
            className="absolute inset-x-0 bottom-0 inline-flex w-full text-xs text-error"
            match="valueMissing"
          >
            {t('Form.entePasswordMessage')}
          </FieldMessage>
        </Field>
        <div className="flex flex-col items-start md:flex-row md:items-center md:justify-start md:gap-2">
          <FormSubmit asChild>
            <SubmitButton />
          </FormSubmit>
          <Link
            className="my-5 inline-flex items-center justify-start font-semibold underline  hover:text-secondary md:my-0"
            href="/login/forgot-password"
          >
            {t('Form.forgotPassword')}
          </Link>
        </div>
      </Form>
    </>
  );
};
