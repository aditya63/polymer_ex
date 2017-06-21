// ** DEPENDENCIES **//

let gulp = require('gulp');
let sass = require('gulp-sass');
let browserSync = require('browser-sync');
let reload = browserSync.reload;
let autoprefixer = require('gulp-autoprefixer');
let browserify = require('gulp-browserify');
let clean = require('gulp-clean');
let concat = require('gulp-concat');
let merge = require('merge-stream');
let newer = require('gulp-newer');
let imagemin = require('gulp-imagemin');

//sourcepath for files that can be dited
let SOURCEPATHS = {
	sassSource : 'src/scss/*.scss',
	htmlSource: 'src/*.html',
	jsSource: 'src/js/**',
	imgSource: 'src/img/**'
}
//Source path for compiled files
let APPPATH = {
	root: 'app/',
	css:'app/css',
	js:'app/js',
	fonts:'app/fonts',
	image: 'app/img'
}

//Combining sass files and bootstrap CSS in one css file
gulp.task('sass', function(){
	let bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
	let sassFiles;

sassFiles = gulp.src(SOURCEPATHS.sassSource)
		   .pipe(autoprefixer())
		   .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

		   return merge(bootstrapCSS, sassFiles)
		   .pipe(concat('app.css'))
		   .pipe(gulp.dest(APPPATH.css));
});

//minifying images
gulp.task('images', function(){
	return gulp.src(SOURCEPATHS.imgSource)
		   .pipe(newer(APPPATH.image)) //copies new images added
		   .pipe(imagemin())
		   .pipe(gulp.dest(APPPATH.image));
})

//getting bootstrap fonts from node modules
gulp.task('getFonts', function(){
	gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
		.pipe(gulp.dest(APPPATH.fonts));
})

//Gulp running the server
gulp.task('serve', ['sass'], function(){
	browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'],
	{	server:{
			baseDir: APPPATH.root
		}
	})
});


//Cleaning any unwanted htnl and js files
gulp.task('cleanHtml', function(){
	gulp.src(APPPATH.root + "/*.html", {red: false, force:true})
		.pipe(clean());
});

gulp.task('cleanJs', function(){
	gulp.src(APPPATH.js + "/*.js", {red: false, force:true})
		.pipe(clean());
});


//compiling html and js files
gulp.task('compileHtml', ['cleanHtml'], function(){
	gulp.src(SOURCEPATHS.htmlSource)
		.pipe(gulp.dest(APPPATH.root))
});

gulp.task('compileJs', ['cleanJs'], function(){
	gulp.src(SOURCEPATHS.jsSource)
		.pipe(concat('main.js'))
		.pipe(browserify())
		.pipe(gulp.dest(APPPATH.js))
});


//Runs all the tasks defined on gulp
gulp.task('watch', ['serve', 'sass', 'compileHtml', 'cleanHtml', 'compileJs', 'cleanJs', 'getFonts', 'images'], function() {
	gulp.watch([SOURCEPATHS.sassSource], ['sass']);
	gulp.watch([SOURCEPATHS.htmlSource], ['compileHtml']);
	gulp.watch([SOURCEPATHS.jsSource], ['compileJs']);
});

gulp.task('default', ['watch']);