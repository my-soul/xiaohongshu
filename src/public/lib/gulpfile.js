var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var cleancss = require('gulp-clean-css');
var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');

 
gulp.task('sass', function () {
  return gulp.src('./base.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
    }))
    .pipe(csscomb())
    .pipe(cleancss())
    .pipe(gulp.dest('./'));
});


//{outputStyle: 'compressed'}
 
gulp.task('default', ['sass']);
