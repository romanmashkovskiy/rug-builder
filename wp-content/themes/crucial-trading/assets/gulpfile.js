const fs           = require('fs');
const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
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
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./css/dist'));
});

gulp.task('watch-master-css', function() {
	gulp.watch('./css/src/*.scss', ['build-master-css']);
	gulp.watch('./css/src/*/*.scss', ['build-master-css']);
});

gulp.task('build-pages-css', function() {

	var files  = fs.readdirSync('./css/src/pages');
	var gulps  = [];
	var ignore = [ '.gitignore', '.DS_Store' ];

	for ( var i = 0; i < files.length; i++ ) {

		if ( ignore.indexOf(files[i]) === -1 ) {

			var thisGulp = gulp.src('./css/src/pages/' + files[i])
				.pipe(sourcemaps.init())
				.pipe(sassGlob())
				.pipe(sass({
					outputStyle: 'compressed'
				})
				.on('error', sass.logError))
				.pipe(autoprefixer())
				.pipe(rename({
					basename: files[i].substr(0, files[i].length-5),
					suffix: '.min'
				}))
				.pipe(sourcemaps.write('maps'))
				.pipe(gulp.dest('./css/dist/pages/'));

			gulps.push(thisGulp)
		}
	}

	return gulps;
});

gulp.task('watch-pages-css', function() {
	gulp.watch('./css/src/pages/*.scss', ['build-pages-css']);
});