﻿(function() {
  var content, gulp, gutil, handleErrors, inject, injectTask, logger, notify, path, rename, src, wiredep, wiredepStream;

  gulp = require('gulp');

  gutil = require('gulp-util');

  rename = require('gulp-rename');

  path = require('path');

  wiredep = require('wiredep');

  wiredepStream = wiredep.stream;

  inject = require('gulp-inject');

  handleErrors = require('../util/handleErrors');

  logger = require('../util/bundleLogger');

  notify = require('../util/notify');

  content = require('../util/files');

  src = ['./src/less/**/*.css', './src/css/**/*.css'];

  injectTask = function(path, pageName, sourceFiles, exclude, includeDevDependencies) {
    if (path == null) {
      path = '';
    }
    if (pageName == null) {
      pageName = '';
    }
    if (sourceFiles == null) {
      sourceFiles = [];
    }
    if (exclude == null) {
      exclude = [];
    }
    if (includeDevDependencies == null) {
      includeDevDependencies = false;
    }
    return gulp.src(path + '/' + pageName + '.tmpl').pipe(rename({
      extname: '.html'
    })).pipe(inject(gulp.src(sourceFiles, {
      read: false
    }), {
      addRootSlash: false,
      addPrefix: '..'
    })).pipe(wiredepStream({
      exclude: exclude,
      devDependencies: includeDevDependencies
    })).pipe(gulp.dest(path)).pipe(notify.message(pageName + '.html includes dynamically injected.')).on('error', handleErrors);
  };

  gulp.task('inject-dev', function() {
    return injectTask('./', 'dev', src.concat(['./src/icons/pictoicons/css/picto.css']), [/google/, /backbone/, /underscore/, /require/, /jquery.min.js/, /jqueryy-migrate/, /jquery-ui/, /raygun4js/]);
  });

  gulp.task('inject-test', function() {
    return injectTask('./', 'test', src.concat(['./src/icons/pictoicons/css/picto.css']), [/google/, /backbone/, /underscore/, /require/, /jquery.min.js/, /jqueryy-migrate/, /jquery-ui/, /raygun4js/]);
  });

  gulp.task('inject-release', function() {
    return injectTask('./', 'index', src.concat(['./src/icons/pictoicons/css/picto.css']), [/[.]js$/, /google/]);
  });

  gulp.task('inject-all', ['inject-dev', 'inject-test', 'inject-release']);

}).call(this);
