import axios from 'axios';
import { createAndRegisterReduxStore } from './util';

const {
  root, nonce, postId, likecoHost,
} = window.wpApiSettings;

// eslint-disable-next-line import/prefer-default-export
export const ISCN_INFO_STORE_NAME = 'likecoin/iscn_info_store';

const getISCNRegisterDataEndPoint = `${root}likecoin/v1/posts/${postId}/iscn/arweave/upload`;
const saveArweaveInfoEndpoint = `${root}likecoin/v1/posts/${postId}/iscn/arweave`;
const getISCNInfoEndpoint = `${root}likecoin/v1/posts/${postId}/iscn/metadata`;
const saveISCNInfoEndPoint = `${root}likecoin/v1/posts/${postId}/iscn/metadata`;
const getNFTMintInfoEndpoint = `https://api.${likecoHost}/likernft/mint?iscn_id=`;

if (nonce) {
  axios.defaults.headers.common['X-WP-Nonce'] = window.wpApiSettings.nonce;
}

const INITIAL_STATE = {
  DBArticleTitle: '',
  DBAuthorDescription: '',
  DBDescription: '',
  DBAuthor: '',
  DBArticleURL: '',
  DBArticleTags: [],
  DBISCNId: '',
  DBArweaveId: '',
  DBISCNVersion: 0,
  DBISCNTimestamp: 0,
  DBArweaveIPFSHash: '',
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
    const response = yield { type: 'GET_ISCN_REGISTER_DATA' };
    if (!response.data) {
      throw new Error('NO_ISCN_REGISTER_DATA_RETURNED');
    }
    return response;
  },
  * postArweaveInfoData(data) {
    const response = yield { type: 'POST_ARWEAVE_INFO_DATA', data };
    if (!response.data) {
      throw new Error('NO_ARWEAVE_INFO_RETURNED');
    }
    yield {
      type: 'UPDATE_ARWEAVE_UPLOAD_AND_IPFS_GLOBAL_STATE',
      data: {
        arweaveId: response.data.arweave_id, ipfsHash: response.data.ipfs_hash,
      },
    };
  },
  * postISCNInfoData(data) {
    const response = yield { type: 'POST_ISCN_INFO_DATA', data };
    if (!response.data) {
      throw new Error('NO_ISCN_INFO_RETURNED');
    }
    const { iscnVersion, iscnTimestamp } = response.data;
    yield {
      type: 'UPDATE_ISCN_ID_GLOBAL_STATE',
      data: {
        iscnId: response.data.iscn_id,
        iscnTimestamp,
        iscnVersion,
      },
    };
  },
};

const selectors = {
  selectISCNInfo: (state) => state,
  selectNFTInfo: (state) => state,
};

const controls = {
  GET_ISCN_INFO() {
    return axios.get(getISCNInfoEndpoint);
  },
  GET_NFT_INFO(action) {
    return axios.get(`${getNFTMintInfoEndpoint}${encodeURIComponent(action.iscnId)}`);
  },
  GET_ISCN_REGISTER_DATA() {
    return axios.get(getISCNRegisterDataEndPoint);
  },
  POST_ARWEAVE_INFO_DATA(action) {
    return axios.post(
      saveArweaveInfoEndpoint,
      {
        arweaveIPFSHash: action.data.ipfsHash,
        arweaveId: action.data.arweaveId,
      },
    );
  },
  POST_ISCN_INFO_DATA(action) {
    return axios.post(
      saveISCNInfoEndPoint,
      {
        iscnHash: action.data.iscnHash,
        iscnId: action.data.iscnId,
        iscnVersion: action.data.iscnVersion,
        iscnTimestamp: action.data.timestamp,
      },
    );
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
      } = response.data;
      return actions.setISCNInfo({
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
        DBNFTClassId: action.data.nftClassId,
        DBArticleTitle: action.data.title,
        DBAuthorDescription: action.data.authorDescription,
        DBDescription: action.data.description,
        DBAuthor: action.data.author,
        DBArticleURL: action.data.url,
        DBArticleTags: action.data.tags,
        DBArweaveId: action.data.arweaveId,
        DBArweaveIPFSHash: action.data.arweaveIPFSHash,
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
    case 'UPDATE_ARWEAVE_UPLOAD_AND_IPFS_GLOBAL_STATE': {
      const { arweaveId, ipfsHash: arweaveIPFSHash } = action.data;
      return {
        ...state,
        DBArweaveId: arweaveId,
        DBArweaveIPFSHash: arweaveIPFSHash,
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
