var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", function () {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task(
  "serve",
  gulp.series("sass", function () {
    browserSync.init({
      server: "./public/",
    });

    gulp
      .watch("public/scss/**/*.scss", gulp.series("sass"))
      .on("change", browserSync.reload);
    gulp.watch("public/*.html").on("change", browserSync.reload);
    gulp.watch("public/js/**/*.js").on("change", browserSync.reload);
  })
);

gulp.task("default", gulp.series("serve"));