var fs            = require('fs'),
    gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    sass          = require('gulp-sass');

gulp.task('build-patterns-css', function() {

	var files  = fs.readdirSync('./');
	var gulps  = [];
	var ignore = [ '.gitignore', 'gulpfile.js', 'node_modules', 'package.json', '.DS_Store' ];

	for ( var i = 0; i < files.length; i++ ) {

		if ( ignore.indexOf(files[i]) === -1 ) {

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