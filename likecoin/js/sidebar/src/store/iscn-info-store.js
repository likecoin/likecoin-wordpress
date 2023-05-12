import axios from 'axios';
import apiFetch from '@wordpress/api-fetch';
import { createAndRegisterReduxStore } from './util';

const {
  postId, likecoHost,
} = window.wpApiSettings;

// eslint-disable-next-line import/prefer-default-export
export const ISCN_INFO_STORE_NAME = 'likecoin/iscn_info_store';

const getISCNRegisterDataEndPoint = `/likecoin/v1/posts/${postId}/iscn/arweave/upload`;
const saveArweaveInfoEndpoint = `/likecoin/v1/posts/${postId}/iscn/arweave`;
const getISCNInfoEndpoint = `/likecoin/v1/posts/${postId}/iscn/metadata`;
const saveISCNInfoEndPoint = `/likecoin/v1/posts/${postId}/iscn/metadata`;
const getNFTMintInfoEndpoint = `https://api.${likecoHost}/likernft/mint?iscn_id=`;

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
  DBMattersIPFSHash: '',
  DBMattersPublishedArticleHash: '',
  DBMattersDraftId: '',
  DBMattersArticleId: '',
  DBMattersId: '',
  DBMattersArticleSlug: '',
};
const actions = {
  getISCNInfo() {
    return {
      type: 'GET_ISCN_INFO',
    };
  },
  setISCNInfo(data) {
    return {
      type: 'SET_ISCN_INFO',
      data,
    };
  },
  setISCNLicense(license) {
    return {
      type: 'SET_ISCN_LICENSE',
      license,
    };
  },
  getNFTInfo(iscnId) {
    return {
      type: 'GET_NFT_INFO',
      iscnId,
    };
  },
  setNFTInfo(data) {
    return {
      type: 'SET_NFT_INFO',
      data,
    };
  },
  setHTTPErrors(errorMsg) {
    return {
      type: 'SET_ERROR_MESSAGE',
      errorMsg,
    };
  },
  * fetchISCNRegisterData() {
    const res = yield { type: 'GET_ISCN_REGISTER_DATA' };
    if (!res) {
      throw new Error('NO_ISCN_REGISTER_DATA_RETURNED');
    }
    return res;
  },
  * postArweaveInfoData(data) {
    const res = yield { type: 'POST_ARWEAVE_INFO_DATA', data };
    if (!res) {
      throw new Error('NO_ARWEAVE_INFO_RETURNED');
    }
    yield {
      type: 'UPDATE_ARWEAVE_UPLOAD_AND_IPFS_GLOBAL_STATE',
      data: {
        arweaveId: res.data.arweave_id,
      },
    };
  },
  * postISCNInfoData(data) {
    const res = yield { type: 'POST_ISCN_INFO_DATA', data };
    if (!res) {
      throw new Error('NO_ISCN_INFO_RETURNED');
    }
    const { iscn_id: iscnId, iscnVersion, iscnTimestamp } = res;
    yield {
      type: 'UPDATE_ISCN_ID_GLOBAL_STATE',
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
  GET_ISCN_INFO() {
    return apiFetch({
      path: getISCNInfoEndpoint,
    });
  },
  GET_NFT_INFO(action) {
    return axios.get(`${getNFTMintInfoEndpoint}${encodeURIComponent(action.iscnId)}`);
  },
  GET_ISCN_REGISTER_DATA() {
    return apiFetch({
      path: getISCNRegisterDataEndPoint,
    });
  },
  POST_ARWEAVE_INFO_DATA(action) {
    return apiFetch({
      method: 'POST',
      path: saveArweaveInfoEndpoint,
      data: {
        arweaveIPFSHash: action.data.ipfsHash,
        arweaveId: action.data.arweaveId,
      },
    });
  },
  POST_ISCN_INFO_DATA(action) {
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
        mattersIPFSHash,
        mattersPublishedArticleHash,
        mattersArticleId,
        mattersId,
        mattersArticleSlug,
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
        mattersIPFSHash,
        mattersPublishedArticleHash,
        mattersArticleId,
        mattersId,
        mattersArticleSlug,
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
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_ISCN_INFO': {
      return {
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
        DBMattersIPFSHash: action.data.mattersIPFSHash,
        DBMattersPublishedArticleHash: action.data.mattersPublishedArticleHash,
        DBMattersArticleId: action.data.mattersArticleId,
        DBMattersId: action.data.mattersId,
        DBMattersArticleSlug: action.data.mattersArticleSlug,
      };
    }
    case 'SET_NFT_INFO': {
      return {
        ...state,
        DBNFTClassId: action.data.classId,
      };
    }
    case 'SET_ISCN_LICENSE': {
      return {
        ...state,
        DBLicense: action.license,
      };
    }
    case 'UPDATE_ARWEAVE_UPLOAD_AND_IPFS_GLOBAL_STATE': {
      const { arweaveId } = action.data;
      return {
        ...state,
        DBArweaveId: arweaveId,
      };
    }
    case 'UPDATE_ISCN_ID_GLOBAL_STATE': {
      return {
        ...state,
        DBISCNId: action.data.iscnId,
        DBISCNVersion: action.data.iscnVersion,
        DBISCNTimestamp: action.data.iscnTimestamp * 1000,
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

createAndRegisterReduxStore(ISCN_INFO_STORE_NAME, storeConfig);
