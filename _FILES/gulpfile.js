const gulp         = require('gulp');
const browserSync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber      = require('gulp-plumber');
const sourcemaps   = require('gulp-sourcemaps');
const combineMq    = require('gulp-combine-mq');
const sassdoc      = require('sassdoc');
const purge        = require('gulp-css-purge');
const htmlvalidate = require('gulp-w3cjs');
const postcss      = require('gulp-postcss');
const sitemap      = require('gulp-sitemap');


gulp.task('sitemap', function () {
    gulp.src('src/**/*.html', {
            read: false
        })
        .pipe(sitemap({
            siteUrl: 'http://www.my-site.dk'
        }))
        .pipe(gulp.dest('./'));
});


// Compile Sass & Inject Into Browser
// gulp.task('sass', ['sasstoscss'], function() {
gulp.task('sass', function() {
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded', 
            // outputStyle: 'compressed', 
            errorLogToConsole: true}))
            // .pipe(sourcemaps.write())
        .pipe(postcss([require('postcss-font-magician')({ /* options */ })]))
        .pipe(gulp.dest("src/css"))
        .pipe(sourcemaps.write("./maps"))
        .pipe(browserSync.stream());
});

var sassDocOptions = {
    dest: 'src/docs/sassdoc',
    // theme: 'flippant',
    // theme: 'jigsass',
    // verbose: true,
    display: {
    //   access: ['public', 'private'],
      alias: true,
    //   watermark: true,
    },
    // groups: {
    //   'undefined': 'Ungrouped',
    //   foo: 'Foo group',
    //   bar: 'Bar group',
    // },
    // basePath: 'https://github.com/mftw/ubuntu-conference',
};

var purgeOptions = {
    // css_output: 'test1.min.css',
    // shorten: false,
    // trim: false,
    // shorten_zero: false,
    // shorten_background_min: 1,
    // zero_ignore_declaration: [".footer"],
    // zero_units: "rem",
    // zero_ignore_declaration: ['border']
};

// Compile Sass & Inject Into Browser
gulp.task('sass-prod', function() {
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber())
        .pipe(sassdoc(sassDocOptions))
        .pipe(sass({
            outputStyle: 'compressed',
            errorLogToConsole: true}))
        .pipe(autoprefixer({
            // browsers: ['last 5 versions'],
            browsers: ['last 9 versions', '> 5%', 'ie 8', 'ie 7'],
            cascade: false
        }))
        .pipe(combineMq({
            beautify: false
        }))
        .pipe(postcss([require('postcss-font-magician')({ /* options */ })]))
        // .pipe(purge(purgeOptions)) // Don't purge for now, erroring on .0123 values being purged to 0123 and the browsers response is to see it as 123
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});


// Don't purge for now, erroring on .0123 values being 
// purged to 0123, and the browsers response is to see it as 123
// guess what happens when you set something to .0625rem
// original developer contacted for support.
gulp.task('purge', function() {
    console.log('BEWARE OF ERRORS! DOESNT PURGE PROPERLY!')
    gulp.src(['src/css/**/*.css'])
      .pipe(purge({
        "zero_ignore_declaration": [".footer"]
     }))
    //   .pipe(purge({
    //     "shorten" : false,
    //     "shorten_zero": false,
    //     "shorten_hexcolor": true,
    //     "shorten_hexcolor_extended_names": true,
    //     "shorten_hexcolor_UPPERCASE": true,
    //     "shorten_font": true,
    //     "shorten_background": true,
    //     "shorten_background_min": 2,
    //     "shorten_margin": true,
    //     "shorten_padding": true,
    //     "shorten_list_style": true,
    //     "shorten_outline": true,
    //     "shorten_border": true,
    //     "shorten_border_top": true,
    //     "shorten_border_right": true,
    //     "shorten_border_bottom": true,
    //     "shorten_border_left": true,
    //     "shorten_border_radius": true,
    // }))
    //   .pipe(purge(purgeOptions))
      .pipe(gulp.dest('./public'));
})

// Validate HTML, if you dare
gulp.task('htmlval', function () {
    gulp.src('src/*.html')
        .pipe(htmlvalidate())
        .pipe(htmlvalidate.reporter());
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

// Watch Sass & Serve
gulp.task('compile-prod', ['sass-prod'], function() {
    gulp.watch(['src/scss/**/*.scss'], ['sass-prod']);
});

// Default Task
gulp.task('default', ['serve']);
// gulp.task('default', ['compile']);