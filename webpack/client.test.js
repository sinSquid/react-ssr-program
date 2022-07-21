const { loadScripts, loadAssets, loadStyles, optimization, plugins, resolve } = require('./parts');
const { appIndex, appDistAssets, appConfig } = require('../utils/paths');

const projectConfig = require(appConfig);

projectConfig.staticServerHost =
  projectConfig.test.staticServerHost || projectConfig.staticServerHost || 'static.ixiaochuan.cn';

projectConfig.staticServerName =
  projectConfig.test.staticServerName || projectConfig.staticServerName;

const { ENV } = projectConfig.test;

const configuration = {
  entry: {
    app: appIndex,
  },
  output: {
    path: appDistAssets,
    publicPath: `//${projectConfig.staticServerHost}/${projectConfig.project}_test/`,
    filename: '[name].[contenthash:10].js',
    chunkFilename: '[name].[contenthash:10].js',
  },
  mode: 'production',
  module: {
    rules: [loadScripts, ...loadAssets(false, ENV), ...loadStyles(false, ENV)],
  },
  optimization,
  plugins: [...plugins(ENV)],
  devtool: 'source-map',
  target: ['web', 'es2015'],
  resolve,
};

module.exports = configuration;
