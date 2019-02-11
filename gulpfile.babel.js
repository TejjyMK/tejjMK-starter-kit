// ! Dependencies

import gulp from "gulp";
import autoprefixer from "gulp-autoprefixer";
import concat from "gulp-concat";
import images from "gulp-imagemin";
import plumber from "gulp-plumber";
import pug from "gulp-pug";
import rename from "gulp-rename";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import browserSync from "browser-sync";

// ? Paths

// * Sass vs Scss (Depending on your mood)
var sassSrc = 'source/sass/**/*.sass',
    scssSrc = 'source/scss/**/*.scss',
    styleDest = 'build/assets/css/',

    // * html vs pug (Depending on your mood)
    htmlSrc = 'source/*.html',
    pugSrc = 'source/pugTemp/*.pug',
    pugIncSrc = 'source/pugTemp/**/*.pug',
    htmlDest = 'build/',

    // * images
    imgSrc = 'source/img/*',
    imgDest = 'build/assets/img',

    // * javascript stuff
    vendorSrc = 'source/js/vendors/',
    vendorDest = 'build/assets/js/',
    scriptSrc = 'source/js/*.js',
    scriptDest = 'build/assets/js/';

// compiles all pug templates
gulp.task('pug', function () {
    return gulp.src(pugSrc)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(htmlDest))
});

// move HTML files from source to build
gulp.task('html', function () {
    return gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDest))
});

// Compiles all SASS files
gulp.task('sass', function (done) {
    gulp.src(sassSrc) // ! change to scss if you're using that
        .pipe(plumber())
        // ! for knowing what sass partial it is from in the inspect on browser
        .pipe(sourcemaps.init())
        .pipe(sass({
            style: 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))

        .pipe(sourcemaps.write())
        .pipe(browserSync.stream())
        .pipe(gulp.dest(styleDest));

    done();
});

// Optimises the images
gulp.task('images', function (done) {
    gulp.src(imgSrc)
        .pipe(images())
        .pipe(gulp.dest(imgDest));

    done();
});

// Uglify js files
gulp.task('scripts', function (done) {
    gulp.src(scriptSrc)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest(scriptDest));

    done();
});

//Concat and Compress Vendor .js files
gulp.task('vendors', function (done) {
    gulp.src(vendorSrc)
        .pipe(plumber())
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(gulp.dest(vendorDest));

    done();
});

// Watch for changes
gulp.task('watch' ,function(done) {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false,
        browser: 'firefox'
    });

    gulp.watch([pugIncSrc, pugSrc],gulp.parallel(['pug']));
    gulp.watch(htmlSrc,gulp.parallel(['html']));
    gulp.watch(sassSrc,gulp.parallel(['sass']));
    gulp.watch(scriptSrc,gulp.parallel(['scripts']));
    gulp.watch(vendorSrc,gulp.parallel(['vendors']));
    gulp
        .watch([
            'build/*.html',
            'build/assets/css/*.css',
            'build/assets/js/*.js',
            'build/assets/js/vendors/*.js'
        ])
        .on('change', browserSync.reload);

    done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('default',gulp.parallel('sass', 'scripts', 'vendors', 'watch', 'pug', 'html'), function () {});