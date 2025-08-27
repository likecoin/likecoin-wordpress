// eslint-disable-next-line arrow-body-style
export const createReducer = (actionHandlers, initialState) => {
  // eslint-disable-next-line default-param-last
  return (state = initialState || {}, action) => {
    const handler = actionHandlers[action.type];
    return handler ? handler(state, action) : state;
  };
};
export const createAsyncActions = (actionTypes) => ({
  get: (path) => ({ type: actionTypes.GET, path }),
  set: (data) => ({ type: actionTypes.SET, data }),
  * post(data) {
    const res = yield { type: actionTypes.POST, data };
    if (!res) {
      throw new Error('API_REQUEST_FAILED');
    }
    return res;
  },
});

export const createErrorAction = (errorMsg) => ({
  type: 'SET_ERROR_MESSAGE',
  errorMsg,
});

export const createApiControl = (endpoint) => ({
  GET: () => window.wp.apiFetch({ path: endpoint }),
  POST: (action) => window.wp.apiFetch({
    method: 'POST',
    path: endpoint,
    data: action.data,
  }),
});
