import axios from 'axios';
import { createAndRegisterReduxStore } from './util';

// eslint-disable-next-line import/prefer-default-export
export const OTHER_SETTING_STORE_NAME = 'likecoin/other_settings';

const webMonetizationEndpoint = `${window.wpApiSettings.root}likecoin/v1/option/web-monetization`;
const INITIAL_STATE = {
  DBPaymentPointer: '',
};
const actions = {
  setPaymentPointer(paymentPointer) {
    return {
      type: 'SET_PAYMENT_POINTER',
      paymentPointer,
    };
  },
  getPaymentPointer() {
    return {
      type: 'GET_PAYMENT_POINTER',
    };
  },
  setHTTPErrors(errorMsg) {
    return {
      type: 'SET_ERROR_MESSAGE',
      errorMsg,
    };
  },
  * postPaymentPointer(paymentPointer) {
    yield { type: 'POST_PAYMENT_POINTER', paymentPointer }; // change DB
    yield { type: 'CHANGE_PAYMENT_POINTER_GLOBAL_STATE', paymentPointer }; // change global state
  },
};

const selectors = {
  selectPaymentPointer: (state) => state.DBPaymentPointer,
};

const controls = {
  GET_PAYMENT_POINTER() {
    return axios.get(webMonetizationEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce,
      },
    });
  },
  POST_PAYMENT_POINTER(action) {
    return axios.post(
      webMonetizationEndpoint,
      JSON.stringify({ paymentPointer: action.paymentPointer }),
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
  * selectPaymentPointer() { // need to match corresponding selector names
    try {
      const response = yield actions.getPaymentPointer();
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
        DBPaymentPointer: action.paymentPointer,
      };
    }
    case 'CHANGE_PAYMENT_POINTER_GLOBAL_STATE': {
      return {
        DBPaymentPointer: action.paymentPointer,
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

createAndRegisterReduxStore(OTHER_SETTING_STORE_NAME, storeConfig);
