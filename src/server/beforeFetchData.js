/*
import { setDeviceInfo } from '@cocofun/common/reducers/deviceinfo';
import {
  setUserAgent,
  setNowTime,
  setLocale,
  setClientIp,
  setRequest,
} from '@cocofun/common/reducers/env';
import parseMessageFromNative from '@cocofun/common/utils/parseMessageFromNative';
import { fixLocale } from '@cocofun/common/server/utils';

export default async function (store, ctx) {
  const userAgent = ctx.headers['user-agent'] || '';
  const needInitDeviceinfo = ENVIORMENT === 'development';

  const { deviceinfo: deviceinfoStr = '', ...restQueries } = ctx.request.query;
  if (needInitDeviceinfo) {
    let { deviceinfo = {} } = ctx.request.query;
    try {
      deviceinfo = parseMessageFromNative(deviceinfo);
    } catch (err) {
      deviceinfo = {};
    }
    store.dispatch(setDeviceInfo(deviceinfo));
  }

  store.dispatch(setUserAgent(userAgent));

  store.dispatch(setNowTime(Date.now()));

  store.dispatch(setClientIp(ctx.request.headers.remoteip || ctx.request.headers['x-real-ip']));

  store.dispatch(
    setRequest({
      host: ctx.request.host,
      path: ctx.request.path,
      queries: restQueries,
    })
  );
  // query 里的 locale 参数只会影响到文本的翻译
  store.dispatch(setLocale(fixLocale(ctx.request.query.locale) || 'ina'));
}
*/
