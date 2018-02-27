const argv       = require('yargs').argv;
const fs         = require('fs');
const merge      = require('event-stream').merge;
const sync       = require('browser-sync').create();
const gulp       = require('gulp');
const babel      = require('gulp-babel');
const concat     = require('gulp-concat');
//const git        = require('gulp-git');
const glob       = require('gulp-sass-glob');
const order      = require('gulp-order');
const polyfill   = require('gulp-autopolyfiller');
const prefix     = require('gulp-autoprefixer');
const rename     = require('gulp-rename');
const sass       = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify     = require('gulp-uglify');


// Watch Command
gulp.task('watch', ['sync', 'css-dev', 'js-dev', 'css-prod'], function(){

	// CSS
	gulp.watch('./assets/css/src/*.scss', ['css-dev']);
	gulp.watch('./assets/css/src/*/*.scss', ['css-dev']);
	gulp.watch('./assets/css/src/pages/*.scss', ['css-dev']);
	gulp.watch('./patterns/*/*.scss', ['css-dev']);
	gulp.watch('./patterns/*/*.css', ['css-dev']);

	// JS
	gulp.watch('./patterns/*/*.js', ['js-dev']);
	gulp.watch('./assets/js/src/script.js', ['js-dev']);
	gulp.watch('./assets/js/vendor/*.min.js', ['js-dev']);
	gulp.watch('./assets/js/src/pages/*.js', ['js-dev']);

  // PHP
	gulp.watch('./*.php').on('change', sync.reload);
	gulp.watch('./inc/*.php').on('change', sync.reload);
	gulp.watch('./inc/*/*.php').on('change', sync.reload);
	gulp.watch('./assets/src/js/src/*.js').on('change', sync.reload);
	gulp.watch('./page-templates/*.php').on('change', sync.reload);
	gulp.watch('./patterns/*/*.php').on('change', sync.reload);
})


// Default 'gulp' task
gulp.task('default',['watch', 'build-vendor-js']);


// Build Final
gulp.task('build', ['css-prod', 'js-prod']);


// Create BrowserSync
gulp.task('sync', function() {
  sync.init({
		proxy: "http://localhost:8888/crucial",
		reloadOnRestart: true,
  })
})


// Build CSS (Dev)
gulp.task('css-dev', function(){
  return gulp.src('./assets/css/src/global.scss')
		.pipe(sourcemaps.init())
		.pipe(glob())
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', sass.logError))
    .pipe(prefix())
		.pipe(concat('build.min.css'))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./assets/dev/css'))
		.pipe(sync.reload({
			stream: true
		}))
});

// Build vendor js files
gulp.task('build-vendor-js', function() {

    var all = gulp.src([
			'./assets/js/vendor/jquery-3.min.js',
			'./assets/js/vendor/bootstrap3.min.js',

			'./assets/js/vendor/jquery.elevatezoom.min.js',
			'./assets/js/vendor/jquery.pagepilling.min.js',
			'./assets/js/vendor/wow.min.js',
			'./assets/js/vendor/masonry.pkgd.min.js',
			'./assets/js/vendor/js.cookie.min.js',
			'./assets/js/vendor/jQuery.headroom.min.js',
			'./assets/js/vendor/headroom.min.js',
			'./assets/js/vendor/WeakMap.min.js',
			'./assets/js/vendor/MutationObserver.min.js',
			'./assets/js/vendor/masonry.pkgd.min.js',
			'./assets/js/vendor/skrollr.min.js',
			'./assets/js/vendor/super-slider.min.js',
			//'./assets/js/dist/build.min.js',

			'./assets/js/vendor/infobubble.min.js',
			'./assets/js/vendor/froogalop2.min.js',
			'./assets/js/vendor/jquery.bxslider.min.js',
		])
    .pipe(concat('all.js'))

    // Generate polyfills for all files
    var polyfills = all
             .pipe(polyfill('polyfills.js'));

    // Merge polyfills and all normal JS
    return merge(polyfills, all)
        .pipe(order([
            'polyfills.js',
            'all.js'
    ]))
    // Build into single file
     .pipe(concat('vendor.min.js'))

    // Uglify and catch errors
    .pipe(uglify().on('error', function(e){
            console.log(e);
     }))
    .pipe(gulp.dest('./assets/js/dist'))
    .pipe(sync.stream());

});


// Build CSS (Production)
gulp.task('css-prod', function() {

	return gulp.src('./assets/css/src/global.scss')
		.pipe(glob())
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', sass.logError))
		.pipe(prefix())
		.pipe(rename({
			basename: 'master',
			suffix: '.min'
		}))
		.pipe(gulp.dest('./assets/css/dist'));

});


// Build JS (Dev)
gulp.task('js-dev', function() {

    var all = gulp.src([
      './assets/js/src/*.js',
			'./assets/js/navigation.js',
			//'./assets/js/customizer.js',
      './assets/js/src/**/*.js',
      './patterns/*/*.js',
      './patterns/**/*.js',
  ])
    .pipe(concat('all.js'))

    .pipe(babel({
        presets: [ 'es2015' ]
    }))
    .pipe(sourcemaps.init())

    // Generate polyfills for all files
    var polyfills = all
             .pipe(polyfill('polyfills.js'));

    // Merge polyfills and all normal JS
    return merge(polyfills, all)
        .pipe(order([
            'polyfills.js',
            'all.js'
    ]))
    // Build into single file
     .pipe(concat('master.min.js'))

    // Uglify and catch errors
    .pipe(uglify().on('error', function(e){
            console.log(e);
     }))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./assets/js/dist'))
    .pipe(sync.stream());

});

// Build JS (Prod)
gulp.task('js-prod', function() {

    var all = gulp.src([
      './assets/js/src/*.js',
      './assets/js/src/**/*.js',
      './patterns/*/*.js',
      './patterns/**/*.js',
  ])
    .pipe(concat('all.js'))

    .pipe(babel({
        presets: [ 'es2015' ]
    }))

    // Generate polyfills for all files
    var polyfills = all
             .pipe(polyfill('polyfills.js'));

    // Merge polyfills and all normal JS
    return merge(polyfills, all)
        .pipe(order([
            'polyfills.js',
            'all.js'
    ]))
    // Build into single file
     .pipe(concat('master.min.js'))

    // Uglify and catch errors
    .pipe(uglify().on('error', function(e){
            console.log(e);
     }))
    .pipe(gulp.dest('./assets/js/dist'))
    .pipe(sync.stream());

});
