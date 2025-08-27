import apiFetch from '@wordpress/api-fetch';
import {
  createAndRegisterReduxStore, ACTION_TYPES, API_ENDPOINTS, STORE_NAMES, createReducer,
} from './index';

const {
  postId,
} = window.likecoinApiSettings;

// eslint-disable-next-line import/prefer-default-export
export const BUTTON_INFO_STORE_NAME = STORE_NAMES.BUTTON_INFO;

const getButtonSettingsEndpoint = API_ENDPOINTS.BUTTON_SETTINGS(postId);
const postButtonSettingsEndpoint = API_ENDPOINTS.BUTTON_SETTINGS(postId);

const INITIAL_STATE = {
  isWidgetEnabled: false,
  isOptionDisabled: true,
  isLikerIdMissing: false,
};
const actions = {
  getButtonSettings() {
    return {
      type: ACTION_TYPES.BUTTON_INFO.GET_SETTINGS,
    };
  },
  setButtonSettings(data) {
    return {
      type: ACTION_TYPES.BUTTON_INFO.SET_SETTINGS,
      data,
    };
  },
  * fetchButtonSettings() {
    const res = yield { type: ACTION_TYPES.BUTTON_INFO.GET_SETTINGS };
    if (!res) {
      throw new Error('FETCH_BUTTON_SETTINGS_ERROR');
    }
    return res;
  },
  * postButtonSettings(data) {
    const res = yield { type: ACTION_TYPES.BUTTON_INFO.POST_SETTINGS, data };
    if (!res) {
      throw new Error('FAIL_TO_POST_BUTTON_SETTINGS');
    }
  },
};

const selectors = {
  getButtonSettings: (state) => state,
};

const controls = {
  [ACTION_TYPES.BUTTON_INFO.GET_SETTINGS]() {
    return apiFetch({
      path: getButtonSettingsEndpoint,
    });
  },
  [ACTION_TYPES.BUTTON_INFO.POST_SETTINGS](action) {
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
const reducer = createReducer({
  [ACTION_TYPES.BUTTON_INFO.SET_SETTINGS]: (state, action) => {
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
  },
}, INITIAL_STATE);

const storeConfig = {
  reducer,
  controls,
  selectors,
  resolvers,
  actions,
};

createAndRegisterReduxStore(BUTTON_INFO_STORE_NAME, storeConfig);
