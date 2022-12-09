import apiFetch from '@wordpress/api-fetch';
import { createAndRegisterReduxStore } from './util';

// eslint-disable-next-line import/prefer-default-export
export const SITE_LIKER_INFO_STORE_NAME = 'likecoin/site_liker_info';

const buttonEndPoint = '/likecoin/v1/options/button';

const INITIAL_STATE = {
  DBUserCanEditOption: true,
  DBErrorMessage: '',
  DBSiteLikerId: '',
  DBSiteLikerAvatar: '',
  DBSiteLikerDisplayName: '',
  DBSiteLikerWallet: '',
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
  setHTTPError(error) {
    const errorMsg = error.response.data || error.message;
    if (error.response.status === 403) {
      return {
        type: 'SET_FORBIDDEN_ERROR',
        errorMsg,
      };
    }
    return {
      type: 'SET_ERROR_MESSAGE',
      errorMsg,
    };
  },
  * postSiteLikerInfo(info) {
    yield { type: 'POST_SITE_LIKER_INFO_TO_DB', data: info };
    if (info.siteLikerInfos) {
      yield { type: 'CHANGE_SITE_LIKER_INFO_GLOBAL_STATE', data: info };
    }
  },
};

const selectors = {
  selectSiteLikerInfo: (state) => state,
};

const controls = {
  GET_SITE_LIKER_INFO() {
    return apiFetch({ path: buttonEndPoint });
  },
  POST_SITE_LIKER_INFO_TO_DB(action) {
    return apiFetch({
      method: 'POST',
      path: buttonEndPoint,
      data: action.data,
    });
  },
};

const resolvers = {
  * selectSiteLikerInfo() {
    try {
      const response = yield actions.getSiteLikerInfo();
      const siteLikerInfo = response.data;
      const DBPerPostOptionEnabled = !!(
        siteLikerInfo.button_display_author_override === '1'
        || siteLikerInfo.button_display_author_override === true
      );
      siteLikerInfo.button_display_author_override = DBPerPostOptionEnabled;
      if (!siteLikerInfo.button_display_option) {
        siteLikerInfo.button_display_option = INITIAL_STATE.DBDisplayOptionSelected;
      }
      if (!siteLikerInfo.site_likecoin_user) siteLikerInfo.site_likecoin_user = {};
      return actions.setSiteLikerInfo(siteLikerInfo);
    } catch (error) {
      return actions.setHTTPError(error);
    }
  },
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_SITE_LIKER_INFO': {
      return {
        ...state,
        DBSiteLikerId: action.info.site_likecoin_user.likecoin_id,
        DBSiteLikerAvatar: action.info.site_likecoin_user.avatar,
        DBSiteLikerDisplayName: action.info.site_likecoin_user.display_name,
        DBSiteLikerWallet: action.info.site_likecoin_user.wallet,
        DBDisplayOptionSelected: action.info.button_display_option,
        DBPerPostOptionEnabled: action.info.button_display_author_override,
        DBUserCanEditOption: action.info.user_can_edit,
      };
    }
    case 'CHANGE_SITE_LIKER_INFO_GLOBAL_STATE': {
      return {
        ...state,
        DBSiteLikerId: action.data.siteLikerInfos.likecoin_id,
        DBSiteLikerAvatar: action.data.siteLikerInfos.avatar,
        DBSiteLikerDisplayName: action.data.siteLikerInfos.display_name,
        DBSiteLikerWallet: action.data.siteLikerInfos.wallet,
      };
    }
    case 'SET_FORBIDDEN_ERROR': {
      return {
        DBUserCanEditOption: false,
        DBErrorMessage: action.errorMsg,
      };
    }
    case 'SET_ERROR_MESSAGE': {
      return {
        DBErrorMessage: action.errorMsg,
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

createAndRegisterReduxStore(SITE_LIKER_INFO_STORE_NAME, storeConfig);
