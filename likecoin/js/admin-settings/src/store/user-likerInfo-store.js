import { createReduxStore, register } from '@wordpress/data';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const USER_LIKER_INFO_STORE_NAME = 'likecoin/user_liker_info';

const endPoint = `${window.wpApiSettings.root}likecoin/v1/likecoin-button-page`;

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
  postUserLikerInfo(info) {
    return {
      type: 'POST_USER_LIKER_INFO',
      info,
    };
  },
};

const selectors = {
  getUserLikerInfo: (state) => state,
};

const controls = {
  GET_USER_LIKER_INFO(action) {
    return axios.get(action.path, {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce,
      },
    });
  },
};

const resolvers = {
  * getUserLikerInfo() {
    try {
      const response = yield actions.getUserLikerInfo(endPoint);
      const userLikersInfo = response.data.data;
      return actions.setUserLikerInfo(userLikersInfo);
    } catch (error) {
      return actions.setHTTPErrors(error.message);
    }
  },
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_USER_LIKER_INFO': {
      return {
        ...state,
      };
    }
    case 'SET_USER_LIKER_INFO': {
      return {
        DBUserLikerId: action.info.likecoin_user.likecoin_id,
        DBUserLikerAvatar: action.info.likecoin_user.avatar,
        DBUserLikerDisplayName: action.info.likecoin_user.display_name,
        DBUserLikerWallet: action.info.likecoin_user.wallet,
      };
    }
    case 'POST_USER_LIKER_INFO': {
      return {
        DBUserLikerId: action.info.userLikerInfos.likecoin_id,
        DBUserLikerAvatar: action.info.userLikerInfos.avatar,
        DBUserLikerDisplayName: action.info.userLikerInfos.display_name,
        DBUserLikerWallet: action.info.userLikerInfos.wallet,
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

const userLikerInfoStore = createReduxStore(
  USER_LIKER_INFO_STORE_NAME,
  storeConfig,
);

register(userLikerInfoStore);
