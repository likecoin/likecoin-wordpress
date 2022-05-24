import { createReduxStore, register } from '@wordpress/data';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const SITE_PUBLISH_STORE_NAME = 'likecoin/site_publish';

const mattersLoginEndpoint = `${window.wpApiSettings.root}likecoin/v1/option/publish/settings/matters`;
const getAllMattersDataEndpoint = `${window.wpApiSettings.root}likecoin/v1/option/publish`;
const postMattersOptionsEndpoint = `${window.wpApiSettings.root}likecoin/v1/option/publish`;

const INITIAL_STATE = {
  DBSiteMattersId: '',
  DBSiteMattersToken: '',
  DBSiteMattersAutoSaveDraft: false,
  DBSiteMattersAutoPublish: false,
  DBSiteMattersAddFooterLink: false,
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
  * siteMattersLogin(options) {
    try {
      const response = yield { type: 'MATTERS_LOGIN', data: options };
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  * siteMattersLogout() {
    try {
      const response = yield { type: 'MATTERS_LOGOUT' };
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  * postSitePublishOptions(options) {
    yield { type: 'POST_SITE_PUBLISH_OPTIONS_TO_DB', data: options };
    yield { type: 'CHANGE_SITE_PUBLISH_OPTIONS_GLOBAL_STATE', data: options };
  },
  * updateSiteMattersLoginGlobalState(user) {
    yield { type: 'CHANGE_SITE_MATTERS_USER_GLOBAL_STATE', data: user };
  },
};

const selectors = {
  selectSitePublishOptions: (state) => state,
};

const controls = {
  GET_SITE_PUBLISH_OPTIONS(action) {
    return axios.get(action.path, {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce,
      },
    });
  },
  MATTERS_LOGIN(action) {
    return axios.post(mattersLoginEndpoint, JSON.stringify(action.data), {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce,
      },
    });
  },
  POST_SITE_PUBLISH_OPTIONS_TO_DB(action) {
    return axios.post(postMattersOptionsEndpoint, JSON.stringify(action.data), {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
      },
    });
  },
  MATTERS_LOGOUT() {
    return axios.delete(mattersLoginEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce,
      },
    });
  },
};

const resolvers = {
  * selectSitePublishOptions() {
    try {
      const response = yield actions.getSitePublishOptions(getAllMattersDataEndpoint);
      const sitePublishOptions = response.data.data;
      const DBMattersId = response.data.data.site_matters_user ? response.data.data.site_matters_user.matters_id : '';
      const DBAccessToken = response.data.data.site_matters_user
        ? response.data.data.site_matters_user.access_token
        : '';
      const DBSiteMattersAutoSaveDraft = !!(
        sitePublishOptions.site_matters_auto_save_draft === '1'
        || sitePublishOptions.site_matters_auto_save_draft === true
      );
      const DBSiteMattersAutoPublish = !!(
        sitePublishOptions.site_matters_auto_publish === '1'
        || sitePublishOptions.site_matters_auto_publish === true
      );
      const DBSiteMattersAddFooterLink = !!(
        sitePublishOptions.site_matters_add_footer_link === '1'
        || sitePublishOptions.site_matters_add_footer_link === true
      );
      sitePublishOptions.matters_id = DBMattersId;
      sitePublishOptions.access_token = DBAccessToken;
      sitePublishOptions.site_matters_auto_save_draft = DBSiteMattersAutoSaveDraft;
      sitePublishOptions.site_matters_auto_publish = DBSiteMattersAutoPublish;
      sitePublishOptions.site_matters_add_footer_link = DBSiteMattersAddFooterLink;
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
        DBSiteMattersId: action.options.matters_id,
        DBSiteMattersToken: action.options.access_token,
        DBSiteMattersAutoSaveDraft: action.options.site_matters_auto_save_draft,
        DBSiteMattersAutoPublish: action.options.site_matters_auto_publish,
        DBSiteMattersAddFooterLink: action.options.site_matters_add_footer_link,
        DBISCNBadgeStyleOption: action.options.iscn_badge_style_option,
      };
    }
    case 'CHANGE_SITE_PUBLISH_OPTIONS_GLOBAL_STATE': {
      return {
        ...state,
        DBSiteMattersAutoSaveDraft: action.data.siteMattersAutoSaveDraft,
        DBSiteMattersAutoPublish: action.data.siteMattersAutoPublish,
        DBSiteMattersAddFooterLink: action.data.siteMattersAddFooterLink,
        DBISCNBadgeStyleOption: action.data.ISCNBadgeStyleOption,
      };
    }
    case 'CHANGE_SITE_MATTERS_USER_GLOBAL_STATE': {
      return {
        ...state,
        DBSiteMattersId: action.data.mattersId,
        DBSiteMattersToken: action.data.accessToken,
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

const siteMattersStore = createReduxStore(
  SITE_PUBLISH_STORE_NAME,
  storeConfig,
);

register(siteMattersStore);
