const fs           = require('fs');
const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const polyfill   = require('gulp-autopolyfiller');
const merge      = require('event-stream').merge;
const order      = require('gulp-order');
const cleanCSS     = require('gulp-clean-css');
const concat       = require('gulp-concat');
const babel      = require('gulp-babel');
const concatCSS    = require('gulp-concat-css');
const rename       = require('gulp-rename');
const sass         = require('gulp-sass');
const sassGlob     = require('gulp-sass-glob');
const sourcemaps   = require('gulp-sourcemaps');
const uglify       = require('gulp-uglify');
const sync      	 = require('browser-sync').create();

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
			basename: 'build',
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./css/dist'));
});

gulp.task('watch-master-css', function() {
	gulp.watch('./css/src/*.scss', ['build-master-css']);
	gulp.watch('./css/src/*/*.scss', ['build-master-css']);
	gulp.watch('./css/src/pages/*.scss', ['build-master-css']);
	gulp.watch('../patterns/*/*.scss', ['build-master-css']);
});

gulp.task('build-master-js', function() {

	var files  = [];
	var ignore = [ '.gitignore', 'gulpfile.js', 'node_modules', 'package.json', '.DS_Store' ];

	var patterns = fs.readdirSync('../patterns');

	for ( var i = 0; i < patterns.length; i++ ) {

		var pattern = patterns[i];

		if ( ignore.indexOf(pattern) === -1 ) {

			var path      = '../patterns/' + pattern + '/';
			var pathFiles = fs.readdirSync(path);

			if ( pathFiles.indexOf(pattern + '.js') > -1 ) {
				files.push('../patterns/' + pattern + '/' + pattern + '.js')
			}
		}
	}

	files.push('./js/src/script.js');

	return gulp.src(files)
		.pipe(sourcemaps.init())
		.pipe(concat('build.min.js'))
		.pipe(uglify().on('error', console.log))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./js/dist'));
});

gulp.task('watch-master-js', function() {
	gulp.watch('../patterns/*/*.js', ['build-master-js']);
	gulp.watch('./js/src/script.js', ['build-master-js']);
});

gulp.task('css', ['build-master-css'], function() {

	return gulp.src([
		'./css/vendor/bootstrap.min.css',
		'./css/vendor/animate.min.css',
		'./css/vendor/jquery-ui.css',
		'./css/vendor/flag-icon.min.css',
		'./css/vendor/jquery.pagepilling.min.css',
		'./css/dist/build.min.css'
	])
		.pipe(concatCSS('master.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('./css/dist'))
		.pipe(sync.reload({
			stream: true
		}));
});

gulp.task('js', ['build-master-js'], function() {

	return gulp.src([
		'./js/vendor/jquery321.min.js',
		'./js/vendor/super-slider.min.js',
		'./js/vendor/bxslider.min.js',
		'./js/vendor/jquery.elevatezoom.min.js',
		'./js/vendor/jquery.pagepilling.min.js',
		'./js/vendor/wow.min.js',
		'./js/vendor/masonry.pkgd.min.js',
		'./js/vendor/js.cookie.min.js',
		'./js/vendor/jQuery.headroom.min.js',
		'./js/vendor/headroom.min.js',
		'./js/dist/build.min.js',
		'./js/vendor/bootstrap3.min.js',
		'./js/vendor/infobubble.js',

	])
		.pipe(concat('master.min.js'))
		.pipe(uglify().on('error', console.log))
		.pipe(gulp.dest('./js/dist'))
		.pipe(sync.stream());
});




// gulp.task('build-master-js', function() {
//
//     var all = gulp.src([
//
// 			'./js/vendor/*.min.js',
// 			'./js/vendor/*.js',
//       './js/src/*.js',
//       './js/src/**/*.js',
//       '../patterns/*/*.js',
//       '../patterns/**/*.js',
//   ])
//     .pipe(concat('all.js'))
//
//     .pipe(babel({
//         presets: [ 'es2015' ]
//     }))
//     .pipe(sourcemaps.init())
//
//     // Generate polyfills for all files
//     var polyfills = all
//     .pipe(polyfill('polyfills.js'));
//
//     // Merge polyfills and all normal JS
//     return merge(polyfills, all)
//         .pipe(order([
//             'polyfills.js',
//             'all.js'
//     ]))
//     // Build into single file
//      .pipe(concat('master.min.js'))
//
//     // Uglify and catch errors
//     .pipe(uglify().on('error', function(e){
//             console.log(e);
//      }))
//     .pipe(sourcemaps.write('maps'))
//     .pipe(gulp.dest('./js/dist'))
//     .pipe(sync.stream());
//
// });






gulp.task('watch', ['sync', 'css', 'js'], function() {

	gulp.watch('./css/src/*.scss', ['css']);
	gulp.watch('./css/src/*/*.scss', ['css']);
	gulp.watch('./css/src/pages/*.scss', ['css']);
	gulp.watch('../patterns/*/*.scss', ['css']);

	gulp.watch('../patterns/*/*.js', ['js']);
	gulp.watch('./js/src/script.js', ['js']);

	gulp.watch('./js/src/vendor/*.js', ['js']);

	// SCSS
	gulp.watch('../patterns/*/*.scss').on('change', sync.reload);

	// JS
	gulp.watch('../patterns/*/*.js').on('change', sync.reload);

	// PHP
	gulp.watch('../patterns/*/*.php').on('change', sync.reload);

});

// Default 'gulp' task
gulp.task('default',['watch']);

// Create BrowserSync
gulp.task('sync', function() {
  sync.init({
		proxy: "http://localhost:8888/crucial",
		reloadOnRestart: true,
  })
})

gulp.task('ie9', function() {

	return gulp.src('./css/src/ie9.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./css/dist'));
});

gulp.task('watch-ie9', function() {

	gulp.watch('./css/src/ie9.scss', ['ie9']);

});
