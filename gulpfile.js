const gulp             = require('gulp');
const sass             = require('gulp-sass');
const browserSync      = require('browser-sync');
var reload = browserSync.reload;

// variable src folder
var SOURCEPATHS = {
  //the astrisc means that any file with the extention after it will be checked
// this is defining the sass source
  sassSource:'src/scss/*.scss'
}

// variable app folder
var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js:   'app/js'

}


// this task takes the app.scss and compiles it to the
//app/css folder
gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
    .pipe(gulp.dest(APPPATH.css));
});

// this is called serve because we are using this with browserSync
// to create a server for us.
// Sass is before browserSync because we need to compile it
//before we start the server
gulp.task('serve', ['sass'], function(){
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir: APPPATH.root
    }
  })

});

//  Watch method
gulp.task('watch', ['serve', 'sass'], function(){
// the first brakets in this method defines what to listen to
// the second brakets in the method defines what to run once the
// where changes
  gulp.watch([SOURCEPATHS.sassSource],['sass']);
});
// this task will tell gulp which tasks to run
gulp.task('default', ['watch']);
