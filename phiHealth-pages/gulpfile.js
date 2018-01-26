var gulp = require('gulp');
// 获取 gulp-html-minify 模块（用于压缩 html）
var htmlminify = require("gulp-html-minify");
// 获取 minify-css 模块（用于压缩 CSS）
var minifyCSS = require('gulp-minify-css');
// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify');
// 获取 gulp-imagemin 模块
var imagemin = require('gulp-imagemin');
// 清除上次编译的代码
var clean = require('gulp-clean');  // 删除文件
// 使用类似jinja2的html模版
var nunjucks = require('gulp-nunjucks');

// 获取NODE环境变量
var minimist = require('minimist');
var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
};
var options = minimist(process.argv.slice(2), knownOptions);

// 编译后文件的输出地址
var output = 'test/';
if (options.env.indexOf('test') === -1) {
    output = 'prod/';
}

gulp.task('html' , function(){
    return gulp.src(['phicomm/templates/*.html', '!phicomm/templates/base.html'])
        .pipe(nunjucks.compile({
            env: options.env
        }))
        .pipe(htmlminify())
        .pipe(gulp.dest(output))
});

// 压缩 css 文件
// 在命令行使用 gulp css 启动此任务
gulp.task('css', function () {
    // 1. 找到文件
    gulp.src('phicomm/css/*.css')
    // 2. 压缩文件
    	.pipe(minifyCSS())
    // 3. 另存为压缩文件
    	.pipe(gulp.dest(output + 'css'))
})


// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('script', function() {
    // 1. 找到文件
    gulp.src(['phicomm/js/*.js', 'phicomm/js/**/*.js'])
    // 2. 压缩文件
    	.pipe(uglify())
    // 3. 另存压缩后的文件
    	.pipe(gulp.dest(output + 'js'))
})

// 压缩图片任务
// 在命令行输入 gulp images 启动此任务
gulp.task('images', function () {
    // 1. 找到图片
    gulp.src('phicomm/images/**/*.*')
    // 2. 压缩图片 - 感觉没什么用
        // .pipe(imagemin({
        //     progressive: true
        // }))
    // 3. 另存图片
        .pipe(gulp.dest(output + 'images'))
});


gulp.task('build', ['html', 'css', 'script', 'images']);
// 删除临时目录
gulp.task('clean', function () {
    gulp.src([output], {read: false})
        .pipe(clean());
});
// 这个地方有点奇怪哈，按理说应该不用加setTimeout的
gulp.task('default', ['clean'], function () {
    setTimeout(function() {
        gulp.start('build');
    },100);
});


