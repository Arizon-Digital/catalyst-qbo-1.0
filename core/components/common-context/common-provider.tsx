'use client';

import { createContext, ReactNode, useContext, useReducer } from 'react';

interface CommonContext {
  open: any;
  getCurrencyCode: any;
  getCartId: any;
  openSortby: any;
  handlePopup: (data?: any) => void;
  setCurrencyCodeFn: (data?: any) => void;
  setCartIdFn: (data?: any) => void;
  handleSortby: (data?: any)=> void;
}

const CommonContext = createContext<CommonContext | undefined>({
  open: false,
  getCurrencyCode: 'CAD',
  getCartId: '',
  openSortby: false,
  handlePopup: () => { },
  setCurrencyCodeFn: () => { },
  setCartIdFn: () => { },
  handleSortby: ()=> { }
});

function CommonReducer(state: any, action: any) {
  if(action.type === 'DISPLAY_POPUP') {
    return {
      items: {
        open: action.payload,
        currencyCode: state.items.currencyCode,
        cartId: state.items.cartId,
        openSortby: state.items.openSortby
      },
    };
  } else if(action.type === 'CURRENCY_CODE') {
    return {
      items: {
        open: state.items.open,
        currencyCode: action.payload,
        cartId: state.items.cartId,
        openSortby: state.items.openSortby
      },
    };
  } else if(action.type === 'CART_ID') {
    return {
      items: {
        open: state.items.open,
        currencyCode:  state.items.currencyCode,
        cartId: action.payload,
        openSortby: state.items.openSortby
      },
    };
  } else if(action.type === 'DISPLAY_SORTBY') {
    return {
      items: {
        open: state.items.open,
        currencyCode: state.items.currencyCode,
        cartId: state.items.cartId,
        openSortby: action.payload
      },
    };
  }
  return state;
}

export const CommonProvider = ({ children }: { children: ReactNode }) => {
  const [commonState, commonDispatch] = useReducer(CommonReducer, {
    items: {
      open: false,
      currencyCode: 'CAD',
      cartId: '',
      openSortby: false
    }
  });

  const handlePopup = (open: any) => {
    commonDispatch({
      type: 'DISPLAY_POPUP',
      payload: open
    });
  }

  const handleSortby = (open: any) => {
    commonDispatch({
      type: 'DISPLAY_SORTBY',
      payload: open
    });
  }

  const setCurrencyCodeFn = (items: any) => {
    commonDispatch({
      type: 'CURRENCY_CODE',
      payload: items
    });
  }

  const setCartIdFn = (items: any) => {
    commonDispatch({
      type: 'CART_ID',
      payload: items
    });
  }

  const value = {
    open: commonState?.items?.open,
    getCurrencyCode: commonState?.items?.currencyCode,
    getCartId: commonState?.items?.cartId,
    openSortby: commonState?.items?.openSortby,
    handlePopup,
    setCurrencyCodeFn,
    setCartIdFn,
    handleSortby
  };

  return <CommonContext.Provider value={value}>{children}</CommonContext.Provider>;
};

export const useCommonContext = () => {
  const context = useContext(CommonContext);

  if (context === undefined) {
    throw new Error('useCommonContext must be used within a CommonContext');
  }

  return context;
};
