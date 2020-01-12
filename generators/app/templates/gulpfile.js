const {src, dest, series, watch} = require('gulp')
const browserSync = require('browser-sync')
const reload = browserSync.reload
const del = require('del') // 不适用于plugins
//gulp-uglify=>plugins.uglify = require('gulp-uglify')
const plugins = require('gulp-load-plugins')()

// uglifyjs
function js(cb) {
  src('src/js/*.js')
    .pipe(plugins.uglify())
    .pipe(dest('./dist/js'))
    .pipe(reload({stream:true}))
  cb() // 防止报错
}

// 对scss/less编译 夺缩 输出css文件
function css(cb) {
  src('src/css/*.scss')
    .pipe(plugins.sass({outputStyle: 'compressed'}))
    .pipe(plugins.autoprefixer({ //版本前缀新版本是放到了package.json中
      cascade: false,
      remove: false
    }))
    .pipe(dest('./dist/css'))
    .pipe(reload({stream:true}))
  cb()
}

// 监听这些文件内容变化,有变化执行相应的任务
function watcher(cb) {
  watch('src/js/*.js', js)
  watch('src/css/*.scss', css)
  watch('*.html', reload)
  cb()
}

// 删除dist目录中的内容
function clean(cb) {
  del('./dist')
  cb()
}

function serve(cb){
  browserSync.init({
    server:{
      baseDir:'./'
    }
  })
  cb()
}

exports.scripts = js
exports.styles = css
exports.clean = clean
// 默认的处理方式
// exports.default = function () {
//   console.log('hello gulp')
// }
exports.default = series([
  clean,
  js,
  css,
  serve,
  watcher
])