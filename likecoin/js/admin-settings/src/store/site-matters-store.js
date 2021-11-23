import { createReduxStore, register } from '@wordpress/data';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const SITE_MATTERS_STORE_NAME = 'likecoin/site_matters';

const getAllMattersDataEndpoint = `${window.wpApiSettings.root}likecoin/v1/publish-setting-page`;
const postMattersOptionsEndpoint = `${window.wpApiSettings.root}likecoin/v1/publish-setting-page/publish-options`;
const postMattersUserEndpoint = `${window.wpApiSettings.root}likecoin/v1/publish-setting-page/matters-login`;

const INITIAL_STATE = {
  DBSiteMattersId: '',
  DBSiteMattersToken: '',
  DBSiteMattersAutoSaveDraft: false,
  DBSiteMattersAutoPublish: false,
  DBSiteMattersAddFooterLink: false,
  DBISCNBadgeStyleOption: 'None',
};

const actions = {
  getSiteMattersOptions(path) {
    return {
      type: 'GET_SITE_MATTERS_OPTIONS',
      path,
    };
  },
  setSiteMattersOptions(options) {
    return {
      type: 'SET_SITE_MATTERS_OPTIONS',
      options,
    };
  },
  setHTTPErrors(errorMsg) {
    return {
      type: 'SET_ERROR_MESSAGE',
      errorMsg,
    };
  },
  * postSiteMattersOptions(options) {
    yield { type: 'POST_SITE_MATTERS_OPTIONS_TO_DB', data: options };
    yield { type: 'CHANGE_SITE_MATTERS_OPTIONS_GLOBAL_STATE', data: options };
  },
  * postSiteMattersLogin(user) {
    yield { type: 'POST_SITE_MATTERS_USER_TO_DB', data: user };
    yield { type: 'CHANGE_SITE_MATTERS_USER_GLOBAL_STATE', data: user };
  },
};

const selectors = {
  selectSiteMattersOptions: (state) => state,
};

const controls = {
  GET_SITE_MATTERS_OPTIONS(action) {
    return axios.get(action.path, {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce,
      },
    });
  },
  POST_SITE_MATTERS_OPTIONS_TO_DB(action) {
    return axios.post(postMattersOptionsEndpoint, JSON.stringify(action.data), {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
      },
    });
  },
  POST_SITE_MATTERS_USER_TO_DB(action) {
    return axios.post(postMattersUserEndpoint, JSON.stringify(action.data), {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
      },
    });
  },
};

const resolvers = {
  * selectSiteMattersOptions() {
    try {
      const response = yield actions.getSiteMattersOptions(getAllMattersDataEndpoint);
      const siteMattersOptions = response.data.data;
      const DBMattersId = response.data.data.site_matters_user ? response.data.data.site_matters_user.matters_id : '';
      const DBAccessToken = response.data.data.site_matters_user
        ? response.data.data.site_matters_user.access_token
        : '';
      const DBSiteMattersAutoSaveDraft = !!(
        siteMattersOptions.site_matters_auto_save_draft === '1'
        || siteMattersOptions.site_matters_auto_save_draft === true
      );
      const DBSiteMattersAutoPublish = !!(
        siteMattersOptions.site_matters_auto_publish === '1'
        || siteMattersOptions.site_matters_auto_publish === true
      );
      const DBSiteMattersAddFooterLink = !!(
        siteMattersOptions.site_matters_add_footer_link === '1'
        || siteMattersOptions.site_matters_add_footer_link === true
      );
      siteMattersOptions.matters_id = DBMattersId;
      siteMattersOptions.access_token = DBAccessToken;
      siteMattersOptions.site_matters_auto_save_draft = DBSiteMattersAutoSaveDraft;
      siteMattersOptions.site_matters_auto_publish = DBSiteMattersAutoPublish;
      siteMattersOptions.site_matters_add_footer_link = DBSiteMattersAddFooterLink;
      return actions.setSiteMattersOptions(siteMattersOptions);
    } catch (error) {
      return actions.setHTTPErrors(error.message);
    }
  },
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_SITE_MATTERS_OPTIONS': {
      return {
        DBSiteMattersId: action.options.matters_id,
        DBSiteMattersToken: action.options.access_token,
        DBSiteMattersAutoSaveDraft: action.options.site_matters_auto_save_draft,
        DBSiteMattersAutoPublish: action.options.site_matters_auto_publish,
        DBSiteMattersAddFooterLink: action.options.site_matters_add_footer_link,
        DBISCNBadgeStyleOption: action.options.iscn_badge_style_option,
      };
    }
    case 'CHANGE_SITE_MATTERS_OPTIONS_GLOBAL_STATE': {
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
  SITE_MATTERS_STORE_NAME,
  storeConfig,
);

register(siteMattersStore);
