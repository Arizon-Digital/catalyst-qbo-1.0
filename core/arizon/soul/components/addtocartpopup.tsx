import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useFormatter } from 'next-intl';
import { Link } from '~/components/link';
import { BcImage } from '~/components/bc-image';
import { pricesTransformer } from "~/data-transformers/prices-transformer";
import { CheckoutButton } from "../sections/cart/client";

interface Props {
  data: any;
  count?: number;
  redirectToCheckout?: any;
}

const DialogDemo = ({
  open,
  setOpen,
  data,
  count,
  redirectToCheckout,
  handleModalClose,
  from,
}: {
  open: boolean,
  setOpen: any,
  data: any,
  count?: any,
  redirectToCheckout?: any,
  handleModalClose?: any
  from:string;
}) => {
  console.log("data", data)
  const [counterSec, setCounterSec] = useState(10);
  
  useEffect(() => {
    if (counterSec > 0) {
      setTimeout(() => {
        setCounterSec(counterSec - 1);
      }, 1000);
    } else {
      handleModalClose();
    }
  }, [counterSec, handleModalClose]);
  
  let productPrice: any;
  if (data?.price) {
    productPrice = data?.price;
  } else {
    const format = useFormatter();
    productPrice = pricesTransformer(data?.prices, format);
  }
  console.log("111111", from)
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className=" bg-black/20" />
        <Dialog.Description></Dialog.Description>
        <Dialog.Content className="fixed top-1/2 right-0 w-80 -translate-y-1/2 bg-white rounded shadow-xl transform transition-all duration-200 ease-in-out z-[99999]">
          <div className="p-4">
            {/* Header with close button */}
            <div className="flex justify-between items-right mb-4">
              <Dialog.Title className="text-sm font-medium text-gray-900">
                {count} items were added to your cart
              </Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Dialog.Close>
            </div>
            
            {/* Product info */}
            <div className="flex items-center space-x-3 mb-4">
           < div className={`w-16 h-16 flex-shrink-0 ${from === "plp" ? "show": "hidden"}`}>
                <BcImage
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded"
                  src={data?.image?.src}
                  alt={data?.image?.altText}
                />
              </div>
              <div className={`w-16 h-16 flex-shrink-0 ${from === "plp" ? "hidden" :'show'}`}>
                <BcImage
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded"
                  src={data?.defaultImage?.url}
                  alt={data?.defaultImage?.altText}
                />
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-medium text-gray-900 ${from ==="plp" ? "show" : 'hidden'}`}>{data?.title}</h3>
                <h3 className="text-sm font-medium text-gray-900">{data?.name}</h3>
                <p className="mt-1 text-xs text-gray-500">1 × {productPrice}</p>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="space-y-2">
              <CheckoutButton
                action={redirectToCheckout}
                className="w-full bg-amber-600 text-white py-2 px-4 font-medium hover:bg-amber-700 transition-colors uppercase text-center rounded"
              >
                PROCEED TO CHECKOUT
              </CheckoutButton>
              <Link
                href="/cart"
                className="block w-full bg-gray-100 text-center py-2 text-sm text-gray-700 hover:bg-gray-200 rounded uppercase font-medium"
              >
                VIEW CART
              </Link>
              <p className="text-center text-xs text-gray-500 mt-2">
                Auto close in {counterSec}s
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogDemo;