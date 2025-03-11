'use client';

import { AlertCircle, Minus, Plus, Loader2 as Spinner } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'react-hot-toast';

import { graphql } from '~/client/graphql';

import { Product } from '../cart-item';

import { updateItemQuantity } from './update-item-quantity';

type CartSelectedOptionsInput = ReturnType<typeof graphql.scalar<'CartSelectedOptionsInput'>>;

const parseSelectedOptions = (selectedOptions: Product['selectedOptions']) => {
  return selectedOptions.reduce<CartSelectedOptionsInput>((accum, option) => {
    let multipleChoicesOptionInput;
    let checkboxOptionInput;
    let numberFieldOptionInput;
    let textFieldOptionInput;
    let multiLineTextFieldOptionInput;
    let dateFieldOptionInput;

    switch (option.__typename) {
      case 'CartSelectedMultipleChoiceOption':
        multipleChoicesOptionInput = {
          optionEntityId: option.entityId,
          optionValueEntityId: option.valueEntityId,
        };

        if (accum.multipleChoices) {
          return {
            ...accum,
            multipleChoices: [...accum.multipleChoices, multipleChoicesOptionInput],
          };
        }

        return { ...accum, multipleChoices: [multipleChoicesOptionInput] };

      case 'CartSelectedCheckboxOption':
        checkboxOptionInput = {
          optionEntityId: option.entityId,
          optionValueEntityId: option.valueEntityId,
        };

        if (accum.checkboxes) {
          return { ...accum, checkboxes: [...accum.checkboxes, checkboxOptionInput] };
        }

        return { ...accum, checkboxes: [checkboxOptionInput] };

      case 'CartSelectedNumberFieldOption':
        numberFieldOptionInput = {
          optionEntityId: option.entityId,
          number: option.number,
        };

        if (accum.numberFields) {
          return { ...accum, numberFields: [...accum.numberFields, numberFieldOptionInput] };
        }

        return { ...accum, numberFields: [numberFieldOptionInput] };

      case 'CartSelectedTextFieldOption':
        textFieldOptionInput = {
          optionEntityId: option.entityId,
          text: option.text,
        };

        if (accum.textFields) {
          return {
            ...accum,
            textFields: [...accum.textFields, textFieldOptionInput],
          };
        }

        return { ...accum, textFields: [textFieldOptionInput] };

      case 'CartSelectedMultiLineTextFieldOption':
        multiLineTextFieldOptionInput = {
          optionEntityId: option.entityId,
          text: option.text,
        };

        if (accum.multiLineTextFields) {
          return {
            ...accum,
            multiLineTextFields: [...accum.multiLineTextFields, multiLineTextFieldOptionInput],
          };
        }

        return { ...accum, multiLineTextFields: [multiLineTextFieldOptionInput] };

      case 'CartSelectedDateFieldOption':
        dateFieldOptionInput = {
          optionEntityId: option.entityId,
          date: new Date(String(option.date.utc)).toISOString(),
        };

        if (accum.dateFields) {
          return {
            ...accum,
            dateFields: [...accum.dateFields, dateFieldOptionInput],
          };
        }

        return { ...accum, dateFields: [dateFieldOptionInput] };
    }

    return accum;
  }, {});
};

const SubmitButton = ({ children, ...props }: ComponentPropsWithoutRef<'button'>) => {
  const { pending } = useFormStatus();
  const t = useTranslations('Cart.SubmitItemQuantity');

  return (
    <button
      className="hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:text-gray-200"
      disabled={pending}
      type="submit"
      {...props}
    >
      {children}
      {pending && <span className="sr-only">{t('spinnerText')}</span>}
    </button>
  );
};

const Quantity = ({ value }: { value: number }) => {
  const { pending } = useFormStatus();
  const t = useTranslations('Cart.SubmitItemQuantity');

  return (
    <span className="flex w-10 flex-1 justify-center">
      {pending ? (
        <>
          <Spinner aria-hidden="true" className="animate-spin text-primary" />
          <span className="sr-only">{t('spinnerText')}</span>
        </>
      ) : (
        <span>{value}</span>
      )}
    </span>
  );
};

export const ItemQuantity = ({ product }: { product: Product }) => {
  const t = useTranslations('Cart.SubmitItemQuantity');
  const cartT = useTranslations('Cart');

  const { quantity, entityId, productEntityId, variantEntityId, selectedOptions } = product;
  const [productQuantity, setProductQuantity] = useState<number>(quantity);

  useEffect(() => {
    document.title=cartT("title" );
    setProductQuantity(quantity);
  }, [quantity]);

  const onSubmit = async (formData: FormData) => {
    const { status } = await updateItemQuantity({
      lineItemEntityId: entityId,
      productEntityId,
      quantity: Number(formData.get('quantity')),
      selectedOptions: parseSelectedOptions(selectedOptions),
      variantEntityId,
    });

    if (status === 'error') {
      toast.error(t('errorMessage'), {
        icon: <AlertCircle className="text-error-secondary" />,
      });

      setProductQuantity(quantity);
    }
  };
  const handleQuantityChange = (e: { target: { value: any } }) => {
    const quantity = Number(e.target.value);
    if (quantity < 1) {
      setProductQuantity(1); // Enforce minimum value of 1
    } else {
      setProductQuantity(quantity); // Set the valid quantity
    }
  };

  const handleBlur = () => {
    onSubmit(); // Call backend update when the input loses focus
  };
  return (
    <div className="input-quantity w-[120px] border-2 p-2.5">
      <form action={onSubmit} className="flex items-center">
        <SubmitButton onClick={() => setProductQuantity(productQuantity - 1)}>
          <div className="quantity-reduce hover:bg-white flex justify-center items-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10l5 5 5-5"
                stroke="black"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <title>{t('submitReduceText')}</title>
          </div>
        </SubmitButton>

        {/* <input name="quantity" type="hidden" value={productQuantity} /> */}

        <input
          name="quantity"
          type="tel"
          value={productQuantity}
          onBlur={handleBlur} // Sync with backend on blur
          onChange={handleQuantityChange} // Use the new function
          className="w-12 border text-center text-[15px] font-[700] h-[26px] rounded-none !text-[#454545]"
          readOnly
          min="1"
        />
        {/* <Quantity value={productQuantity} /> */}

        <SubmitButton onClick={() => setProductQuantity(productQuantity + 1)}>
            <div className="quantity-increase hover:bg-white flex justify-center items-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 14l5-5 5 5"
                  stroke="black"
                  strokeWidth="1"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <title>{t('submitIncreaseText')}</title>
            </div>
        </SubmitButton>
      </form>
    </div>
  );
};
