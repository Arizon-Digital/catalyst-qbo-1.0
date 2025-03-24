'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Button } from '@/vibes/soul/primitives/button';
import { schema } from '@/vibes/soul/sections/product-detail/schema';




type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export type ForgotPasswordAction = Action<
  { lastResult: SubmissionResult | null; successMessage?: string },
  FormData
>;

interface Props {
  action: ForgotPasswordAction;
  emailLabel?: string;
  submitLabel?: string;
}

export function ForgotPasswordForm({
  action,
  emailLabel = 'Email',
  submitLabel = 'Reset password',
}: Props) {
  const [{ lastResult, successMessage }, formAction] = useActionState(action, { lastResult: null });
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <form {...getFormProps(form)} action={formAction} className="flex flex-grow flex-col gap-5">
      <Input
        {...getInputProps(fields.email, { type: 'text' })}
        errors={fields.email.errors}
        key={fields.email.id}
        label={emailLabel}
      />
      <SubmitButton>{submitLabel}</SubmitButton>
      {form.errors?.map((error, index) => (
        <FormStatus key={index} type="error">
          {error}
        </FormStatus>
      ))}
      {form.status === 'success' && successMessage != null && (
        <FormStatus>{successMessage}</FormStatus>
      )}
    </form>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button 
      className="mt-auto w-auto h-5 mx-auto px-8 py-2 !bg-[#CA9618] -600 !border !border-[#CA9618] -600 !text-white rounded-md uppercase font-bold transition-colors duration-300 hover:!bg-white hover:!text-[#CA9618] -600 hover:!border-[#CA9618] -600" 
      loading={pending} 
      type="submit"
      style={{ backgroundColor: "#ca9618" }}
    >
      {children}
    </Button>

  );
}
