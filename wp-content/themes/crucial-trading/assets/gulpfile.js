const fs           = require('fs');
const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat       = require('gulp-concat');
const rename       = require('gulp-rename');
const sass         = require('gulp-sass');
const sassGlob     = require('gulp-sass-glob');
const sourcemaps   = require('gulp-sourcemaps');
const uglify       = require('gulp-uglify');

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
		.pipe(concat('master.min.js'))
		.pipe(uglify().on('error', console.log))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./js/dist'));
});

gulp.task('watch-master-js', function() {
	gulp.watch('../patterns/*/*.js', ['build-master-js']);
	gulp.watch('./js/src/script.js', ['build-master-js']);
});