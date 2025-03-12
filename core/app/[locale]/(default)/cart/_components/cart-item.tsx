import { useFormatter } from 'next-intl';
import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { FragmentOf, graphql } from '~/client/graphql';
import { BcImage } from '~/components/bc-image';

import * as Dialog from '@radix-ui/react-dialog';
import { imageManagerImageUrl } from '~/lib/store-assets';

const PhysicalItemFragment = graphql(`
  fragment PhysicalItemFragment on CartPhysicalItem {
    name
    brand
    sku
    url
    image {
      url: urlTemplate(lossy: true)
    }
    entityId
    quantity
    productEntityId
    variantEntityId
    extendedListPrice {
      currencyCode
      value
    }
    extendedSalePrice {
      currencyCode
      value
    }
    originalPrice {
      currencyCode
      value
    }
    listPrice {
      currencyCode
      value
    }
    selectedOptions {
      __typename
      entityId
      name
      ... on CartSelectedMultipleChoiceOption {
        value
        valueEntityId
      }
      ... on CartSelectedCheckboxOption {
        value
        valueEntityId
      }
      ... on CartSelectedNumberFieldOption {
        number
      }
      ... on CartSelectedMultiLineTextFieldOption {
        text
      }
      ... on CartSelectedTextFieldOption {
        text
      }
      ... on CartSelectedDateFieldOption {
        date {
          utc
        }
      }
    }
  }
`);

const DigitalItemFragment = graphql(`
  fragment DigitalItemFragment on CartDigitalItem {
    name
    brand
    sku
    url
    image {
      url: urlTemplate(lossy: true)
    }
    entityId
    quantity
    productEntityId
    variantEntityId
    extendedListPrice {
      currencyCode
      value
    }
    extendedSalePrice {
      currencyCode
      value
    }
    originalPrice {
      currencyCode
      value
    }
    listPrice {
      currencyCode
      value
    }
    selectedOptions {
      __typename
      entityId
      name
      ... on CartSelectedMultipleChoiceOption {
        value
        valueEntityId
      }
      ... on CartSelectedCheckboxOption {
        value
        valueEntityId
      }
      ... on CartSelectedNumberFieldOption {
        number
      }
      ... on CartSelectedMultiLineTextFieldOption {
        text
      }
      ... on CartSelectedTextFieldOption {
        text
      }
      ... on CartSelectedDateFieldOption {
        date {
          utc
        }
      }
    }
  }
`);

export const CartItemFragment = graphql(
  `
    fragment CartItemFragment on CartLineItems {
      physicalItems {
        ...PhysicalItemFragment
      }
      digitalItems {
        ...DigitalItemFragment
      }
    }
  `,
  [PhysicalItemFragment, DigitalItemFragment],
);

type FragmentResult = FragmentOf<typeof CartItemFragment>;
type PhysicalItem = FragmentResult['physicalItems'][number];
type DigitalItem = FragmentResult['digitalItems'][number];

export type Product = PhysicalItem | DigitalItem;

interface Props {
  product: Product;
  currencyCode: string;
  deleteIcon: string;
}

const ExclamationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-18 h-16">
    <circle cx="12" cy="12" r="11" stroke="#FFC5A8" strokeWidth="2"/>
    <path d="M12 6v7" stroke="#FFC5A8" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill="#FFC5A8"/>
  </svg>
);

