var gulp = require('gulp');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app",
        notify: false
    });

    gulp.watch("app/assets/scss/*.scss", ['sass']);
    gulp.watch("app/assets/js/*.js").on('change', browserSync.reload);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});


gulp.task('sass', function(){
	gulp.src('./app/assets/scss/**/*.scss')

	//compile Sass
		.pipe(sourcemaps.init())
			.pipe(sass().on('error', sass.logError))
			.pipe(sass({outputStyle: 'expanded'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./app/assets/css'))

	// Autoprefix
		.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(autoprefixer({
			    browsers: ['last 2 versions'],
			    cascade: false
			}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('app/assets/css'))
		.pipe(browserSync.stream());
});

// Minify Images
gulp.task('images', function(){
	return gulp.src('./app/assets/images/src/*')
	.pipe(imagemin({
	            progressive: true,
	            svgoPlugins: [{removeViewBox: false}],
	            use: [pngquant()]
	        }))
	.pipe(gulp.dest('./app/assets/images'));
});

gulp.task('default', ['serve']);
