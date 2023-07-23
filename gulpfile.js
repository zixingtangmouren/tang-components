const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsconfig = require('./tsconfig.json');
const del = require('del');
const babel = require('gulp-babel');
const webpack = require('webpack');
const path = require('path');
const less = require('gulp-less');

function clean() {
  return del('lib/**');
}

function buildES() {
  const tsCompiler = ts({
    ...tsconfig.compilerOptions,
    module: 'ES6',
  });

  return gulp
    .src('src/**/*.{ts,tsx}')
    .pipe(tsCompiler)
    .pipe(babel({ plugins: ['./babel-transform-less-to-css'] }))
    .pipe(gulp.dest('lib/es/'));
}

function buildCJS() {
  return gulp
    .src('lib/es/**/*.js')
    .pipe(
      babel({
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      }),
    )
    .pipe(gulp.dest('lib/cjs/'));
}

function buildDecalration() {
  const tsCompiler = ts({
    ...tsconfig.compilerOptions,
    module: 'ES6',
    declaration: true,
    emitDeclarationOnly: true,
  });

  return gulp.src('src/**/*.{ts,tsx}').pipe(tsCompiler).pipe(gulp.dest('lib/es/')).pipe(gulp.dest('lib/cjs/'));
}

function buildStyles() {
  return gulp.src(['src/**/*.less']).pipe(less()).pipe(gulp.dest('lib/es/')).pipe(gulp.dest('lib/cjs/'));
}

function buildUMD(cb) {
  const compiler = webpack({
    entry: path.resolve(__dirname, 'lib/es/index.js'),
    output: {
      filename: 'tang-components.js',
      library: {
        name: 'tangComponents',
        type: 'umd',
      },
      path: path.resolve(__dirname, 'lib/umd'),
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {}], '@babel/preset-react'],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json'],
    },
    externals: [
      {
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'react',
          root: 'React',
        },
      },
    ],
  });

  compiler.run();

  compiler.hooks.done.tap('buildUMDTask', () => {
    cb();
  });
}

exports.default = gulp.series(clean, buildES, buildCJS, gulp.parallel(buildStyles, buildDecalration), buildUMD);
