var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

gulp.task('vendor:bootstrap', gulp.series(function() {
  return gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ]).pipe(gulp.dest('./dist/vendor/bootstrap'))
}));

gulp.task('vendor:jquery', gulp.series(function() {
  return gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ]).pipe(gulp.dest('./dist/vendor/jquery'))
}));

gulp.task('vendor:jquery:easing', gulp.series(function() {
  return gulp.src([
      './node_modules/jquery.easing/*.js'
    ]).pipe(gulp.dest('./dist/vendor/jquery-easing'))
}));

gulp.task('vendor:mockups:css', gulp.series(function() {
  return gulp.src([
      './node_modules/html5-device-mockups/dist/**'
    ]).pipe(gulp.dest('./dist/vendor/html5-device-mockups/css'))
}));

gulp.task('vendor:mockups:img', gulp.series(function() {
  return gulp.src([
      './node_modules/html5-device-mockups/device-mockups/**'
    ]).pipe(gulp.dest('./dist/vendor/html5-device-mockups/device-mockups'))
}));

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', gulp.series(['vendor:bootstrap', 'vendor:jquery', 'vendor:jquery:easing', 'vendor:mockups:css', 'vendor:mockups:img']));

// Compile SCSS
gulp.task('css:compile', gulp.series(function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
}));

// Minify CSS
gulp.task('css:minify', gulp.series(['css:compile'], function() {
  return gulp.src([
      './dist/css/*.css',
      '!./dist/css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
}));

// CSS
gulp.task('css', gulp.series(['css:compile', 'css:minify']));

// Minify JavaScript
gulp.task('js:minify', gulp.series(function() {
  return gulp.src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
}));

// JS
gulp.task('js', gulp.series(['js:minify']));

// Index
gulp.task('index', gulp.series(function() {
  return gulp.src([
      './index.html'
    ]).pipe(gulp.dest('./dist'))
}));

// Images
gulp.task('img', gulp.series(function() {
  return gulp.src([
      './img/**/*'
    ]).pipe(gulp.dest('./dist/img'))
}));

// Default task
gulp.task('default', gulp.parallel(['vendor', 'css', 'js', 'index', 'img']));
gulp.task('build', gulp.parallel(['vendor', 'css', 'js', 'index', 'img']));

// Configure the browserSync task
gulp.task('browserSync', gulp.series(function() {
  return browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
}));

// Dev task
gulp.task('dev', gulp.parallel(['css', 'js', 'browserSync'], function() {
  gulp.watch('./scss/*.scss', gulp.series('css'));
  gulp.watch('./js/*.js', gulp.series('js'));
  gulp.watch('./*.html', gulp.series('index'));
  gulp.watch('./dist/*.html', browserSync.reload);
}));
