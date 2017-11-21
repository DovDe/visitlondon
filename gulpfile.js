const gulp = require('gulp');
const sass = require('gulp-sass');


// this task takes the app.scss and compiles it to the
//app/css folder
gulp.task('sass', function() {
  return gulp.src('src/scss/app.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
    .pipe(gulp.dest('app/css'));
});

// this task will tell gulp which tasks to run
gulp.task('default', ['sass']);
