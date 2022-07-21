const fs = require('fs-extra');
const webpackClientConfig = require('../webpack/client.test');
const webpackServerConfig = require('../webpack/server.test');
const { appDist } = require('../utils/paths');
const webpackBuild = require('./webpackBuild');

fs.removeSync(appDist); // 整个文件夹都删掉，只清空会在某些情况下（外层通过脚本调用）报端口占用

webpackBuild([webpackClientConfig, webpackServerConfig])
  .then(() => {
    console.log('打包成功！');
  })
  .catch(err => {
    console.error(err);
    console.log('打包失败！');
  });
