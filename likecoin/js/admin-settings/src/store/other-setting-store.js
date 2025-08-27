import apiFetch from '@wordpress/api-fetch';
import {
  createAndRegisterReduxStore, ACTION_TYPES, API_ENDPOINTS, STORE_NAMES, createReducer,
} from './index';

// eslint-disable-next-line import/prefer-default-export
export const OTHER_SETTING_STORE_NAME = STORE_NAMES.OTHER_SETTINGS;

const webMonetizationEndpoint = API_ENDPOINTS.WEB_MONETIZATION;
const INITIAL_STATE = {
  DBPaymentPointer: '',
};
const actions = {
  setPaymentPointer(paymentPointer) {
    return {
      type: ACTION_TYPES.OTHER_SETTINGS.SET_PAYMENT_POINTER,
      paymentPointer,
    };
  },
  getPaymentPointer() {
    return {
      type: ACTION_TYPES.OTHER_SETTINGS.GET_PAYMENT_POINTER,
    };
  },
  setHTTPErrors(errorMsg) {
    return {
      type: ACTION_TYPES.COMMON.SET_ERROR_MESSAGE,
      errorMsg,
    };
  },
  * postPaymentPointer(paymentPointer) {
    yield { type: ACTION_TYPES.OTHER_SETTINGS.POST_PAYMENT_POINTER, paymentPointer };
    yield { type: ACTION_TYPES.OTHER_SETTINGS.CHANGE_PAYMENT_POINTER_GLOBAL_STATE, paymentPointer };
  },
};

const selectors = {
  selectPaymentPointer: (state) => state.DBPaymentPointer,
};

const controls = {
  [ACTION_TYPES.OTHER_SETTINGS.GET_PAYMENT_POINTER]() {
    return apiFetch({ path: webMonetizationEndpoint });
  },
  [ACTION_TYPES.OTHER_SETTINGS.POST_PAYMENT_POINTER](action) {
    return apiFetch({
      method: 'POST',
      path: webMonetizationEndpoint,
      data: { paymentPointer: action.paymentPointer },
    });
  },
};

const resolvers = {
  * selectPaymentPointer() { // need to match corresponding selector names
    try {
      const response = yield actions.getPaymentPointer();
      const paymentPointer = response.data.site_payment_pointer;
      return actions.setPaymentPointer(paymentPointer);
    } catch (error) {
      return actions.setHTTPErrors(error.message); // need a return value even for errors from lint.
    }
  },
};
const reducer = createReducer({
  [ACTION_TYPES.OTHER_SETTINGS.SET_PAYMENT_POINTER]: (state, action) => ({
    DBPaymentPointer: action.paymentPointer,
  }),
  [ACTION_TYPES.OTHER_SETTINGS.CHANGE_PAYMENT_POINTER_GLOBAL_STATE]: (state, action) => ({
    DBPaymentPointer: action.paymentPointer,
  }),
}, INITIAL_STATE);
const storeConfig = {
  reducer,
  controls,
  selectors,
  resolvers,
  actions,
};

createAndRegisterReduxStore(OTHER_SETTING_STORE_NAME, storeConfig);
