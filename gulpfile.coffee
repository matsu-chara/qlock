gulp = require 'gulp'

browserify = require 'browserify'
source = require 'vinyl-source-stream'

gulp.task 'script', ->
  browserify
    entries: ['./src/main.js']
  .bundle()
  .pipe source 'main.js'
  .pipe gulp.dest './deploy/js'
