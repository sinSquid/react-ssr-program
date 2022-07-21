import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';

const store = (...args) => {
  const [ctx, ...rest] = args;
  const middlewares = [thunk];
  const finalCreateStore = compose(applyMiddleware(...middlewares))(createStore);
  return finalCreateStore(reducers, ...rest);
};

export default store;
