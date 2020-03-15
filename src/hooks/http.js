import { useReducer, useCallback } from 'react';

const initialState =  {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
}

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
    case 'RESPONSE':
      return { ...httpState, loading: false, data: action.response, extra: action.extra };
    case 'ERROR':
      return { loading: false, error: action.error };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Something went wrong!')
  }
};

// It's a custom hook
// custom hook has nothing with useReducer, it can be used itself
const useHttp = () => {
  const [ httpState, dispatchHttp ] = useReducer(httpReducer, initialState);
  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR'}));

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: 'SEND', identifier });
    fetch(url, { method, body, headers: { 'Content-Type': 'application/json' } })
    .then(response =>  response.json())
    .then(response => {
      dispatchHttp({ type: 'RESPONSE', extra, response });
    })
    .catch(error => {
      dispatchHttp({ type: 'ERROR', error: 'Urgh, can\'t delete: ' + error.message });
    });
  }, [])

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    extra: httpState.extra,
    identifier: httpState.identifier,
    clear,
    sendRequest,
  }
};

export default useHttp;