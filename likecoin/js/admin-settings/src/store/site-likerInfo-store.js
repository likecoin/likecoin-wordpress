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
  DBDisplayOptionSelected: 'none',
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
  * postSiteLikerInfo(info) {
    yield { type: 'POST_SITE_LIKER_INFO_TO_DB', data: info };
    yield { type: 'CHANGE_SITE_LIKER_INFO_GLOBAL_STATE', data: info };
  },
};

const selectors = {
  selectSiteLikerInfo: (state) => state,
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
  POST_SITE_LIKER_INFO_TO_DB(action) {
    return axios.post(endPoint, JSON.stringify(action.data), {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce,
      },
    });
  },
};

const resolvers = {
  * selectSiteLikerInfo() {
    try {
      const response = yield actions.getSiteLikerInfo(endPoint);
      const siteLikerInfo = response.data.data;
      const DBSiteLikerIdEnabled = !!(
        siteLikerInfo.site_likecoin_id_enbled === '1'
        || siteLikerInfo.site_likecoin_id_enbled === true
      );
      const DBPerPostOptionEnabled = !!(
        siteLikerInfo.button_display_author_override === '1'
        || siteLikerInfo.button_display_author_override === true
      );
      siteLikerInfo.site_likecoin_id_enbled = DBSiteLikerIdEnabled;
      siteLikerInfo.button_display_author_override = DBPerPostOptionEnabled;
      if (!siteLikerInfo.button_display_option) {
        siteLikerInfo.button_display_option = INITIAL_STATE.DBDisplayOptionSelected;
      }
      return actions.setSiteLikerInfo(siteLikerInfo);
    } catch (error) {
      return actions.setHTTPErrors(error.message);
    }
  },
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
    case 'CHANGE_SITE_LIKER_INFO_GLOBAL_STATE': {
      return {
        DBSiteLikerId: action.data.siteLikerInfos.likecoin_id,
        DBSiteLikerAvatar: action.data.siteLikerInfos.avatar,
        DBSiteLikerDisplayName: action.data.siteLikerInfos.display_name,
        DBSiteLikerWallet: action.data.siteLikerInfos.wallet,
        DBSiteLikerIdEnabled: action.data.siteLikerIdEnabled,
        DBDisplayOptionSelected: action.data.displayOption,
        DBPerPostOptionEnabled: action.data.perPostOptionEnabled,
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
