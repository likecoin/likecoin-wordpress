import { createReduxStore, register } from '@wordpress/data';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const WEB_MONETIZATION_STORE_NAME = 'likecoin/web_monetization2';

const endpoint = `${window.wpApiSettings.root}likecoin/v1/web-monetization-page`;
const INITIAL_STATE = {
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
  setHTTPErrors(errorMsg) {
    return {
      type: 'SET_ERROR_MESSAGE',
      errorMsg,
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
  GET_PAYMENT_POINTER(action) {
    return axios.get(action.path, {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce,
      },
    });
  },
};

const resolvers = {
  * getPaymentPointer() {
    try {
      const response = yield actions.getPaymentPointer(endpoint);
      const paymentPointer = response.data.data.site_payment_pointer;
      console.log('at GET store paymentPointer: ', paymentPointer);
      return actions.setPaymentPointer(paymentPointer);
    } catch (error) {
      return actions.setHTTPErrors(error.message); // need a return value even for errors from lint.
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
        pointer: action.pointer,
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
  WEB_MONETIZATION_STORE_NAME,
  storeConfig,
);

register(webMonetizationStore);
