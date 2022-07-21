import ip from 'ip';
import Koa from 'koa';
import koaBody from 'koa-body';
import { ChunkExtractor } from '@loadable/server';
import createStore from '~@/stores';
import routes from '~@/routes';
import favicon from '../../assets/favicon.svg';
import { assetHandler, ssr } from './middleware';
import { appDistAssetsLoadJson } from '../../utils/paths';

const server = (conf = {}) => {
  const { port = 3100, beforeFetchData, middlewares = [] } = conf;
  const getExtractor = () => {
    return new ChunkExtractor({
      statsFile: appDistAssetsLoadJson,
      entrypoints: ['app'],
    });
  };
  const app = new Koa();

  // 优先走middlewares自定义错误 在这里兜底
  middlewares.forEach(middleware => {
    app.use(middleware);
  });
  app.use(assetHandler(favicon));

  app.use(koaBody({ multipart: true, jsonLimit: '100mb' }));
  app.use(ssr({ getExtractor, createStore, routes, beforeFetchData }));
  app.listen(port);
  console.log(`server start at port http://${ip.address()}:${port}`);
};

server();
