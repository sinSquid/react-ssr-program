const { loadScripts, loadAssets, loadStyles, plugins, resolve } = require('./parts');
const { appConfig, appServerOutput, appServerIndex } = require('../utils/paths');

const projectConfig = require(appConfig);
projectConfig.staticServerHost = projectConfig.staticServerHost || 'static.ixiaochuan.cn';

const { ENV } = projectConfig.production;

const config = {
  entry: appServerIndex,
  output: {
    path: appServerOutput,
    filename: 'server.js',
    chunkFilename: '[name].js',
    library: 'app',
    libraryTarget: 'commonjs2',
    publicPath: `//${projectConfig.staticServerHost}/${projectConfig.project}/`,
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
