import path from 'path';
import serve from 'koa-static-cache';
import compose from 'koa-compose';
import { appDistAssets } from '../../../utils/paths';

const assetHandler = icon => {
  const servers = [
    serve(appDistAssets, {
      gzip: true,
      prefix: '/',
    }),
  ];
  if (icon) {
    const [filename, distServer] = [path.basename(icon), path.resolve(__dirname, './')];
    servers.push(
      serve(distServer, {
        gzip: true,
        prefix: '/',
        alias: {
          '/favicon.ico': `/${filename}`,
        },
      })
    );
  }
  return compose(servers);
};

export default assetHandler;
