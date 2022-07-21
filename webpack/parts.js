const ip = require('ip');
const LoadablePlugin = require('@loadable/webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { appConfig, appNodeModules, appSrc, appTypes } = require('../utils/paths');

const [PORT, host] = [process.env.PORT, ip.address()];

exports.loadScripts = {
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: appNodeModules,
  loader: 'babel-loader',
  options: {
    sourceType: 'unambiguous',
    presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'],
    plugins: [
      ['@loadable/babel-plugin'],
      [
        'import',
        {
          libraryName: 'lodash-es',
          libraryDirectory: '',
          camel2DashComponentName: false,
        },
        'lodash-es',
      ],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-transform-runtime'],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    ],
  },
};

exports.loadAssets = (isServer, env) => [
  {
    test: /\.(jpg|png|jpeg|svg|mp4|mp3|webp|gif|ttf|otf|woff|woff2|svga|apng)$/,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 4 * 1024, // 4kb
      },
    },
    generator: {
      emit: !isServer,
    },
  },
  {
    test: /\.(ico)$/,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 0, // 全部生成独立文件
      },
    },
    generator: {
      emit: true,
      filename: '[name][ext]',
      publicPath: env === 'development' ? `http://${host}:${PORT}/` : '/',
    },
  },
];

exports.loadStyles = (isServer, env) => {
  // RegExps for Style Sheets
  const regexCssGlobal = /(?<!\.module)\.css$/;
  const regexCssModules = /\.module\.css$/;

  // RegExps for Style Sheets
  const regexLessGlobal = /(?<!\.module)\.less$/;
  const regexLessModules = /\.module\.less$/;

  const cssExtract = isServer ? [] : [MiniCssExtractPlugin.loader];

  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: {
      sourceMap: true,
    },
  };

  const cssModuleLoader = {
    loader: require.resolve('css-loader'),
    options: {
      modules: {
        localIdentName: '[name]__[local]__[hash:base64:5]',
        exportOnlyLocals: isServer,
      },
      sourceMap: true,
    },
  };

  const postCssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: [require.resolve('autoprefixer')],
      },
    },
  };

  const lessLoader = {
    loader: require.resolve('less-loader'),
    options: {
      lessOptions: {
        javascriptEnabled: true,
      },
    },
  };

  const dtsLoader =
    env === 'development' && !isServer
      ? [
          {
            loader: require.resolve('dts-css-modules-loader'),
            options: {
              dropEmptyFile: true,
              customTypings: classes => {
                let content = 'declare const styles: {\n';
                for (const c of classes) {
                  content += `  ['${c}']: string\n`;
                }
                content += '}\nexport default styles\n';
                return content;
              },
            },
          },
        ]
      : [];

  return [
    {
      test: regexCssModules,
      sideEffects: true,
      use: [...cssExtract, ...dtsLoader, cssModuleLoader],
    },
    {
      test: regexLessModules,
      use: [...cssExtract, ...dtsLoader, cssModuleLoader, postCssLoader, lessLoader],
    },
    {
      test: regexCssGlobal,
      sideEffects: true,
      use: [...cssExtract, ...dtsLoader, cssLoader],
    },
    {
      test: regexLessGlobal,
      use: [...cssExtract, ...dtsLoader, cssLoader, postCssLoader, lessLoader],
    },
  ];
};

exports.optimization = {
  splitChunks: {
    chunks: 'initial',
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 6,
    maxInitialRequests: 3,
    automaticNameDelimiter: '-',
    cacheGroups: {
      vendors: {
        name: 'vendors',
        test: /node_modules.+(?<!css)$/,
        chunks: 'initial',
        priority: 10,
        enforce: true,
      },
    },
  },
};

exports.plugins = (opt, isServer) => {
  const { ENVIRONMENT, PLATFORM, LOCALE } = opt;
  const webpackPlugins = [
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(ENVIRONMENT),
      PLATFORM,
      LOCALE,
    }),
  ];
  if (isServer) {
    webpackPlugins.push(
      // 只需要加进一端，否则会提示两次，加入node端也会提示浏览器端的错误
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: 'write-references',
        },
      })
    );
  } else {
    const cssFileName = ENVIRONMENT === 'development' ? '[name].css' : '[name].[contenthash].css';
    webpackPlugins.push(
      new MiniCssExtractPlugin({
        filename: cssFileName,
        chunkFilename: cssFileName,
        ignoreOrder: true,
      }),
      new LoadablePlugin({ writeToDisk: true })
    );
  }
  return webpackPlugins;
};

exports.resolve = {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  alias: {
    '~@': appSrc,
    '~CONF': appConfig,
    '~#': appTypes,
  },
};

exports.cache = filename => ({
  type: 'filesystem',
  buildDependencies: {
    config: [filename],
  },
  profile: true,
});
