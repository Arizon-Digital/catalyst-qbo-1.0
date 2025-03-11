"use client";
import React, { useEffect, useState } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { deleteIconTemp, RemoveItem } from './remove-item';

interface DialogDemosProps {
  currency: string;
  product: {
    entityId: string;
    name: string;
  };
  deleteIcon:string
}

const DialogDemos = ({ currency, product,deleteIcon }: DialogDemosProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDeleteCart = async (product: any) => {
    try {
      setIsDeleting(true);
      deleteIconTemp(product,currency);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="p-2" disabled={isDeleting} >
          <Trash2 className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-md">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <AlertCircle className="w-20 h-20 text-red-600" strokeWidth={1.5} />
            </div>
            <Dialog.Description className="text-lg mb-8">
              Are you sure you want to delete this item?
            </Dialog.Description>
            
            <div className="flex gap-4 justify-center w-full">
              <Dialog.Close asChild>
                <button 
                  className="px-8 py-2 rounded-md bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 font-medium"
                  disabled={isDeleting}
                >
                  CANCEL
                </button>
              </Dialog.Close>
              <button 
                className="px-8 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-medium"
                onClick={() => handleDeleteCart(product)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'OK'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogDemos;