const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsconfig = require('./tsconfig.json');
const del = require('del');

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

exports.default = gulp.series(clean, buildES);
