import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import PT from 'prop-types';
import App from '~@/app';
import Html from './html';
import fetchDataBeforeRender from '../../utils/fetchDataBeforeRender';

function RenderApp({ store, ctx, context, routes }) {
  ctx.state.store = store;

  return (
    <Provider store={store}>
      <StaticRouter location={ctx.request.url} context={context}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StaticRouter>
    </Provider>
  );
}

RenderApp.propTypes = {
  store: PT.shape({}).isRequired,
  ctx: PT.shape({}).isRequired,
  context: PT.shape({}).isRequired,
  routes: PT.array.isRequired,
};

const ssr =
  (opt = {}) =>
  async (ctx, next) => {
    const { getExtractor, beforeFetchData, createStore, routes } = opt;
    const context = { url: undefined };
    const store = createStore();
    const extractor = getExtractor();
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
    });

    const app = <RenderApp store={store} ctx={ctx} context={context} routes={routes} />;

    const jsx = extractor.collectChunks(app);

    const markup = renderToString(jsx);
    const helmet = HelmetProvider.renderStatic();

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
