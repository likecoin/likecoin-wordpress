import { createReduxStore, register } from '@wordpress/data';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const SITE_MATTERS_STORE_NAME = 'likecoin/site_matters';

const endPoint = `${window.wpApiSettings.root}likecoin/v1/publish-setting-page`;

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
  postSiteMattersOptions(options) {
    return {
      type: 'POST_SITE_MATTERS_OPTIONS',
      options,
    };
  },
  postSiteMattersLogin(user) {
    console.log('@store: postSiteMattersLogin user: ', user);
    return {
      type: 'POST_SITE_MATTERS_USER',
      user,
    };
  },
};

const selectors = {
  getSiteMattersOptions: (state) => state,
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
};

const resolvers = {
  * getSiteMattersOptions() {
    try {
      const response = yield actions.getSiteMattersOptions(endPoint);
      const siteMattersOptions = response.data.data;
      console.log('siteMattersOptions: ', siteMattersOptions);
      return actions.setSiteMattersOptions(siteMattersOptions);
    } catch (error) {
      return actions.setHTTPErrors(error.message);
    }
  },
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_SITE_MATTERS_OPTIONS': {
      return {
        ...state,
      };
    }
    case 'SET_SITE_MATTERS_OPTIONS': {
      return {
        DBSiteMattersId: action.options.site_matters_user.matters_id,
        DBSiteMattersToken: action.options.site_matters_user.access_token,
        DBSiteMattersAutoSaveDraft: action.options.site_matters_auto_save_draft,
        DBSiteMattersAutoPublish: action.options.site_matters_auto_publish,
        DBSiteMattersAddFooterLink: action.options.site_matters_add_footer_link,
        DBISCNBadgeStyleOption: action.options.iscn_badge_style_option,
      };
    }
    case 'POST_SITE_MATTERS_OPTIONS': {
      return {
        DBSiteMattersId: state.DBSiteMattersId, // no change
        DBSiteMattersToken: state.DBSiteMattersToken, // no change
        DBSiteMattersAutoSaveDraft: action.options.siteMattersAutoSaveDraft,
        DBSiteMattersAutoPublish: action.options.siteMattersAutoPublish,
        DBSiteMattersAddFooterLink: action.options.siteMattersAddFooterLink,
        DBISCNBadgeStyleOption: action.options.ISCNBadgeStyleOption,
      };
    }
    case 'POST_SITE_MATTERS_USER': {
      return {
        DBSiteMattersId: action.user.mattersId,
        DBSiteMattersToken: action.user.accessToken,
        DBSiteMattersAutoSaveDraft: state.DBSiteMattersAutoSaveDraft, // no change
        DBSiteMattersAutoPublish: state.DBSiteMattersAutoPublish, // no change
        DBSiteMattersAddFooterLink: state.DBSiteMattersAddFooterLink, // no change
        DBISCNBadgeStyleOption: state.DBISCNBadgeStyleOption, // no change
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
