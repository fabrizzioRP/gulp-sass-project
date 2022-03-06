const {src ,dest , watch, parallel} = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoPrefixer = require('autoprefixer');
const cssnano = require('cssnano');
const terser = require('gulp-terser-js');
const cache = require('gulp-cache');
const imagesMin = require('gulp-imagemin');
const webp = require('gulp-webp');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*.{png,jpg}'
};

function css(done) {
    src(paths.scss)
        .pipe( sourcemaps.init() )
        .pipe( plumber() )
        .pipe( sass() )
        .pipe( postcss([ autoPrefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/css') );

    done();
}

function javascript(done) {
    src(paths.js)
        .pipe(sourcemaps.init())
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function imagenes(done) {
    src(paths.imagenes)
        .pipe(cache(imagesMin({optimizationLevel : 3})))
        .pipe(dest('build/img'));

    done();
}

function versionWebp(done) {
    src(paths.imagenes)
        .pipe(webp({ quality: 50 }))
        .pipe(dest('build/img'));

    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.dev = parallel(imagenes, versionWebp, css, javascript, dev);