import React from 'react';
import { loadableReady } from '@loadable/component';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { once } from 'lodash-es';
import App from '~@/app';
import createStore from '~@/stores';
import './index.less';

const store = createStore({}, window.__INITIAL_STATE__);
window.store = store;

const application = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

const initApp = once(() =>
  Promise.all([
    new Promise(res => {
      loadableReady(() => {
        res(true);
      });
    }),
  ]).then(() => {
    hydrateRoot(document.getElementById('app'), application);
  })
);

if (document.readyState === 'complete') {
  initApp();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      initApp();
    }
  };

  window.addEventListener('load', initApp);
}
