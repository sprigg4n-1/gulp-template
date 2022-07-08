const { src, dest, watch, parallel, series } = require('gulp');

let sсss        = require('gulp-sass')(require('sass')),
    concat      = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    uglify      = require('gulp-uglify-es').default,
    autopref    = require('gulp-autoprefixer'),
    del         = require('del');


function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function cleanDist() {
    return del('dist')
}

function scripts() {
    return src([
        'app/js/**/*.js', 
        '!app/js/main.min.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src([
        'app/scss/**/*.scss'
    ])
        .pipe(sсss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autopref({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}


function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/images/**/*',
        'app/*.html',
        'app/js/main.min.js'
    ],  {base:'app'})
        .pipe(dest('dist'))
}

function watching() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, build)
exports.default = parallel(styles, scripts, browsersync, watching);