// eslint-disable-next-line arrow-body-style
export const createReducer = (actionHandlers, initialState) => {
  // eslint-disable-next-line default-param-last
  return (state = initialState || {}, action) => {
    const handler = actionHandlers[action.type];
    return handler ? handler(state, action) : state;
  };
};
export const createAsyncActions = (domain, actionTypes) => ({
  [`get${domain}`]: (path) => ({ type: actionTypes.GET, path }),
  [`set${domain}`]: (data) => ({ type: actionTypes.SET, data }),
  * [`post${domain}`](data) {
    yield { type: actionTypes.POST_TO_DB, data };
    yield { type: actionTypes.CHANGE_GLOBAL_STATE, data };
  },
});

export const createErrorAction = (errorMsg) => ({
  type: 'SET_ERROR_MESSAGE',
  errorMsg,
});

export const createApiControl = (endpoint) => ({
  GET: (action) => window.wp.apiFetch({ path: action.path || endpoint }),
  POST: (action) => window.wp.apiFetch({
    method: 'POST',
    path: endpoint,
    data: action.data,
  }),
});
