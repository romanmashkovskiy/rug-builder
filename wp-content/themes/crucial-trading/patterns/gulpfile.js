var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    sass          = require('gulp-sass'),
    fs            = require('fs');

gulp.task('build-patterns-css', function() {

	var files = fs.readdirSync('./');
	var gulps = [];

	for ( var i = 0; i < files.length; i++ ) {

		if ( files[i] !== '.gitignore' && files[i] !== 'gulpfile.js' && files[i] !== 'node_modules' && files[i] !== 'package.json' ) {

			var path = './' + files[i] + '/';
			var dirFiles = fs.readdirSync(path);

			if ( dirFiles.indexOf(files[i] + '.scss') > -1 ) {

				var thisGulp = gulp.src('./' + files[i] + '/' + files[i] + '.scss')
					.pipe(autoprefixer())
					.pipe(sass())
					.pipe(gulp.dest('./' + files[i] + '/'));


				gulps.push(thisGulp)
			}
		}
	}

	return gulps;
});

gulp.task('watch-patterns-css', function() {
	gulp.watch('./*/*.scss', ['build-patterns-css']);
});