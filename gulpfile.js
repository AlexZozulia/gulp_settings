//Подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const  autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
var replace = require('gulp-replace');

//Порядок подключения CSS файлов
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]

//Порядок подключения JS файлов
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]

// File paths
const files = {
    scssPath: './scss/**/*.scss',
}


//Таск на стили CSS
function styles() {
    //Шаблон для поиска файлов CSS
    //Всей файлы по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)
        //Обьединение файлов в один
        .pipe(concat('style.css'))
        //Добавить префиксы
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        //Минификация CSS
        .pipe(cleanCSS({
            level: 2
        }))
        //Выходная папка для стилей
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());

}

//Таск на скрипты JS
function scripts() {
    //Шаблон для поиска файлов JS
    //Всей файлы по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)
        //Обьединение файлов в один
        .pipe(concat('script.js'))
    //Минификация JS
        .pipe(uglify())
        //Выходная папка для скриптов
        .pipe(gulp.dest('./build/js/'))
        .pipe(browserSync.stream());
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){
    return gulp.src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream()); // put final CSS in dist folder
}




//Удалить все в указанной папке
function clean(){
    return del(['build/*'])
}

//Просматривать файлы
function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Следить за CSS файлами
    gulp.watch('./src/css/**/*.css', styles)
    //Следить за JS файлами
    gulp.watch('./src/js/**/*.js', scripts)
    //Следить за SCSS файлами
    gulp.watch([files.scssPath],
        {usePolling: true}, scssTask);
//При измененни HTML запустить синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload);
}

//Таск вызывающий функцию styles
gulp.task('styles', styles);
//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//Таск для очистки папки build
gulp.task('del', clean);
//Таск для отслкживаня изменений
gulp.task('watch', watch);
// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
gulp.task ('scssTask', scssTask);
//Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
//Таск запускает таск build и watch
gulp.task('dev', gulp.series('build', 'scssTask', 'watch'))