const DeleteConfirmationDialog = ({
  product,
  currencyCode,
  deleteIcon,
  children
}: {
  product: Product;
  currencyCode: string;
  deleteIcon: string;
  children: React.ReactNode;
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6 shadow-lg animate-content-show">
          <Dialog.Title className="flex justify-center mb-4">
            <ExclamationIcon />
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 mb-6 text-center">
            Are you sure you want to delete this item?
          </Dialog.Description>

          <div className="flex justify-end gap-4">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">
                Cancel
              </button>
            </Dialog.Close>
           
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const CartItem = ({ currencyCode, product }: Props) => {
  const format = useFormatter();

  const formatCurrency = (value: number) => {
    return format.number(value, {
      style: 'currency',
      currency: currencyCode,
    })?.replace('CA$', 'C$');
  };

  return (
    <>
      <tbody className="cart-item-desk border border-[#CFD8DC]">
        <tr className="relative">
          {/* Image */}
          <td className="product-td-img w-[80px] relative">
            {product.image?.url ? (
              <Link href={product.url} className="product-img-div flex justify-center items-center">
                <BcImage
                  alt={product.name}
                  height={33}
                  src={product.image.url}
                  width={33}
                  className="product-img w-[33px] h-[33px]"
                />
              </Link>
            ) : (
              <div className="h-full w-full bg-gray-200" />
            )}
          </td>

          {/* Product name and SKU */}
          <td className="">
            <p className="text-xl font-bold md:text-2xl" id="cartbrandname">
              {product.brand}
            </p>
            <Link 
              href={product.url}
              className="text-xl font-bold md:text-2xl hover:text-blue-600 transition-colors" 
              id="cartproductname"
            >
              {product.name}
              
            </Link>
          </td>

          {/* Original price */}
          <td className="price cart">
            <p className="text-lg font-bold">
              {formatCurrency(product.originalPrice.value)}
            </p>
          </td>

          {/* Quantity and Remove Item button */}
          <td className="cart-qunRem">
            <div className="cart-qunRem-div">
              
              {/* Remove Item */}
              <div className="deleteIcon-div hidden md:block">
                <DeleteConfirmationDialog product={product} currencyCode={currencyCode} deleteIcon="">
                  <button className="flex items-center">
                    <Trash2 className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors" />
                  </button>
                </DeleteConfirmationDialog>
              </div>
            </div>
          </td>

          {/* Sale price */}
          <td className="price cart">
            <p className="text-lg font-bold">
              {formatCurrency(product.extendedSalePrice.value)}
            </p>
          </td>
        </tr>
      </tbody>

      <li className="cart-item-tab border-b border-b-[#CFD8DC] px-[12px] pt-[12px]">
        <div className='flex gap-[20px] items-center min-h-[100px] relative'>
          <div className="absolute top-2 right-2 carticonmobile">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
          </div>
          <Link href={product.url} className="product-td-img w-[80px] h-[80px] flex items-center justify-center">
            {product.image?.url ? (
              <BcImage
                alt={product.name}
                height={33}
                src={product.image.url}
                width={33}
                className="w-[33px] h-[33px]"
              />
            ) : (
              <div className="h-full w-full bg-gray-200" />
            )}
          </Link>
          <div className='flex-shrink-[100]'>
            <p className="text-xl font-bold md:text-2xl" id="cartbrandname">
              {product.brand}
            </p>
            <Link 
              href={product.url}
              className="text-xl font-bold md:text-2xl hover:text-blue-600 transition-colors" 
              id="cartproductname"
            >
              {product.name}
            </Link>
          </div>
        </div>
        <div className='cart-item-tab-val flex mb-[15px] ml-[100px] mt-[10px] gap-[40px] justify-start'>
          <div className='flex flex-col cart-item-tab-val-div1'>
            <p>Price : </p>
            <p className="text-lg font-bold">
              {formatCurrency(product.originalPrice.value)}
            </p>
          </div>
          <div className="cart-qunRem flex flex-col cart-item-tab-val-div1">
            <p>Quantity : </p>
            <div className="cart-qunRem-div">
            
              {/* Remove Item */}
              <div className="deleteIcon-div">
                <DeleteConfirmationDialog product={product} currencyCode={currencyCode} deleteIcon="">
                  <button className="flex items-center">
                    <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600 transition-colors" />
                  </button>
                </DeleteConfirmationDialog>
              </div>
            </div>
          </div>
          <div className='flex flex-col cart-item-tab-val-div1'>
            <p>Total : </p>
            <p className="text-lg font-bold">
              {formatCurrency(product.extendedSalePrice.value)}
            </p>
          </div>
        </div>
      </li>
    </>
  );
};