const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel        = require('gulp-babel');
const concat       = require('gulp-concat');
const cssnano      = require('gulp-cssnano');
const rename       = require('gulp-rename');
const sass         = require('gulp-sass');
const sassGlob     = require('gulp-sass-glob');
const sourcemaps   = require('gulp-sourcemaps');
const uglify       = require('gulp-uglify');
const util         = require('gulp-util');

gulp.task('css', function() {

	return gulp.src('./css/src/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(rename({ suffix: '.min' }))
		.pipe(cssnano({
			zindex: false
		}))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./css/dist'));
});

gulp.task('js', function() {

	gulp.src([
		'./js/src/rugBuilder.js',
		'./js/src/startRugbuilder.js',
		'./js/src/init.js',
		'./js/src/data/structures.data.js',
		'./js/src/functions/ajax.function.js',
		'./js/src/functions/displayTexture.function.js',
		'./js/src/functions/error.function.js',
		'./js/src/functions/loadingScreens.function.js',
		'./js/src/components/*.js',
		'./js/src/components/drawer/*.js',
		'./js/src/components/progress-menu/*.js'
	])
		.pipe(sourcemaps.init())
		.pipe(concat('rugBuilder.min.js'))
		.pipe(babel({
			presets: [ 'es2015', 'react' ]
		}))
		.pipe(uglify().on('error', util.log))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./js/dist'));
});

gulp.task('js-prod', function() {

	gulp.src([
		'./js/src/rugBuilder.js',
		'./js/src/startRugbuilder.js',
		'./js/src/init.js',
		'./js/src/data/structures.data.js',
		'./js/src/functions/ajax.function.js',
		'./js/src/functions/displayTexture.function.js',
		'./js/src/functions/error.function.js',
		'./js/src/functions/loadingScreens.function.js',
		'./js/src/components/*.js',
		'./js/src/components/drawer/*.js',
		'./js/src/components/progress-menu/*.js'
	])
		.pipe(sourcemaps.init())
		.pipe(concat('rugBuilder.min.js'))
		.pipe(babel({
			presets: [ 'es2015', 'react' ]
		}))
		.pipe(uglify().on('error', util.log))
		.pipe(gulp.dest('./js/dist'));
});

gulp.task('watch', function() {

	gulp.watch('./css/src/style.scss',               ['css']);
	gulp.watch('./css/src/base/*.scss',              ['css']);
	gulp.watch('./css/src/components/*.scss',        ['css']);
	gulp.watch('./css/src/components/drawer/*.scss', ['css']);

	gulp.watch('./js/src/*.js',                          ['js']);
	gulp.watch('./js/src/data/*.js',                     ['js']);
	gulp.watch('./js/src/functions/*.js',                ['js']);
	gulp.watch('./js/src/components/*.js',               ['js']);
	gulp.watch('./js/src/components/drawer/*.js',        ['js']);
	gulp.watch('./js/src/components/progress-menu/*.js', ['js']);
})