const gulp         = require('gulp');
const browserSync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber      = require('gulp-plumber');
const sourcemaps   = require('gulp-sourcemaps');
const combineMq    = require('gulp-combine-mq');


// Compile Sass & Inject Into Browser
// gulp.task('sass', ['sasstoscss'], function() {
gulp.task('sass', function() {
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded', 
            errorLogToConsole: true}))
        // .pipe(autoprefixer({
        //     // browsers: ['last 5 versions'],
        //     browsers: ['last 15 versions', '> 5%', 'ie 8', 'ie 7'],
        //     cascade: true
        // }))
        .pipe(sourcemaps.write("./maps"))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

// Compile Sass & Inject Into Browser
// gulp.task('sass', ['sasstoscss'], function() {
gulp.task('sass-prod', function() {
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber())
        .pipe(sass({outputStyle: 'compressed', errorLogToConsole: true}))
        .pipe(autoprefixer({
            // browsers: ['last 5 versions'],
            browsers: ['last 15 versions', '> 5%', 'ie 8', 'ie 7'],
            cascade: false
        }))
        .pipe(combineMq({
            beautify: false
        }))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});


// Watch Sass & Serve
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./src" 
    });

    gulp.watch(['src/scss/**/*.scss'], ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Watch Sass-prod & Serve
gulp.task('serve-prod', ['sass-prod'], function() {
    browserSync.init({
        server: "./src" 
    });

    gulp.watch(['src/scss/**/*.scss'], ['sass-prod']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Watch Sass & Serve
gulp.task('compile', ['sass'], function() {
    gulp.watch(['src/scss/**/*.scss'], ['sass']);
});

// Default Task
gulp.task('default', ['serve']);
// gulp.task('default', ['compile']);