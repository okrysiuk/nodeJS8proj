/*---------------------------Decline variables-------------------------------*/

var gulp        = require('gulp'),
		sass        = require('gulp-sass'),
		browserSync = require('browser-sync'),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglifyjs'),
		cssnano      = require('gulp-cssnano'),
		rename       = require('gulp-rename'),
		del          = require('del'),
		imagemin     = require('gulp-imagemin'),
		pngquant     = require('imagemin-pngquant'),
		cache        = require('gulp-cache'),
		autoprefixer = require('gulp-autoprefixer');


/*-------------------------Transforms SASS to CSS----------------------------*/

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
		.pipe(sass())
		.pipe(autoprefixer(/*['last 15 versions', '> 1%', 'ie 8', 'ie7'],*/ {cascade: true}))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

/*---------------------------------------------------------------------------*/

/*-------------Minify and export all JS libs to 1 minified file--------------*/

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/jquery-1.11.2.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		])
.pipe(concat('libs.min.js'))
.pipe(uglify())
.pipe(gulp.dest('app/js'));
});

/*---------------------------------------------------------------------------*/

/*-----------------------Minify CSS libs and rename to .min.css--------------*/

gulp.task('css-libs', function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

/*---------------------------------------------------------------------------*/

/*--------------------------Starting local server----------------------------*/

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		/*notify: false*/
	});
});

/*---------------------------------------------------------------------------*/

/*-----------------Cleaning "dist" folder before building project------------*/

gulp.task('clean', function() {
	return del.sync('dist');
});

/*---------------------------------------------------------------------------*/

/*---------------------------Cleaning images cache---------------------------*/

gulp.task('clear', function() {
	return cache.clearAll();
});

/*---------------------------------------------------------------------------*/

/*----------------------Images resize and optimization-----------------------*/

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
		.pipe(gulp.dest('dist/img'));
});

/*---------------------------------------------------------------------------*/

/*---------Watching for changes in files and then reload browsers------------*/

gulp.task('watch', ['browser-sync', 'sass'], function() {  /*after sass we can write 'scripts' */
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/css/**/*.css', browserSync.reload);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

/*---------------------------------------------------------------------------*/

/*--------------------Building project for production-----------------------*/

gulp.task('build', ['clean', 'sass'/*, 'img', 'scripts'*/], function() {
	var buildCss = gulp.src([
				'app/css/main.css',
				'app/css/libs.min.css',
				])
		.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));

});
