const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsconfig = require('./tsconfig.json');
const del = require('del');
const babel = require('gulp-babel');
const webpack = require('webpack');
const path = require('path');

function clean() {
  return del('lib/**');
}

function buildES() {
  const tsCompiler = ts({
    ...tsconfig.compilerOptions,
    module: 'ES6',
  });

  return gulp.src('src/**/*.{ts,tsx}').pipe(tsCompiler).pipe(gulp.dest('lib/es/'));
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

function buildUMD() {
  webpack({
    entry: path.resolve(__dirname, 'lib/es/index.js'),
    output: {
      filename: 'tang-components.js',
      library: {},
    },
  });
}

exports.default = gulp.series(clean, buildES, buildCJS, buildDecalration);
