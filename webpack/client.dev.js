const ip = require('ip');
const { appIndex, appDistAssets } = require('../utils/paths');
const { loadScripts, loadAssets, loadStyles, optimization, plugins, resolve } = require('./parts');

const [ASSETPORT, ENVIRONMENT] = [process.env.ASSETPORT, process.env.ENVIRONMENT];
const host = ip.address();

const configuration = {
  entry: {
    app: appIndex,
  },
  output: {
    path: appDistAssets,
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: `http://${host}:${ASSETPORT}/`,
    clean: true,
  },
  mode: 'development',
  module: {
    rules: [loadScripts, ...loadAssets(false, ENVIRONMENT), ...loadStyles(false, ENVIRONMENT)],
  },
  optimization,
  plugins: plugins(ENVIRONMENT),
  devtool: false,
  target: ['web', 'es2015'],
  resolve,
};

module.exports = configuration;
