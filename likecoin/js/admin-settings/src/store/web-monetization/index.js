import { createReduxStore, register } from '@wordpress/data';
// import apiFetch from '@wordpress/api-fetch';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const WEB_MONETIZATION_STORE_NAME = 'likecoin/web_monetization2';

const INITIAL_STATE = { // or called DEFAULT_STATE
  paymentPointer: '',
};
const actions = {
  setPaymentPointer(pointer) {
    return {
      type: 'SET_PAYMENT_POINTER',
      pointer, // 不用叫 payload: pointer
    };
  },
  getPaymentPointer(path) {
    return {
      type: 'GET_PAYMENT_POINTER',
      path,
    };
  },
};

const selectors = {
  getPaymentPointer: (state) => state.pointer || '',
};

const controls = {
  GET_PAYMENT_POINTER(action) {
    // 即是 getPaymentPointer 的 type name.
    // return apiFetch({ path: action.path });
    return axios.get(
      action.path,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
        },
      },
    );
  },
};

const resolvers = {
  * getPaymentPointer() { // 必須與相對應的 selector 名字一樣
    const response = yield actions.getPaymentPointer(`${window.wpApiSettings.root}likecoin/v1/web-monetization-page`);
    const paymentPointer = response.data.data.site_payment_pointer;
    console.log('at store paymentPointer: ', paymentPointer);
    return actions.setPaymentPointer(paymentPointer);
  },
};

const storeConfig = {
  reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'SET_PAYMENT_POINTER': {
        return {
          ...state,
          pointer: action.pointer,
        };
      }
      case 'GET_PAYMENT_POINTER': {
        return {
          ...state,
        };
      }
      default: {
        return state;
      }
    }
  },
  controls,
  selectors,
  resolvers,
  actions,
};

// eslint-disable-next-line import/prefer-default-export
const webMonetizationStore = createReduxStore(
  WEB_MONETIZATION_STORE_NAME, // store name. 也用於 select() e.g. select(<storeName>)
  storeConfig,
);

register(webMonetizationStore); // webMonetizationStore ===store definition object === WPDataStore
