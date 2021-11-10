import { createReduxStore, register } from '@wordpress/data';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const WEB_MONETIZATION_STORE_NAME = 'likecoin/web_monetization';

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
  * postPaymentPointer(pointer) {
    const data = {
      paymentPointer: pointer,
    };
    yield { type: 'POST_TO_DB', data }; // change DB
    yield { type: 'CHANGE_PAYMENT_POINTER_GLOBAL_STATE', data }; // change global state
  },
};

const selectors = {
  selectPaymentPointer: (state) => state.pointer || '',
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
  POST_TO_DB(action) {
    return axios.post(endpoint, JSON.stringify(action.data), {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
      },
    });
  },
};

const resolvers = {
  * selectPaymentPointer() { // need to match corresponding selector names
    try {
      const response = yield actions.getPaymentPointer(endpoint);
      const paymentPointer = response.data.data.site_payment_pointer;
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
    case 'CHANGE_PAYMENT_POINTER_GLOBAL_STATE': {
      return {
        pointer: action.data.paymentPointer,
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
