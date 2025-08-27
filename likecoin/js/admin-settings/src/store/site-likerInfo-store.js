import apiFetch from '@wordpress/api-fetch';
import {
  createAndRegisterReduxStore, ACTION_TYPES, API_ENDPOINTS, STORE_NAMES, createReducer,
} from './index';

// eslint-disable-next-line import/prefer-default-export
export const SITE_LIKER_INFO_STORE_NAME = STORE_NAMES.SITE_LIKER_INFO;

const buttonEndPoint = API_ENDPOINTS.SITE_LIKER_INFO;

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
      type: ACTION_TYPES.SITE_LIKER_INFO.GET_INFO,
      path,
    };
  },
  setSiteLikerInfo(info) {
    return {
      type: ACTION_TYPES.SITE_LIKER_INFO.SET_INFO,
      info,
    };
  },
  setHTTPError(error) {
    const errorMsg = error.response.data || error.message;
    if (error.response.status === 403) {
      return {
        type: ACTION_TYPES.SITE_LIKER_INFO.SET_FORBIDDEN_ERROR,
        errorMsg,
      };
    }
    return {
      type: ACTION_TYPES.COMMON.SET_ERROR_MESSAGE,
      errorMsg,
    };
  },
  * postSiteLikerInfo(info) {
    yield { type: ACTION_TYPES.SITE_LIKER_INFO.POST_INFO_TO_DB, data: info };
    if (info.siteLikerInfos) {
      yield { type: ACTION_TYPES.SITE_LIKER_INFO.CHANGE_GLOBAL_STATE, data: info };
    }
  },
};

const selectors = {
  selectSiteLikerInfo: (state) => state,
};

const controls = {
  [ACTION_TYPES.SITE_LIKER_INFO.GET_INFO]() {
    return apiFetch({ path: buttonEndPoint });
  },
  [ACTION_TYPES.SITE_LIKER_INFO.POST_INFO_TO_DB](action) {
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

const reducer = createReducer({
  [ACTION_TYPES.SITE_LIKER_INFO.SET_INFO]: (state, action) => ({
    ...state,
    DBSiteLikerId: action.info.site_likecoin_user.likecoin_id,
    DBSiteLikerAvatar: action.info.site_likecoin_user.avatar,
    DBSiteLikerDisplayName: action.info.site_likecoin_user.display_name,
    DBSiteLikerWallet: action.info.site_likecoin_user.wallet,
    DBDisplayOptionSelected: action.info.button_display_option,
    DBPerPostOptionEnabled: action.info.button_display_author_override,
    DBUserCanEditOption: action.info.user_can_edit,
  }),
  [ACTION_TYPES.SITE_LIKER_INFO.CHANGE_GLOBAL_STATE]: (state, action) => ({
    ...state,
    DBSiteLikerId: action.data.siteLikerInfos.likecoin_id,
    DBSiteLikerAvatar: action.data.siteLikerInfos.avatar,
    DBSiteLikerDisplayName: action.data.siteLikerInfos.display_name,
    DBSiteLikerWallet: action.data.siteLikerInfos.wallet,
  }),
  [ACTION_TYPES.SITE_LIKER_INFO.SET_FORBIDDEN_ERROR]: (state, action) => ({
    DBUserCanEditOption: false,
    DBErrorMessage: action.errorMsg,
  }),
  [ACTION_TYPES.COMMON.SET_ERROR_MESSAGE]: (state, action) => ({
    DBErrorMessage: action.errorMsg,
  }),
}, INITIAL_STATE);

const storeConfig = {
  reducer,
  controls,
  selectors,
  resolvers,
  actions,
};

createAndRegisterReduxStore(SITE_LIKER_INFO_STORE_NAME, storeConfig);
