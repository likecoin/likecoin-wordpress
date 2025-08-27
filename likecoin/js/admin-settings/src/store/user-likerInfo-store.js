import apiFetch from '@wordpress/api-fetch';
import {
  createAndRegisterReduxStore, ACTION_TYPES, API_ENDPOINTS, STORE_NAMES, createReducer,
} from './index';

// eslint-disable-next-line import/prefer-default-export
export const USER_LIKER_INFO_STORE_NAME = STORE_NAMES.USER_LIKER_INFO;

const endPoint = API_ENDPOINTS.USER_LIKER_INFO;

const INITIAL_STATE = {
  DBUserLikerId: '',
  DBUserLikerAvatar: '',
  DBUserLikerDisplayName: '',
  DBUserLikerWallet: '',
};

const actions = {
  getUserLikerInfo(path) {
    return {
      type: ACTION_TYPES.USER_LIKER_INFO.GET_INFO,
      path,
    };
  },
  setUserLikerInfo(info) {
    return {
      type: ACTION_TYPES.USER_LIKER_INFO.SET_INFO,
      info,
    };
  },
  setHTTPErrors(errorMsg) {
    return {
      type: ACTION_TYPES.COMMON.SET_ERROR_MESSAGE,
      errorMsg,
    };
  },
  * postUserLikerInfo(info) {
    yield { type: ACTION_TYPES.USER_LIKER_INFO.POST_INFO_TO_DB, data: info };
    if (info.likecoin_user) {
      yield { type: ACTION_TYPES.USER_LIKER_INFO.CHANGE_GLOBAL_STATE, data: info };
    }
  },
};

const selectors = {
  selectUserLikerInfo: (state) => state,
};

const controls = {
  [ACTION_TYPES.USER_LIKER_INFO.GET_INFO](action) {
    return apiFetch({ path: action.path });
  },
  [ACTION_TYPES.USER_LIKER_INFO.POST_INFO_TO_DB](action) {
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

const reducer = createReducer({
  [ACTION_TYPES.USER_LIKER_INFO.SET_INFO]: (state, action) => ({
    DBUserLikerId: action.info ? action.info.likecoin_user.likecoin_id : '',
    DBUserLikerAvatar: action.info ? action.info.likecoin_user.avatar : '',
    DBUserLikerDisplayName: action.info ? action.info.likecoin_user.display_name : '',
    DBUserLikerWallet: action.info ? action.info.likecoin_user.wallet : '',
  }),
  [ACTION_TYPES.USER_LIKER_INFO.CHANGE_GLOBAL_STATE]: (state, action) => ({
    DBUserLikerId: action.data.userLikerInfos.likecoin_id,
    DBUserLikerAvatar: action.data.userLikerInfos.avatar,
    DBUserLikerDisplayName: action.data.userLikerInfos.display_name,
    DBUserLikerWallet: action.data.userLikerInfos.wallet,
  }),
}, INITIAL_STATE);

const storeConfig = {
  reducer,
  controls,
  selectors,
  resolvers,
  actions,
};

createAndRegisterReduxStore(USER_LIKER_INFO_STORE_NAME, storeConfig);
