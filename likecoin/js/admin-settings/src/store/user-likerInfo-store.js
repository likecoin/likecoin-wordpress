import apiFetch from '@wordpress/api-fetch';
import { createAndRegisterReduxStore } from './util';

// eslint-disable-next-line import/prefer-default-export
export const USER_LIKER_INFO_STORE_NAME = 'likecoin/user_liker_info';

const endPoint = '/likecoin/v1/options/liker-id/user';

const INITIAL_STATE = {
  DBUserLikerId: '',
  DBUserLikerAvatar: '',
  DBUserLikerDisplayName: '',
  DBUserLikerWallet: '',
};

const actions = {
  getUserLikerInfo(path) {
    return {
      type: 'GET_USER_LIKER_INFO',
      path,
    };
  },
  setUserLikerInfo(info) {
    return {
      type: 'SET_USER_LIKER_INFO',
      info,
    };
  },
  setHTTPErrors(errorMsg) {
    return {
      type: 'SET_ERROR_MESSAGE',
      errorMsg,
    };
  },
  * postUserLikerInfo(info) {
    yield { type: 'POST_USER_LIKER_INFO_TO_DB', data: info };
    if (info.likecoin_user) {
      yield { type: 'CHANGE_USER_LIKER_INFO_GLOBAL_STATE', data: info };
    }
  },
};

const selectors = {
  selectUserLikerInfo: (state) => state,
};

const controls = {
  GET_USER_LIKER_INFO(action) {
    return apiFetch({ path: action.path });
  },
  POST_USER_LIKER_INFO_TO_DB(action) {
    return apiFetch({
      method: 'POST',
      path: endPoint,
      data: action.data,
    });
  },
};

const resolvers = {
  * selectUserLikerInfo() {
    try {
      const response = yield actions.getUserLikerInfo(endPoint);
      const userLikersInfo = response.data;
      return actions.setUserLikerInfo(userLikersInfo);
    } catch (error) {
      return actions.setHTTPErrors(error.message);
    }
  },
};

// eslint-disable-next-line default-param-last
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USER_LIKER_INFO': {
      return {
        DBUserLikerId: action.info ? action.info.likecoin_user.likecoin_id : '',
        DBUserLikerAvatar: action.info ? action.info.likecoin_user.avatar : '',
        DBUserLikerDisplayName: action.info ? action.info.likecoin_user.display_name : '',
        DBUserLikerWallet: action.info ? action.info.likecoin_user.wallet : '',
      };
    }
    case 'CHANGE_USER_LIKER_INFO_GLOBAL_STATE': {
      return {
        DBUserLikerId: action.data.userLikerInfos.likecoin_id,
        DBUserLikerAvatar: action.data.userLikerInfos.avatar,
        DBUserLikerDisplayName: action.data.userLikerInfos.display_name,
        DBUserLikerWallet: action.data.userLikerInfos.wallet,
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

createAndRegisterReduxStore(USER_LIKER_INFO_STORE_NAME, storeConfig);
