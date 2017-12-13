const gulp          = require('gulp');
const autoprefixer  = require('gulp-autoprefixer');
const babel         = require('gulp-babel');
const concat        = require('gulp-concat');
const cssnano       = require('gulp-cssnano');
const js_obfuscator = require('gulp-js-obfuscator');
const rename        = require('gulp-rename');
const sass          = require('gulp-sass');
const sassGlob      = require('gulp-sass-glob');
const sourcemaps    = require('gulp-sourcemaps');
const uglify        = require('gulp-uglify');
const util          = require('gulp-util');
var plumber = require('gulp-plumber');

/**
 *
 */
gulp.task('css', function() {
	return gulp.src('./css/src/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(rename('hospitality-builder.min.css'))
		.pipe(cssnano({
			zindex: false
		}))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('../dist'));
});

gulp.task('css-prod', function() {
	return gulp.src('./css/src/style.scss')
		.pipe(sassGlob())
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(rename('hospitality-builder.min.css'))
		.pipe(cssnano({
			zindex: false
		}))
		.pipe(gulp.dest('../dist'));
});

/**
 *
 */
gulp.task('js', function() {
	console.log('watch js');

	gulp.src([
		'./js/src/rugBuilder.js',
		'./js/src/startRugbuilder.js',
		'./js/src/App.js',
		'./js/src/store/index.js',
		'./js/src/store/*.js',
		'./js/src/store/*/*.js',
		'./js/src/*.js',
		'./js/src/*/*.js',
		'./js/src/init.js',
		'./js/src/data/structures.data.js',
		'./js/src/functions/ajax.function.js',
		'./js/src/functions/addDOMElements.function.js',
		'./js/src/functions/calculateContainerHeight.function.js',
		'./js/src/functions/loadingScreens.function.js',
		'./js/src/components/*.js',
		'./js/src/components/*/*.js',
		'./js/src/components/drawer/*.js',
		'./js/src/components/drawer/child-components/*.js',
		'./js/src/components/progress-menu/*.js',
		'./js/src/components/progress-menu/child-components/*.js',
		'./js/src/components/summary/*.js',
	])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({ presets: ['es2015', 'es2016', 'react', 'stage-0'] }))
		.pipe(concat('hospitality-builder.min.js'))
		// .pipe(babel({ presets: [ 'es2015', 'react' ] }))
		.pipe(uglify())
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('../dist'));
});


gulp.task('js-prod', function() {
	gulp.src([
		'./js/src/rugBuilder.js',
		'./js/src/startRugbuilder.js',
		'./js/src/init.js',
		'./js/src/data/structures.data.js',
		'./js/src/functions/ajax.function.js',
		'./js/src/functions/addDOMElements.function.js',
		'./js/src/functions/calculateContainerHeight.function.js',
		'./js/src/functions/loadingScreens.function.js',
		'./js/src/components/*.js',
		'./js/src/components/drawer/*.js',
		'./js/src/components/progress-menu/*.js'
	])
		.pipe(concat('hospitality-builder.min.js'))
		.pipe(babel({
			presets: [ 'es2015', 'react' ]
		}))
		.pipe(uglify().on('error', util.log))
		.pipe(js_obfuscator({}))
		.pipe(gulp.dest('./js/dist'));
});

// AJAX

gulp.task('js-loader', function() {
	gulp.src([
		'./loader/rugbuilder-loader.js',
	])
		.pipe(rename({ suffix : '.min' }))
		.pipe(babel({
			presets: [ 'es2015' ]
		}))
		.pipe(uglify().on('error', util.log))
		.pipe(gulp.dest('./loader'));
});

// Obs

gulp.task('hosp-loader', function() {
	gulp.src([
		'./loader/hospitality-loader.js',
	])
		.pipe(rename({ suffix : '.min' }))
		.pipe(uglify().on('error', util.log))
		.pipe(js_obfuscator({}))
		.pipe(gulp.dest('./loader'));
});

gulp.task('watch', function() {
	gulp.watch('./css/src/style.scss',               ['css']);
	gulp.watch('./css/src/*.scss', ['css']);
	
	gulp.watch('./css/src/base/*.scss',              ['css']);
	gulp.watch('./css/src/canvas.scss', ['css']);
	gulp.watch('./css/src/components/*.scss',        ['css']);
	gulp.watch('./css/src/components/drawer/*.scss', ['css']);

	gulp.watch('./js/src/*.js',                          ['js']);
	gulp.watch('./js/src/store/*.js', ['js']);
	gulp.watch('./js/src/store/*/*.js', ['js']);
	gulp.watch('./js/src/data/*.js',                     ['js']);
	gulp.watch('./js/src/functions/*.js',                ['js']);
	gulp.watch('./js/src/components/*.js',               ['js']);
	gulp.watch('./js/src/components/*/*.js', ['js']);
	gulp.watch('./js/src/components/drawer/*.js',        ['js']);
	gulp.watch('./js/src/components/drawer/child-components/*.js', ['js']);
	gulp.watch('./js/src/components/progress-menu/*.js', ['js']);
	gulp.watch('./js/src/components/progress-menu/child-components/*.js', ['js']);
	gulp.watch('./js/src/components/summary/*.js', ['js']);
})

gulp.task('watch-prod', function() {

	gulp.watch('./css/src/style.scss',               ['css-prod']);
	gulp.watch('./css/src/base/*.scss',              ['css-prod']);
	gulp.watch('./css/src/components/*.scss',        ['css-prod']);
	gulp.watch('./css/src/components/drawer/*.scss', ['css-prod']);

	gulp.watch('./js/src/*.js',                          ['js-prod']);
	gulp.watch('./js/src/data/*.js',                     ['js-prod']);
	gulp.watch('./js/src/functions/*.js',                ['js-prod']);
	gulp.watch('./js/src/components/*.js',               ['js-prod']);
	gulp.watch('./js/src/components/drawer/*.js',        ['js-prod']);
	gulp.watch('./js/src/components/progress-menu/*.js', ['js-prod']);
})
