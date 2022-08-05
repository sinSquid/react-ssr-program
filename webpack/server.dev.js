const ip = require('ip');
const { loadScripts, loadAssets, loadStyles, plugins, resolve } = require('./parts');
const { appServerOutput, appServerIndex } = require('../utils/paths');

const [PORT, ENVIRONMENT] = [process.env.PORT, process.env.ENVIRONMENT];
const host = ip.address();

const config = {
  entry: appServerIndex,
  output: {
    path: appServerOutput,
    filename: 'server.js',
    chunkFilename: '[name].[chunkhash].js',
    library: 'app',
    libraryTarget: 'commonjs2',
    publicPath: `http://${host}:${PORT}/`,
  },
  mode: 'development',
  devtool: 'source-map',
  target: 'node',
  module: {
    rules: [loadScripts, ...loadAssets(true, ENVIRONMENT), ...loadStyles(true, ENVIRONMENT)],
  },
  plugins: plugins(ENVIRONMENT, true),
  resolve,
};

module.exports = config;
