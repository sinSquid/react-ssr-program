const webpack = require('webpack');

const build = config =>
  new Promise((res, rej) => {
    webpack(config, (err, stats) => {
      if (err) {
        rej(err);
      } else {
        res();
        process.stdout.write(
          `${stats.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false,
          })}\n\n`
        );
        if (stats.hasErrors()) {
          console.log('  Build failed with errors.\n');
          process.exit(1);
        }
      }
    });
  });

module.exports = function webpackBuild(configs) {
  return Promise.all(configs.map(build));
};
