var gulp               = require('gulp');
var sass               = require('gulp-sass');
var browserSync        = require('browser-sync');
var reload             = browserSync.reload;
var autoprefixer       = require('gulp-autoprefixer');
var browserify         = require('gulp-browserify');
var clean              = require('gulp-clean');
var concat             = require('gulp-concat');
var merge              = require('merge-stream');
var newer              = require('gulp-newer');
var imagemin           = require('gulp-imagemin');
var injectPartials     = require('gulp-inject-partials');
var minify             = require('gulp-minify');
var rename             = require('gulp-rename');
var cssmin             = require('gulp-cssmin');
var htmlmin            = require('gulp-htmlmin');


// variable src folder for all the source files of different file
// types
var SOURCEPATHS = {
  //the astrisc means that any file with the extention after it will be checked
// this is defining the sass source
  sassSource:          'src/scss/*.scss',
  sassApp:             'src/scss/app.scss',
  htmlSource:          'src/*.html',
  htmlPartialSource:   'src/partial/*.html',
  jsSource:            'src/js/**',
  imgSource:           'src/img/**'
}

// variable app folder
var APPPATH = {
  root:    'app/',
  css:     'app/css',
  js:      'app/js',
  fonts:   'app/fonts',
  img:     'app/img'

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
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;

  sassFiles =  gulp.src(SOURCEPATHS.sassApp)
    // adding autoprefixer this will automatically add
    // browser prefixes to make the app supproted across
    // all browsers
        .pipe(autoprefixer())
      //  this pipe is for the sass it defines how we are gong to
      //the sass the outputStyle is currently on expanded but for
      // development I will use compressed which will minify the css
        .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
    // here I am merging the sass and bootstrap files and the conctinating them into app.css
    // here the order that we merge the files matters for instance it is important to add
    //the bootstrap code first then to add the sass so we can override the bootstrao code
    return merge(bootstrapCSS,sassFiles)
        .pipe(concat('app.css'))
        // this pips is the destination to add compile the sass to this pipe
        //needs to be last becuase the scss needs to be exported after all of
        //the scss and prfixes are added
        .pipe(gulp.dest(APPPATH.css))
});


// task to transfer images
gulp.task('images',function(){
    return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATH.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATH.img));
});
// task to move bootstrap fonts.
gulp.task('moveFonts', function(){
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
  .pipe(gulp.dest(APPPATH.fonts));
});

gulp.task('scripts', ['clean-scripts'] ,function() {
  gulp.src(SOURCEPATHS.jsSource)
  .pipe(concat('main.js'))
  .pipe(browserify())
  .pipe(gulp.dest(APPPATH.js));
});

//================================================
//Production tasks
//================================================
gulp.task('compress', function() {
  gulp.src(SOURCEPATHS.jsSource)
  .pipe(concat('main.js'))
  .pipe(browserify())
  .pipe(minify())
  .pipe(gulp.dest(APPPATH.js));
});

gulp.task('compresscss', function() {
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;

  sassFiles =  gulp.src(SOURCEPATHS.sassSource)

        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))

    return merge(bootstrapCSS,sassFiles)
        .pipe(concat('app.css'))
        .pipe(cssmin())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(APPPATH.css))
});
gulp.task('minifyHtml', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
  .pipe(injectPartials())
  .pipe(htmlmin({collapseWhitespace:true}))
  .pipe(gulp.dest(APPPATH.root))
});

gulp.task('production', ['minifyHtml','compresscss','compress']);
//================================================
//END Production tasks
//================================================

// gulp.task('copy', ['clean-html'] ,function(){
//   gulp.src(SOURCEPATHS.htmlSource)
//     .pipe(gulp.dest(APPPATH.root));
// });

//  task to inject html partials
gulp.task('html', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
  .pipe(injectPartials())
  .pipe(gulp.dest(APPPATH.root))
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
gulp.task('watch', ['serve', 'sass', 'clean-html', 'clean-scripts' ,'scripts', 'moveFonts','images', 'html'], function(){
// the first brakets in this method defines what to listen to
// the second brakets in the method defines what to run once the
// where changes
  gulp.watch([SOURCEPATHS.sassSource],['sass']);
  // gulp.watch([SOURCEPATHS.htmlSource],['copy']);
  gulp.watch([SOURCEPATHS.jsSource],['scripts']);
  gulp.watch([SOURCEPATHS.imgSource],['images']);
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource],['html']);

});
// this task will tell gulp which tasks to run
gulp.task('default', ['watch']);
