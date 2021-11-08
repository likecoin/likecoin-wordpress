import { createReduxStore, register } from '@wordpress/data';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const SITE_LIKER_INFO_STORE_NAME = 'likecoin/site_liker_info';

const endPoint = `${window.wpApiSettings.root}likecoin/v1/main-setting-page`;

const INITIAL_STATE = {
  DBSiteLikerId: '',
  DBSiteLikerAvatar: '',
  DBSiteLikerDisplayName: '',
  DBSiteLikerWallet: '',
  DBSiteLikerIdEnabled: false,
  DBDisplayOptionSelected: 'None',
  DBPerPostOptionEnabled: false,
};

const actions = {
  getSiteLikerInfo(path) {
    return {
      type: 'GET_SITE_LIKER_INFO',
      path,
    };
  },
  setSiteLikerInfo(info) {
    return {
      type: 'SET_SITE_LIKER_INFO',
      info,
    };
  },
  setHTTPErrors(errorMsg) {
    return {
      type: 'SET_ERROR_MESSAGE',
      errorMsg,
    };
  },
  postSiteLikerInfo(info) {
    return {
      type: 'POST_SITE_LIKER_INFO',
      info,
    };
  },
};

const selectors = {
  getSiteLikerInfo: (state) => state,
};

const controls = {
  GET_SITE_LIKER_INFO(action) {
    return axios.get(action.path, {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce,
      },
    });
  },
};

const resolvers = {
  * getSiteLikerInfo() {
    try {
      const response = yield actions.getSiteLikerInfo(endPoint);
      const siteLikersInfo = response.data.data;
      const DBSiteLikerIdEnabled = !!(
        siteLikersInfo.site_likecoin_id_enbled === '1'
        || siteLikersInfo.site_likecoin_id_enbled === true
      );
      const DBPerPostOptionEnabled = !!(
        siteLikersInfo.button_display_author_override === '1'
        || siteLikersInfo.button_display_author_override === true
      );
      siteLikersInfo.site_likecoin_id_enbled = DBSiteLikerIdEnabled;
      siteLikersInfo.button_display_author_override = DBPerPostOptionEnabled;
      return actions.setSiteLikerInfo(siteLikersInfo);
    } catch (error) {
      return actions.setHTTPErrors(error.message);
    }
  },
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_SITE_LIKER_INFO': {
      return {
        ...state,
      };
    }
    case 'SET_SITE_LIKER_INFO': {
      return {
        DBSiteLikerId: action.info.site_likecoin_user.likecoin_id,
        DBSiteLikerAvatar: action.info.site_likecoin_user.avatar,
        DBSiteLikerDisplayName: action.info.site_likecoin_user.display_name,
        DBSiteLikerWallet: action.info.site_likecoin_user.wallet,
        DBSiteLikerIdEnabled: action.info.site_likecoin_id_enbled,
        DBDisplayOptionSelected: action.info.button_display_option,
        DBPerPostOptionEnabled: action.info.button_display_author_override,
      };
    }
    case 'POST_SITE_LIKER_INFO': {
      return {
        DBSiteLikerId: action.info.siteLikerInfos.likecoin_id,
        DBSiteLikerAvatar: action.info.siteLikerInfos.avatar,
        DBSiteLikerDisplayName: action.info.siteLikerInfos.display_name,
        DBSiteLikerWallet: action.info.siteLikerInfos.wallet,
        DBSiteLikerIdEnabled: action.info.siteLikerIdEnabled,
        DBDisplayOptionSelected: action.info.displayOption,
        DBPerPostOptionEnabled: action.info.perPostOptionEnabled,
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

const siteLikerInfoStore = createReduxStore(
  SITE_LIKER_INFO_STORE_NAME,
  storeConfig,
);

register(siteLikerInfoStore);
