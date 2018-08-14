/* jshint node:true */
'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const replaceHTML = require('gulp-html-replace');
const rename = require('gulp-rename');
const minifyHTML = require('gulp-minify-html');
const minifyCSS = require('gulp-clean-css');
const minifyJS = require('gulp-terser');
const concat = require('gulp-concat');

const paths = {
    src: {
        html: 'src/index.html',
        css: 'src/css/*.css',
        js: 'src/js/*.js',
    },
    dist: {
        dir: 'dist',
        html: 'index.html',
        css: 'style.min.css',
        js: 'script.min.js',
    },
};

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

gulp.task('build', ['buildCSS', 'buildHTML', 'buildJS']);

gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: 'src'
        }
    });
});

gulp.task('watch', ['browserSync'], () => {
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/css/**/*.css', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);
