// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/paths.js

const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

module.exports = {
  appRoot: resolveApp('.'),
  appNodeModules: resolveApp('node_modules'),
  appPackageJson: resolveApp('package.json'),
  appWebpackConfig: fs.existsSync(resolveApp('webpack.config.js'))
    ? resolveApp('webpack.config.js')
    : null,

  appSrc: resolveApp('src'),
  appConfig: resolveApp('config'),
  appTypes: resolveApp('types'),
  appIndex: resolveApp('src/entry/index'),
  appHtml: resolveApp('src/entry/index.html'),

  appDist: resolveApp('dist'),
  appDistAssets: resolveApp('dist/assets'),
  appDistAssetsWebpackChunksJson: resolveApp('dist/assets/webpack-chunks.json'),
  appDistAssetsLoadJson: resolveApp('dist/assets/loadable-stats.json'),
  appServerIndex: resolveApp('src/server/index'),
  appServerOutput: resolveApp('dist/server'),
  appServerOutputServerJs: resolveApp('dist/server/server.js'),

  appWebpackCache: resolveApp('node_modules/.cache/webpack'),
};

module.exports.moduleFileExtensions = moduleFileExtensions;
