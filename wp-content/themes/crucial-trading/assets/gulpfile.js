const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cssnano      = require('gulp-cssnano');
const rename       = require('gulp-rename');
const sass         = require('gulp-sass');
const sassGlob     = require('gulp-sass-glob');
const sourcemaps   = require('gulp-sourcemaps');

gulp.task('build-master-css', function() {

	return gulp.src('./css/src/global.scss')
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(rename({
			basename: 'master',
			suffix: '.min'
		}))
		.pipe(cssnano())
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./css/dist'));
});

gulp.task('watch-master-css', function() {
	gulp.watch('./css/src/*.scss', ['build-master-css']);
	gulp.watch('./css/src/*/*.scss', ['build-master-css']);
});