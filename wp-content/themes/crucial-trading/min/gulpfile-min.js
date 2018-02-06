const argv=require("yargs").argv,fs=require("fs"),merge=require("event-stream").merge,sync=require("browser-sync").create(),gulp=require("gulp"),babel=require("gulp-babel"),concat=require("gulp-concat"),glob=require("gulp-sass-glob"),order=require("gulp-order"),polyfill=require("gulp-autopolyfiller"),prefix=require("gulp-autoprefixer"),rename=require("gulp-rename"),sass=require("gulp-sass"),sourcemaps=require("gulp-sourcemaps"),uglify=require("gulp-uglify");gulp.task("watch",["sync","css-dev","js-dev"],function(){gulp.watch("./assets/css/src/*.scss",["css-dev"]),gulp.watch("./assets/css/src/*/*.scss",["css-dev"]),gulp.watch("./assets/css/src/pages/*.scss",["css-dev"]),gulp.watch("./patterns/*/*.scss",["css-dev"]),gulp.watch("./patterns/*/*.js",["js-dev"]),gulp.watch("./assets/js/src/script.js",["js-dev"]),gulp.watch("./assets/js/src/vendor/*.js",["js-dev"]),gulp.watch("./assets/js/src/pages/*.js",["js-dev"]),gulp.watch("./*.php").on("change",sync.reload),gulp.watch("./inc/*.php").on("change",sync.reload),gulp.watch("./inc/*/*.php").on("change",sync.reload),gulp.watch("./assets/src/js/src/*.js").on("change",sync.reload),gulp.watch("./page-templates/*.php").on("change",sync.reload),gulp.watch("./patterns/*/*.php").on("change",sync.reload)}),gulp.task("default",["watch"]),gulp.task("build",["css-prod","js-prod"]),gulp.task("sync",function(){sync.init({proxy:"http://localhost/crucial",reloadOnRestart:!0})}),gulp.task("css-dev",function(){return gulp.src("./assets/css/src/global.scss").pipe(sourcemaps.init()).pipe(glob()).pipe(sass({outputStyle:"compressed"}).on("error",sass.logError)).pipe(prefix()).pipe(concat("build.min.css")).pipe(sourcemaps.write("maps")).pipe(gulp.dest("./assets/dev/css")).pipe(sync.reload({stream:!0}))}),gulp.task("css-prod",function(){return gulp.src("./assets/css/src/global.scss").pipe(glob()).pipe(sass({outputStyle:"compressed"}).on("error",sass.logError)).pipe(prefix()).pipe(rename({basename:"master",suffix:".min"})).pipe(gulp.dest("./assets/css/dist"))}),gulp.task("js-dev",function(){var s=gulp.src(["./assets/js/src/*.js","./assets/js/src/**/*.js","./patterns/*/*.js","./patterns/**/*.js"]).pipe(concat("all.js")).pipe(babel({presets:["es2015"]})).pipe(sourcemaps.init()),e=s.pipe(polyfill("polyfills.js"));return merge(e,s).pipe(order(["polyfills.js","all.js"])).pipe(concat("build.min.js")).pipe(uglify().on("error",function(s){console.log(s)})).pipe(sourcemaps.write("maps")).pipe(gulp.dest("./assets/dev/js")).pipe(sync.stream())}),gulp.task("js-prod",function(){var s=gulp.src(["./assets/js/src/*.js","./assets/js/src/**/*.js","./patterns/*/*.js","./patterns/**/*.js"]).pipe(concat("all.js")).pipe(babel({presets:["es2015"]})),e=s.pipe(polyfill("polyfills.js"));return merge(e,s).pipe(order(["polyfills.js","all.js"])).pipe(concat("master.min.js")).pipe(uglify().on("error",function(s){console.log(s)})).pipe(gulp.dest("./assets/js/dist")).pipe(sync.stream())});