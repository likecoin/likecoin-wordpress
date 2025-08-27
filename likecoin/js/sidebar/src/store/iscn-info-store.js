import axios from 'axios';
import apiFetch from '@wordpress/api-fetch';
import {
  createAndRegisterReduxStore, ACTION_TYPES, API_ENDPOINTS, STORE_NAMES, createReducer,
} from './index';

const {
  postId, likecoHost,
} = window.likecoinApiSettings;

// eslint-disable-next-line import/prefer-default-export
export const ISCN_INFO_STORE_NAME = STORE_NAMES.ISCN_INFO;

const saveArweaveInfoEndpoint = API_ENDPOINTS.ARWEAVE_INFO(postId);
const getISCNInfoEndpoint = API_ENDPOINTS.ISCN_METADATA(postId);
const saveISCNInfoEndPoint = API_ENDPOINTS.ISCN_METADATA(postId);
const getNFTMintInfoEndpoint = API_ENDPOINTS.NFT_MINT_INFO(likecoHost, '');

const INITIAL_STATE = {
  DBArticleTitle: '',
  DBAuthorDescription: '',
  DBDescription: '',
  DBAuthor: '',
  DBArticleURL: '',
  DBArticleTags: [],
  DBISCNId: '',
  DBArweaveId: '',
  DBLicense: '',
  DBISCNVersion: 0,
  DBISCNTimestamp: 0,
  DBNFTClassId: '',
};
const actions = {
  getISCNInfo() {
    return {
      type: ACTION_TYPES.ISCN_INFO.GET_INFO,
    };
  },
  setISCNInfo(data) {
    return {
      type: ACTION_TYPES.ISCN_INFO.SET_INFO,
      data,
    };
  },
  getNFTInfo(iscnId) {
    return {
      type: ACTION_TYPES.ISCN_INFO.GET_NFT_INFO,
      iscnId,
    };
  },
  setNFTInfo(data) {
    return {
      type: ACTION_TYPES.ISCN_INFO.SET_NFT_INFO,
      data,
    };
  },
  setHTTPErrors(errorMsg) {
    return {
      type: ACTION_TYPES.COMMON.SET_ERROR_MESSAGE,
      errorMsg,
    };
  },
  * postArweaveInfoData(data) {
    const res = yield { type: ACTION_TYPES.ISCN_INFO.POST_ARWEAVE_DATA, data };
    if (!res) {
      throw new Error('NO_ARWEAVE_INFO_RETURNED');
    }
    yield {
      type: ACTION_TYPES.ISCN_INFO.UPDATE_ARWEAVE_STATE,
      data: {
        arweaveId: res.data.arweave_id,
      },
    };
  },
  * postISCNInfoData(data) {
    const res = yield { type: ACTION_TYPES.ISCN_INFO.POST_ISCN_DATA, data };
    if (!res) {
      throw new Error('NO_ISCN_INFO_RETURNED');
    }
    const { iscn_id: iscnId, iscnVersion, iscnTimestamp } = res;
    yield {
      type: ACTION_TYPES.ISCN_INFO.UPDATE_ISCN_STATE,
      data: {
        iscnId,
        iscnTimestamp,
        iscnVersion,
      },
    };
  },
};

const selectors = {
  selectISCNInfo: (state) => state,
  selectNFTInfo: (state) => state,
  getLicense(state) {
    return state.DBLicense;
  },
};

const controls = {
  [ACTION_TYPES.ISCN_INFO.GET_INFO]() {
    return apiFetch({
      path: getISCNInfoEndpoint,
    });
  },
  [ACTION_TYPES.ISCN_INFO.GET_NFT_INFO](action) {
    return axios.get(`${getNFTMintInfoEndpoint}${encodeURIComponent(action.iscnId)}`);
  },
  [ACTION_TYPES.ISCN_INFO.POST_ARWEAVE_DATA](action) {
    return apiFetch({
      method: 'POST',
      path: saveArweaveInfoEndpoint,
      data: {
        arweaveIPFSHash: action.data.ipfsHash,
        arweaveId: action.data.arweaveId,
      },
    });
  },
  [ACTION_TYPES.ISCN_INFO.POST_ISCN_DATA](action) {
    return apiFetch({
      method: 'POST',
      path: saveISCNInfoEndPoint,
      data: {
        iscnHash: action.data.iscnHash,
        iscnId: action.data.iscnId,
        iscnVersion: action.data.iscnVersion,
        iscnTimestamp: action.data.timestamp,
        iscnData: {
          license: action.data.license,
        },
      },
    });
  },
};

const resolvers = {
  * selectISCNInfo() {
    try {
      const response = yield actions.getISCNInfo();
      const {
        iscnId,
        iscnVersion,
        iscnTimestamp,
        iscnData = {},
        title,
        authorDescription,
        description,
        author,
        url,
        tags,
        arweaveId,
        arweaveIPFSHash,
      } = response;
      return actions.setISCNInfo({
        ...iscnData,
        iscnId,
        iscnVersion,
        iscnTimestamp: iscnTimestamp * 1000,
        title,
        authorDescription,
        description,
        author,
        url,
        tags,
        arweaveId,
        arweaveIPFSHash,
      });
    } catch (error) {
      return actions.setHTTPErrors(error.message);
    }
  },
  * selectNFTInfo(iscnId) {
    if (!iscnId) return {};
    try {
      const response = yield actions.getNFTInfo(iscnId);
      const {
        classId,
        currentPrice,
      } = response.data;
      return actions.setNFTInfo({
        classId,
        currentPrice,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return {};
    }
  },
};
const reducer = createReducer({
  [ACTION_TYPES.ISCN_INFO.SET_INFO]: (state, action) => ({
    ...state,
    DBISCNId: action.data.iscnId,
    DBISCNVersion: action.data.iscnVersion,
    DBISCNTimestamp: action.data.iscnTimestamp,
    DBLicense: action.data.license,
    DBNFTClassId: action.data.nftClassId,
    DBArticleTitle: action.data.title,
    DBAuthorDescription: action.data.authorDescription,
    DBDescription: action.data.description,
    DBAuthor: action.data.author,
    DBArticleURL: action.data.url,
    DBArticleTags: action.data.tags,
    DBArweaveId: action.data.arweaveId,
  }),
  [ACTION_TYPES.ISCN_INFO.SET_NFT_INFO]: (state, action) => ({
    ...state,
    DBNFTClassId: action.data.classId,
  }),
  [ACTION_TYPES.ISCN_INFO.UPDATE_ARWEAVE_STATE]: (state, action) => {
    const { arweaveId } = action.data;
    return {
      ...state,
      DBArweaveId: arweaveId,
    };
  },
  [ACTION_TYPES.ISCN_INFO.UPDATE_ISCN_STATE]: (state, action) => ({
    ...state,
    DBISCNId: action.data.iscnId,
    DBISCNVersion: action.data.iscnVersion,
    DBISCNTimestamp: action.data.iscnTimestamp * 1000,
  }),
}, INITIAL_STATE);

const storeConfig = {
  reducer,
  controls,
  selectors,
  resolvers,
  actions,
};

createAndRegisterReduxStore(ISCN_INFO_STORE_NAME, storeConfig);
