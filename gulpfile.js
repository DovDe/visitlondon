const gulp             = require('gulp');
const sass             = require('gulp-sass');
const browserSync      = require('browser-sync');
var reload             = browserSync.reload;
var autoprefixer       = require('gulp-autoprefixer');
var clean              = require('gulp-clean');

// variable src folder for all the source files of different file
// types
var SOURCEPATHS = {
  //the astrisc means that any file with the extention after it will be checked
// this is defining the sass source
  sassSource:   'src/scss/*.scss',
  htmlSource:   'src/*.html',
  jsSource:     'src/js/*.js'
}

// variable app folder
var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js:   'app/js'

}
// CLean the app folder of any html files not in the development
//folder
gulp.task('clean-html', function(){
  // the read method defines if the method reads the file content
  // in our case we only need to read the file name
  //The force method actually enables to remove the path
  return gulp.src(APPPATH.root + '/*.html', {read: false, force:true})
  .pipe(clean());
});
// CLean the app folder of any js files not in the development
//folder
gulp.task('clean-scripts', function(){
  // the read method defines if the method reads the file content
  // in our case we only need to read the file name
  //The force method actually enables to remove the path
  return gulp.src(APPPATH.js + '/*.js', {read: false, force:true})
  .pipe(clean());
});

// this task takes the app.scss and compiles it to the
//app/css folder
gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource)
// adding autoprefixer this will automatically add
// browser prefixes to make the app supproted across
// all browsers
    .pipe(autoprefixer())
  //  this pipe is for the sass it defines how we are gong to
  //the sass the outputStyle is currently on expanded but for
  // development I will use compressed which will minify the css
    .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
// this pips is the destination to add compile the sass to this pipe
//needs to be last becuase the scss needs to be exported after all of
//the scss and prfixes are added
    .pipe(gulp.dest(APPPATH.css));
});

gulp.task('scripts', ['clean-scripts'] ,function() {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(gulp.dest(APPPATH.js));
});
gulp.task('copy', ['clean-html'] ,function(){
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root));
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
gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts' ,'scripts'], function(){
// the first brakets in this method defines what to listen to
// the second brakets in the method defines what to run once the
// where changes
  gulp.watch([SOURCEPATHS.sassSource],['sass']);
  gulp.watch([SOURCEPATHS.htmlSource],['copy']);
  gulp.watch([SOURCEPATHS.jsSource],['scripts']);

});
// this task will tell gulp which tasks to run
gulp.task('default', ['watch']);
