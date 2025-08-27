import apiFetch from '@wordpress/api-fetch';
import {
  createAndRegisterReduxStore, ACTION_TYPES, API_ENDPOINTS, STORE_NAMES, createReducer,
} from './index';

// eslint-disable-next-line import/prefer-default-export
export const SITE_PUBLISH_STORE_NAME = STORE_NAMES.SITE_PUBLISH;

const getPublishOptionEndpoint = API_ENDPOINTS.SITE_PUBLISH;
const postPublishOptionsEndpoint = API_ENDPOINTS.SITE_PUBLISH;

const INITIAL_STATE = {
  DBSiteInternetArchiveEnabled: false,
  DBSiteInternetArchiveAccessKey: '',
  DBISCNBadgeStyleOption: 'none',
};

const actions = {
  getSitePublishOptions(path) {
    return {
      type: ACTION_TYPES.SITE_PUBLISH.GET_OPTIONS,
      path,
    };
  },
  setSitePublishOptions(options) {
    return {
      type: ACTION_TYPES.SITE_PUBLISH.SET_OPTIONS,
      options,
    };
  },
  setHTTPErrors(errorMsg) {
    return {
      type: ACTION_TYPES.COMMON.SET_ERROR_MESSAGE,
      errorMsg,
    };
  },
  * postSitePublishOptions(options) {
    yield { type: ACTION_TYPES.SITE_PUBLISH.POST_OPTIONS_TO_DB, data: options };
    yield { type: ACTION_TYPES.SITE_PUBLISH.CHANGE_GLOBAL_STATE, data: options };
  },
};

const selectors = {
  selectSitePublishOptions: (state) => state,
};

const controls = {
  [ACTION_TYPES.SITE_PUBLISH.GET_OPTIONS](action) {
    return apiFetch({ path: action.path });
  },
  [ACTION_TYPES.SITE_PUBLISH.POST_OPTIONS_TO_DB](action) {
    return apiFetch({
      method: 'POST',
      path: postPublishOptionsEndpoint,
      data: action.data,
    });
  },
};

const resolvers = {
  * selectSitePublishOptions() {
    try {
      const response = yield actions.getSitePublishOptions(getPublishOptionEndpoint);
      const sitePublishOptions = response.data;
      if (!sitePublishOptions.iscn_badge_style_option) {
        sitePublishOptions.iscn_badge_style_option = INITIAL_STATE.DBISCNBadgeStyleOption;
      }
      return actions.setSitePublishOptions(sitePublishOptions);
    } catch (error) {
      return actions.setHTTPErrors(error.message);
    }
  },
};

const reducer = createReducer({
  [ACTION_TYPES.SITE_PUBLISH.SET_OPTIONS]: (state, action) => ({
    DBSiteInternetArchiveEnabled: action.options.lc_internet_archive_enabled,
    DBSiteInternetArchiveAccessKey: action.options.lc_internet_archive_access_key,
    DBISCNBadgeStyleOption: action.options.iscn_badge_style_option,
  }),
  [ACTION_TYPES.SITE_PUBLISH.CHANGE_GLOBAL_STATE]: (state, action) => {
    // HACK: remove all undefined data to prevent unneeded overwrite
    const updateObject = JSON.parse(JSON.stringify({
      DBSiteInternetArchiveEnabled: action.data.siteInternetArchiveEnabled,
      DBSiteInternetArchiveAccessKey: action.data.siteInternetArchiveAccessKey,
      DBISCNBadgeStyleOption: action.data.ISCNBadgeStyleOption,
    }));
    return {
      ...state,
      ...updateObject,
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

createAndRegisterReduxStore(SITE_PUBLISH_STORE_NAME, storeConfig);
