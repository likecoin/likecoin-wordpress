import { createReduxStore, register } from '@wordpress/data';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const ISCN_INFO_STORE_NAME = 'likecoin/iscn_info_store';

const getISCNInfoEndpoint = `${window.wpApiSettings.root}likecoin/v1/posts/${window.wpApiSettings.postId}/iscn/full-info`;
const getISCNRegisterDataEndPoint = `${window.wpApiSettings.root}likecoin/v1/posts/${window.wpApiSettings.postId}/arweave/register-data`;
const saveArweaveInfoEndpoint = `${window.wpApiSettings.root}likecoin/v1/posts/${window.wpApiSettings.postId}/arweave/save-metadata`;
const saveISCNInfoEndPoint = `${window.wpApiSettings.root}likecoin/v1/posts/${window.wpApiSettings.postId}/publish/iscn`;

if (window.wpApiSettings.nonce) {
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
  DBISCNVersion: '',
  DBArweaveIPFSHash: '',
  DBMattersIPFSHash: '',
  DBMattersPublishedArticleHash: '',
  DBMattersDraftId: '',
  DBMattersArticleId: '',
  DBMattersId: '',
  DBMattersArticleSlug: '',
};
const actions = {
  getISCNInfo(path) {
    return {
      type: 'GET_ISCN_INFO',
      path,
    };
  },
  setISCNInfo(data) {
    return {
      type: 'SET_ISCN_INFO',
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
    const { iscnVersion, timeZone, localTime } = response.data;
    const iscnVersionString = iscnVersion ? iscnVersion.toString().concat(' (', localTime, ' ', timeZone, ')') : '';
    yield { type: 'UPDATE_ISCN_ID_GLOBAL_STATE', data: { iscnId: response.data.iscn_id, iscnVersion: iscnVersionString } };
  },
};

const selectors = {
  selectISCNInfo: (state) => state,
};

const controls = {
  GET_ISCN_INFO(action) {
    return axios.get(action.path);
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
      const response = yield actions.getISCNInfo(getISCNInfoEndpoint);
      const {
        iscnId,
        iscnVersion,
        timeZone,
        localTime,
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
      const iscnVersionString = iscnVersion ? iscnVersion.toString().concat(' (', localTime, ' ', timeZone, ')') : '';
      return actions.setISCNInfo({
        iscnId,
        iscnVersion: iscnVersionString,
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
};
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_ISCN_INFO': {
      return {
        ...state,
        DBISCNId: action.data.iscnId,
        DBISCNVersion: action.data.iscnVersion,
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

const iscnInfoStore = createReduxStore(
  ISCN_INFO_STORE_NAME,
  storeConfig,
);

register(iscnInfoStore);
