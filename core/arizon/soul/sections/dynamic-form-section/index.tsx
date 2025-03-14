import { clsx } from 'clsx';

import { DynamicForm, DynamicFormAction } from '@/vibes/soul/primitives/dynamic-form';
import { Field, FieldGroup } from '@/vibes/soul/primitives/dynamic-form/schema';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';

interface Props<F extends Field> {
  title?: string;
  subtitle?: string;
  action: DynamicFormAction<F>;
  fields: Array<F | FieldGroup<F>>;
  submitLabel?: string;
  className?: string;
}

export function DynamicFormSection<F extends Field>({
  className,
  title,
  subtitle,
  fields,
  submitLabel,
  action,
}: Props<F>) {
  return (
    <SectionLayout className={clsx('mx-auto w-full max-w-4xl', className)} containerSize="lg">
      {title != null && title !== '' && (
        <header className="pb-8 @2xl:pb-12 @4xl:pb-16">
          <h2 className="mb-4  font-extralight font-grey font-robotoslab leading-none text-center @xl:text-xs ">
          HOME / CREATE ACCOUNT
          </h2>
          <h1 className="mb-2   font-normal font-robotoslab leading-none @xl:text-2xl text-center">
          New Account
          </h1>
          {subtitle != null && subtitle !== '' && (
            <p className="mb-10 text-base font-light leading-none @xl:text-lg">{subtitle}</p>
          )}
        </header>
      )}
      <DynamicForm action={action} fields={fields} submitLabel={submitLabel} />
    </SectionLayout>
  );
}





