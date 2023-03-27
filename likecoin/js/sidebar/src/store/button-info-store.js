import apiFetch from '@wordpress/api-fetch';
import { createAndRegisterReduxStore } from './util';

const {
  postId,
} = window.wpApiSettings;

// eslint-disable-next-line import/prefer-default-export
export const BUTTON_INFO_STORE_NAME = 'likecoin/button_info_store';

const getButtonSettingsEndpoint = `/likecoin/v1/posts/${postId}/button/settings`;
const postButtonSettingsEndpoint = `/likecoin/v1/posts/${postId}/button/settings`;

const INITIAL_STATE = {
  isWidgetEnabled: false,
  isOptionDisabled: true,
  isLikerIdMissing: false,
};
const actions = {
  getButtonSettings() {
    return {
      type: 'GET_BUTTON_SETTINGS',
    };
  },
  setButtonSettings(data) {
    return {
      type: 'SET_BUTTON_SETTINGS',
      data,
    };
  },
  * fetchButtonSettings() {
    const res = yield { type: 'GET_BUTTON_SETTINGS' };
    if (!res) {
      throw new Error('FETCH_BUTTON_SETTINGS_ERROR');
    }
    return res;
  },
  * postButtonSettings(data) {
    const res = yield { type: 'POST_BUTTON_SETTINGS', data };
    if (!res) {
      throw new Error('FAIL_TO_POST_BUTTON_SETTINGS');
    }
  },
};

const selectors = {
  getButtonSettings: (state) => state,
};

const controls = {
  GET_BUTTON_SETTINGS() {
    return apiFetch({
      path: getButtonSettingsEndpoint,
    });
  },
  POST_BUTTON_SETTINGS(action) {
    return apiFetch({
      method: 'POST',
      path: postButtonSettingsEndpoint,
      data: {
        is_widget_enabled: action.data.isEnabled ? 'bottom' : 'none',
      },
    });
  },
};

const resolvers = {
  * getButtonSettings() {
    const response = yield actions.getButtonSettings();
    const {
      is_widget_enabled: isWidgetEnabled,
      is_disabled: isOptionDisabled,
      show_no_id_error: isLikerIdMissing,
    } = response;
    return actions.setButtonSettings({
      isWidgetEnabled,
      isOptionDisabled,
      isLikerIdMissing,
    });
  },
};
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_BUTTON_SETTINGS': {
      const {
        isWidgetEnabled,
        isOptionDisabled,
        isLikerIdMissing,
      } = action.data;
      return {
        ...state,
        isWidgetEnabled,
        isOptionDisabled,
        isLikerIdMissing,
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

createAndRegisterReduxStore(BUTTON_INFO_STORE_NAME, storeConfig);
