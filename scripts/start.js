const webpack = require('webpack');
const ip = require('ip');
const nodemon = require('nodemon');
const fs = require('fs-extra');
const WebpackDevServer = require('webpack-dev-server');
const webpackClientDevConfig = require('../webpack/client.dev');
const webpackServerDevConfig = require('../webpack/server.dev');
const { appDist, appServerOutputServerJs } = require('../utils/paths');

const host = ip.address();
const port = process.env.ASSETPORT;

fs.removeSync(appDist); // 整个文件夹都删掉，只清空会在某些情况下（外层通过脚本调用）报端口占用

// client devServer
const clientCompiler = webpack(webpackClientDevConfig);
const devServerConfig = {
  compress: true,
  host,
  port,
  historyApiFallback: true,
  liveReload: true,
  // 解决字体文件跨域问题
  headers: { 'Access-Control-Allow-Origin': '*' },
};
const devServer = new WebpackDevServer(devServerConfig, clientCompiler);
devServer.startCallback(() => {
  console.log('error');
});

// server webpack watch
const serverCompiler = webpack(webpackServerDevConfig);
serverCompiler.watch({}, (err, stats) => {
  console.log('server watch error', err);
});

// nodemon watch server/index.js
nodemon({
  script: appServerOutputServerJs,
  nodeArgs: ['--inspect'],
});

nodemon
  .on('start', () => {
    console.log('Nodemon: App has started');
  })
  .on('quit', () => {
    console.log('Nodemon: App has quit');
    process.exit();
  })
  .on('restart', files => {
    console.log('Nodemon: App restarted due to: ', files);
  });

console.log('启动uni-build');

const onExit = () => {
  console.log('关闭uni-build');
  process.exit(0);
};

process.on('SIGINT', onExit);
