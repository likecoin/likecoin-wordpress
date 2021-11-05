import { createReduxStore, register } from '@wordpress/data';
// import apiFetch from '@wordpress/api-fetch';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const WEB_MONETIZATION_STORE_NAME = 'likecoin/web_monetization2';

const endpoint = `${window.wpApiSettings.root}likecoin/v1/web-monetization-page`;
const INITIAL_STATE = { // or called DEFAULT_STATE
  paymentPointer: '',
};
const actions = {
  setPaymentPointer(pointer) {
    return {
      type: 'SET_PAYMENT_POINTER',
      pointer,
    };
  },
  getPaymentPointer(path) {
    return {
      type: 'GET_PAYMENT_POINTER',
      path,
    };
  },
  postPaymentPointer(pointer) {
    return {
      type: 'POST_PAYMENT_POINTER',
      pointer,
    };
  },
};

const selectors = {
  getPaymentPointer: (state) => state.pointer || '',
};

const controls = {
  GET_PAYMENT_POINTER(action) { // 必須與相對應的 action 裡的 type 名字一樣
    return axios.get(action.path, {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
      },
    });
  },
};

const resolvers = {
  * getPaymentPointer() { // 必須與相對應的 selector 名字一樣
    try {
      const response = yield actions.getPaymentPointer(endpoint);
      const paymentPointer = response.data.data.site_payment_pointer;
      console.log('at GET store paymentPointer: ', paymentPointer);
      return actions.setPaymentPointer(paymentPointer);
    } catch (error) {
      console.log(error);
    }
  },
};
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_PAYMENT_POINTER': {
      return {
        pointer: action.pointer,
      };
    }
    case 'GET_PAYMENT_POINTER': {
      return {
        ...state,
      };
    }
    case 'POST_PAYMENT_POINTER': {
      return {
        pointer: action.pointer, // 要加這行才真的改變了 app-wise context
      };
    }
    default: {
      return state;
    }
  }
};
const storeConfig = {
  reducer,
  controls,
  selectors,
  resolvers,
  actions,
};

const webMonetizationStore = createReduxStore(
  WEB_MONETIZATION_STORE_NAME, // store name. 也用於 select() e.g. select(<storeName>)
  storeConfig,
);

register(webMonetizationStore); // webMonetizationStore ===store definition object === WPDataStore
