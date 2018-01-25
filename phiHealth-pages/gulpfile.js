var gulp = require('gulp');
// 获取 gulp-html-minify 模块（用于压缩 html）
var htmlminify = require("gulp-html-minify");
// 获取 minify-css 模块（用于压缩 CSS）
var minifyCSS = require('gulp-minify-css');
// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify');
// 获取 gulp-imagemin 模块
var imagemin = require('gulp-imagemin');

const nunjucks = require('gulp-nunjucks');


gulp.task('html' , function(){
    return gulp.src(['phicomm/templates/*.html', '!phicomm/templates/base.html'])
        .pipe(nunjucks.compile({}))
        .pipe(htmlminify())
        .pipe(gulp.dest("dist/"))
});

// 压缩 css 文件
// 在命令行使用 gulp css 启动此任务
gulp.task('css', function () {
    // 1. 找到文件
    gulp.src('phicomm/css/*.css')
    // 2. 压缩文件
    	.pipe(minifyCSS())
    // 3. 另存为压缩文件
    	.pipe(gulp.dest('dist/css'))
})


// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('script', function() {
    // 1. 找到文件
    gulp.src(['phicomm/js/*.js', 'phicomm/js/**/*.js'])
    // 2. 压缩文件
    	.pipe(uglify())
    // 3. 另存压缩后的文件
    	.pipe(gulp.dest('dist/js'))
})

// 压缩图片任务
// 在命令行输入 gulp images 启动此任务
gulp.task('images', function () {
    // 1. 找到图片
    gulp.src('phicomm/images/**/*.*')
    // 2. 压缩图片
        .pipe(imagemin({
            progressive: true
        }))
    // 3. 另存图片
        .pipe(gulp.dest('dist/images'))
});


gulp.task('default', ['html', 'css', 'script', 'images']);


