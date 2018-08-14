/* jshint node:true */
'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');

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

gulp.task('default', ['watch'], () => {
});
