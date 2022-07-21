const { loadScripts, loadAssets, loadStyles, plugins, resolve } = require('./parts');
const { appConfig, appServerOutput, appServerIndex } = require('../utils/paths');

const projectConfig = require(appConfig);
projectConfig.staticServerHost =
  projectConfig.test.staticServerHost || projectConfig.staticServerHost || 'static.ixiaochuan.cn';

const { ENV } = projectConfig.test;

const config = {
  entry: appServerIndex,
  output: {
    path: appServerOutput,
    filename: 'server.js',
    chunkFilename: '[name].js',
    library: 'app',
    libraryTarget: 'commonjs2',
    publicPath: `//${projectConfig.staticServerHost}/${projectConfig.project}_test/`,
  },
  mode: 'production',
  devtool: 'source-map',
  target: 'node',
  module: {
    rules: [loadScripts, ...loadAssets(true, ENV), ...loadStyles(true, ENV)],
  },
  plugins: plugins(ENV, true),
  resolve,
};

module.exports = config;
