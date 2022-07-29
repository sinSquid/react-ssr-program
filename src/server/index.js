import ip from 'ip';
import Koa from 'koa';
import koaBody from 'koa-body';
import favicon from '../../assets/favicon.ico';
import { assetHandler, ssr } from './middleware';

const server = () => {
  const port = 3100;
  const app = new Koa();

  app.use(assetHandler(favicon));

  app.use(koaBody({ multipart: true, jsonLimit: '100mb' }));
  app.use(ssr());
  app.listen(port);
  console.log(`server start at port http://${ip.address()}:${port}`);
};

server();
