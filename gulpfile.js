var gulp = require("gulp"),
sass = require("gulp-sass"),
autoprefixer = require("gulp-autoprefixer"),
browserSync = require("browser-sync"),
cleanify = require('gulp-clean-css'),
rename = require('gulp-rename'),
runSequence = require('run-sequence'),
webpack = require("webpack-stream");


gulp.task("cp-bootstrap", function () {
	return gulp.src("./node_modules/bootstrap-sass/**/*")
	.pipe(gulp.dest("./resources/assets/bootstrap"))
})
gulp.task("prepare-bootstrap",['cp-bootstrap'], function () {
	return gulp.src("./helper/bootstrap3.scss")
	.pipe(gulp.dest("./resources/assets/bootstrap/assets/stylesheets/"))
})

gulp.task("cmpl-bootstrap", function () {
	return gulp.src("./resources/assets/bootstrap/assets/**/*.scss")
	.pipe(sass())
	.pipe(autoprefixer())
	.pipe(gulp.dest("./public/assets/bootstrap/css"))
})

gulp.task("cp-bootstrapjs", function () {
	return gulp.src("./resources/assets/bootstrap/assets/**/*.js")
	.pipe(gulp.dest("./public/assets/bootstrap/js"))
})

gulp.task("cp-glyphicon", function () {
	return gulp.src("./resources/assets/bootstrap/assets/fonts/bootstrap/glyphicons-halflings-regular.*")
	.pipe(gulp.dest("./public/assets/bootstrap/css/fonts/bootstrap"))
})

gulp.task("minify-css",['cmpl-bootstrap','cmpl-app-sass'], function() {
	return gulp.src(['./public/assets/**/*.css', '!./public/assets/**/*.min.css'])
	.pipe(cleanify({debug: true}, function(details) {
		console.log(details.name + ': ' + details.stats.originalSize);
		console.log(details.name + ': ' + details.stats.minifiedSize);
	}))
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('./public/assets/'));
})

gulp.task("build-bootstrap", ['cp-bootstrapjs', 'cp-glyphicon', 'minify-css'])

gulp.task("prepare-app-sass", function () {
	return gulp.src('./helper/app.scss')
	.pipe(gulp.dest('./resources/assets/app'))
})

gulp.task("cmpl-app-sass", function () {
	return gulp.src('./resources/assets/app/**/*.scss')
	.pipe(gulp.dest('./public/assets/app/css'))
})

gulp.task("w-sass", function () {
	gulp.watch("./resources/assets/bootstrap/**/*.scss", ['cmpl-bootstrap'])
	gulp.watch("./resources/assets/app/**/*.scss", ['cmpl-app-sass'])
})

gulp.task("preparing",['prepare-bootstrap','prepare-app-sass'])

gulp.task("compiling",['build-bootstrap','cmpl-app-sass'])

gulp.task("kick-it", function () {
	runSequence('preparing','compiling')
})
/** Basic SetUp*/

gulp.task("serve", ['build-bootstrap','cmpl-app-sass','w-sass'],function () {
	browserSync.init({
		server: {
			baseDir: "./public/"
		}
	})

	gulp.watch("./resources/assets/bootstrap/**/*.scss",['cmpl-bootstrap']);
	gulp.watch("./resources/assets/app/**/*.scss",['app-sass']);

	gulp.watch("./public/assets/**/*.css").on("change", browserSync.reload);
	gulp.watch("./public/assets/**/*.js").on("change", browserSync.reload);
	gulp.watch("./public/**/*.html").on("change", browserSync.reload);
	gulp.watch("./public/*.html").on("change", browserSync.reload);


})