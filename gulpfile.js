/* jshint node:true */
'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const replaceHTML = require('gulp-html-replace');
const rename = require('gulp-rename');
const deleteFiles = require('gulp-rimraf');
const minifyHTML = require('gulp-minify-html');
const minifyCSS = require('gulp-clean-css');
const minifyJS = require('gulp-terser');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const jshint = require('gulp-jshint');
const zip = require('gulp-zip');
const size = require('gulp-size');
const log = require('fancy-log');

const paths = {
    src: {
        html: 'src/index.html',
        css: 'src/css/*.css',
        js: ['src/js/kontra.js', 'src/js/player-small.js', 'src/js/maps.js', 'src/js/main.js', 'src/js/*.js'],
        jsNoLibraries: ['src/js/maps.js', 'src/js/main.js'],
        images: 'src/images/**',
    },
    dist: {
        dir: 'dist',
        html: 'index.html',
        css: 'css/style.min.css',
        js: 'js/script.min.js',
        images: 'dist/images',
    },
};

gulp.task('cleanDist', () => {
    return gulp.src('dist/*', { read: false })
        .pipe(deleteFiles());
});

gulp.task('cleanZip', () => {
    return gulp.src('zip/*', { read: false })
        .pipe(deleteFiles());
});

gulp.task('buildHTML', () => {
    return gulp.src(paths.src.html)
        .pipe(replaceHTML({
            css: paths.dist.css,
            js: paths.dist.js,
        }))
        .pipe(minifyHTML())
        .pipe(rename(paths.dist.html))
        .pipe(gulp.dest(paths.dist.dir));
});

gulp.task('buildCSS', () => {
    return gulp.src(paths.src.css)
        .pipe(minifyCSS())
        .pipe(rename(paths.dist.css))
        .pipe(gulp.dest(paths.dist.dir));
});

gulp.task('buildJS', () => {
    return gulp.src(paths.src.js)
        .pipe(concat(paths.dist.js))
        .pipe(minifyJS())
        .pipe(gulp.dest(paths.dist.dir));
});

gulp.task('optimizeImages', () => {
    return gulp.src(paths.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist.images));
});

gulp.task('lintJS', () => {
    return gulp.src(paths.src.jsNoLibraries)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('zip', () => {
    const limit = 13 * 1024;

    let s = size({
        showFiles: true,
        // Pretty would show a kilobyte as 1000, not as 1024 what is needed.
        pretty: false
    });

    return gulp.src(`${paths.dist.dir}/**`)
        .pipe(zip('game.zip'))
        .pipe(gulp.dest('zip'))
        .pipe(s)
        .on('end', () => {
            if (limit < s.size) {
                log(`WARNING: ZIP FILE TOO BIG: ${s.size} BYTES. LIMIT IS ${limit} BYTES.`);
            }
        });
});

gulp.task('build', callback => {
    runSequence(
        ['lintJS'],
        ['cleanDist', 'cleanZip'],
        ['buildCSS', 'buildHTML', 'buildJS', 'optimizeImages'],
        'zip',
        callback);
});

gulp.task('browserSync', ['lintJS'], () => {
    browserSync({
        server: {
            baseDir: 'src'
        },
        open: false,
    });
});

gulp.task('watchJS', ['lintJS'], browserSync.reload);

gulp.task('watch', ['browserSync'], () => {
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/css/**/*.css', browserSync.reload);
    gulp.watch('src/js/**/*.js', ['watchJS']);
});

gulp.task('default', ['watch']);
