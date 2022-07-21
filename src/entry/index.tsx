import React from 'react';
import { loadableReady } from '@loadable/component';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { once } from 'lodash-es';
import { HelmetProvider } from 'react-helmet-async';
import App from '~@/app';
import PendingNavDataLoader from '~@/entry/PendingNavDataLoader';
import routes from '~@/routes';
import createStore from '~@/stores';

const store = createStore({}, window.__INITIAL_STATE__);
window.store = store;

const application = (
  <Provider store={store}>
    <BrowserRouter>
      <HelmetProvider>
        <PendingNavDataLoader store={store} routes={routes}>
          <App />
        </PendingNavDataLoader>
      </HelmetProvider>
    </BrowserRouter>
  </Provider>
);

const init = once(() =>
  Promise.all([
    new Promise(res => {
      loadableReady(() => {
        res(true);
      });
    }),
  ]).then(() => {
    hydrate(application, document.getElementById('app'));
  })
);

if (document.readyState === 'complete') {
  init();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      init();
    }
  };

  window.addEventListener('load', init);
}
