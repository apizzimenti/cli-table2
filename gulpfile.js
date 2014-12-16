var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('mocha',mochaTask);
gulp.task('coverage',coverageTask);

gulp.task('watch-mocha',function(){
  gulp.watch(['test/**','src/**'],['mocha']);
  mochaTask();
});

gulp.task('watch-coverage',function(){
  gulp.watch(['test/**','src/**'],['coverage']);
  coverageTask();
});

gulp.task('example',function(){
  require('./examples/examples')();
});

function coverageTask(cb){
  gulp.src(['src/*.js'])
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('error', logMochaError)
    .on('finish', function () {
      var opts = process.env.TRAVIS ? {} : {grep:'original-cli-table', invert:true};

      gulp.src(['test/*.js'])
        .pipe(mocha(opts))
        .on('error',function(err){
          logMochaError(err);
          if(cb) cb(err);
        })
        .pipe(istanbul.writeReports()) // Creating the reports after tests run
        .on('end', function(){
          if(cb) cb();
        });
    });
}

function mochaTask(){
  return gulp.src(['test/*.js'],{read:false})
    .pipe(mocha({
      growl:true
    }))
    .on('error',logMochaError);
}

function logMochaError(err){
  if(err && err.message){
    gutil.log(err.message);
  } else {
    gutil.log.apply(gutil,arguments);
  }
}