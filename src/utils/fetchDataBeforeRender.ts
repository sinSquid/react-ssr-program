import { matchRoutes } from 'react-router-dom';

// https://github.com/jamiebuilds/react-loadable/blob/a64a415d1bff33ca5ef35f2abf616f47085a93a2/src/index.js#L92
const resolve = obj => (obj && obj.__esModule ? obj.default : obj);

const fetchDataBeforeRender = async ({ routes, store, url, query, onProgress }) => {
  let branch;
  try {
    branch = matchRoutes(routes, url);
  } catch (err) {
    // TODO added on 2022/7/20 19:18
  }
  if (!branch) {
    return Promise.resolve(null);
  }
  if (onProgress) {
    onProgress({ progress: 0 });
  }
  const promises = branch.map(async ({ route, match }) => {
    let Comp = route.element;
    // loadable wrapped
    if (Comp.load) {
      Comp = resolve(await Comp.load());
    }

    return Comp.fetchData
      ? Comp.fetchData(store, match, query)?.catch(err => {
          // 增加接口兜底catch 防止白屏
          console.log('\x1B[31m%s\x1B[0m', `Comp.fetchData error  ======>  ${err}`);
        })
      : Promise.resolve(null);
  });

  const responses = await Promise.all(promises);
  if (onProgress) {
    onProgress({ progress: 100 });
  }
  return responses;
};

export default fetchDataBeforeRender;
