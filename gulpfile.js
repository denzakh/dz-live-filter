"use strict";

const FRONT_PATH = "./src/";

const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const gutil = require("gulp-util");
const babel = require("gulp-babel");
const babelify = require("babelify");
const path = require("path");
const rename = require('gulp-rename');
const fs = require('fs');


function js(cb) {
	return browserify(FRONT_PATH+"dz-live-filter.js", { debug: true })
		.transform(babelify.configure(
			{
				presets: ["@babel/preset-env"] ,
				compact: true
			}
		))
		.bundle()
		.pipe(source("dz-live-filter.js"))
		.pipe(rename("dz-live-filter.js.min.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(FRONT_PATH));
}


// отслеживаем изменения в проекте
function watch(cb) {
	gulp.watch(FRONT_PATH+'dz-live-filter.js', gulp.series(js) );
	console.log('Running watch...');
}

// КОМАНДЫ ЗАПУСКА
exports.default = gulp.series(gulp.parallel(js), watch);
exports.build = gulp.series(gulp.parallel(js));
