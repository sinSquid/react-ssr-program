import { loadScripts, loadAssets, loadStyles, optimization, plugins, resolve } from './parts';
import { appIndex, appDistAssets, appConfig } from '../utils/paths';

const projectConfig = require(appConfig);

const { ENV } = projectConfig.production;

const configuration = {
  entry: {
    app: appIndex,
  },
  output: {
    path: appDistAssets,
    publicPath: `//${projectConfig.staticServerHost}/${projectConfig.project}/`,
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
  resolve,
  target: ['web', 'es2015'], // 个人试验追求效率,实际项目调整为es5
};

module.exports = configuration;
