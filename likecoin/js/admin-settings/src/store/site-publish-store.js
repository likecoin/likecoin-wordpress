import apiFetch from '@wordpress/api-fetch';
import { createAndRegisterReduxStore } from './util';

// eslint-disable-next-line import/prefer-default-export
export const SITE_PUBLISH_STORE_NAME = 'likecoin/site_publish';

const getPublishOptionEndpoint = '/likecoin/v1/option/publish';
const postPublishOptionsEndpoint = '/likecoin/v1/option/publish';

const INITIAL_STATE = {
  DBSiteInternetArchiveEnabled: false,
  DBSiteInternetArchiveAccessKey: '',
  DBISCNBadgeStyleOption: 'none',
};

const actions = {
  getSitePublishOptions(path) {
    return {
      type: 'GET_SITE_PUBLISH_OPTIONS',
      path,
    };
  },
  setSitePublishOptions(options) {
    return {
      type: 'SET_SITE_PUBLISH_OPTIONS',
      options,
    };
  },
  setHTTPErrors(errorMsg) {
    return {
      type: 'SET_ERROR_MESSAGE',
      errorMsg,
    };
  },
  * postSitePublishOptions(options) {
    yield { type: 'POST_SITE_PUBLISH_OPTIONS_TO_DB', data: options };
    yield { type: 'CHANGE_SITE_PUBLISH_OPTIONS_GLOBAL_STATE', data: options };
  },
};

const selectors = {
  selectSitePublishOptions: (state) => state,
};

const controls = {
  GET_SITE_PUBLISH_OPTIONS(action) {
    return apiFetch({ path: action.path });
  },
  POST_SITE_PUBLISH_OPTIONS_TO_DB(action) {
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

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_SITE_PUBLISH_OPTIONS': {
      return {
        DBSiteInternetArchiveEnabled: action.options.lc_internet_archive_enabled,
        DBSiteInternetArchiveAccessKey: action.options.lc_internet_archive_access_key,
        DBISCNBadgeStyleOption: action.options.iscn_badge_style_option,
      };
    }
    case 'CHANGE_SITE_PUBLISH_OPTIONS_GLOBAL_STATE': {
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

createAndRegisterReduxStore(SITE_PUBLISH_STORE_NAME, storeConfig);
