export const ACTION_TYPES = {
  BUTTON_INFO: {
    GET_SETTINGS: 'GET_BUTTON_SETTINGS',
    SET_SETTINGS: 'SET_BUTTON_SETTINGS',
    POST_SETTINGS: 'POST_BUTTON_SETTINGS',
  },

  ISCN_INFO: {
    GET_INFO: 'GET_ISCN_INFO',
    SET_INFO: 'SET_ISCN_INFO',
    GET_NFT_INFO: 'GET_NFT_INFO',
    SET_NFT_INFO: 'SET_NFT_INFO',
    POST_ARWEAVE_DATA: 'POST_ARWEAVE_INFO_DATA',
    POST_ISCN_DATA: 'POST_ISCN_INFO_DATA',
    UPDATE_ARWEAVE_STATE: 'UPDATE_ARWEAVE_UPLOAD_AND_IPFS_GLOBAL_STATE',
    UPDATE_ISCN_STATE: 'UPDATE_ISCN_ID_GLOBAL_STATE',
  },

  COMMON: {
    SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
  },
};

export const API_ENDPOINTS = {
  BUTTON_SETTINGS: (postId) => `/likecoin/v1/posts/${postId}/button/settings`,
  ISCN_METADATA: (postId) => `/likecoin/v1/posts/${postId}/iscn/metadata`,
  ARWEAVE_INFO: (postId) => `/likecoin/v1/posts/${postId}/iscn/arweave`,
  NFT_MINT_INFO: (likecoHost, iscnId) => `https://api.${likecoHost}/likernft/mint?iscn_id=${encodeURIComponent(iscnId)}`,
};

export const STORE_NAMES = {
  BUTTON_INFO: 'likecoin/button_info_store',
  ISCN_INFO: 'likecoin/iscn_info_store',
};
