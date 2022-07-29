import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { ChunkExtractor } from '@loadable/server';
import fetchDataBeforeRender from '~@/utils/fetchDataBeforeRender';
import createStore from '~@/stores';
import routes from '~@/routes';
import App from '~@/app';
import Html from './html';
import { appDistAssetsLoadJson } from '../../../utils/paths';

const getExtractor = () => {
  return new ChunkExtractor({
    statsFile: appDistAssetsLoadJson,
    entrypoints: ['app'],
  });
};

const ssr =
  (opt = {}) =>
  async (ctx, next) => {
    const beforeFetchData = undefined;
    const context = { url: undefined };
    const store = createStore();
    const extractor = getExtractor();

    const helmetContext = {};
    const renderApp = () => {
      ctx.state.store = store;

      return (
        <Provider store={store}>
          <StaticRouter location={ctx.request.url}>
            <HelmetProvider context={helmetContext}>
              <App />
            </HelmetProvider>
          </StaticRouter>
        </Provider>
      );
    };

    await next();

    // 在执行FetchData 之前调用
    if (beforeFetchData) {
      await beforeFetchData(store, ctx);
    }

    await fetchDataBeforeRender({
      routes,
      store,
      url: ctx.request.path,
      query: ctx.request.query,
      onProgress: undefined,
    });

    const app = renderApp();

    const jsx = extractor.collectChunks(app);

    const markup = renderToString(jsx);
    const { helmet } = helmetContext;

    const js = extractor.getScriptElements();
    const css = extractor.getStyleElements();
    const link = extractor.getLinkElements();
    if (context.url) {
      ctx.status = 302;
      ctx.redirect(context.url);
      return;
    }

    ctx.body = `<!DOCTYPE html>\n${renderToStaticMarkup(
      <Html
        helmet={helmet}
        assets={{ js, css, link }}
        markup={markup}
        appState={store.getState ? store.getState() : store}
      />
    )}`;
  };

export default ssr;
