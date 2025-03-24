
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useFormatter } from 'next-intl';
import { Link } from '~/components/link';
import { BcImage } from '~/components/bc-image';
import { pricesTransformer } from "~/data-transformers/prices-transformer";

interface Props {
  data: any;
  count?: number;
  cartId?: any;
}

const DialogDemo = ({
  open,
  setOpen,
  data,
  count,
  cartId,
  handleModalClose
}: {
  open: boolean,
  setOpen: any,
  data: any,
  count?: any,
  cartId?: any,
  handleModalClose?: any
}) => {
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 z-40" />
        <Dialog.Description></Dialog.Description>
        <Dialog.Content className="fixed top-60 right-4 w-80 bg-white rounded shadow-xl transform transition-all duration-200 ease-in-out z-50">
          <div className="p-3">
            <div className="flex justify-between items-start mb-3">
              <Dialog.Title className="text-sm font-medium text-gray-900">
                {count} items were added to your cart
              </Dialog.Title>
              <Dialog.Close className="absolute top-2 right-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Dialog.Close>
            </div>

            <div className="flex space-x-3">
              <div className="w-16 h-16 flex-shrink-0">
                <BcImage
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded"
                  src={data?.defaultImage?.url}
                  alt={data?.defaultImage?.altText}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-medium text-gray-900">{data?.name}</h3>
                <p className="mt-1 text-xs text-gray-500">1 × {productPrice}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {/*<CheckoutButtonPopUp title="PROCEED TO CHECKOUT" cartId={cartId} />*/}
              <Link
                href="/cart"
                className="block w-full bg-gray-100 text-center py-2 text-sm text-gray-700 hover:bg-gray-200 rounded uppercase font-medium"
              >
                View Cart
              </Link>
              <p className="text-center text-xs text-gray-500">
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


