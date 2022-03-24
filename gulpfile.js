const {
  task,
  src,
  dest,
  watch,
  series,
  parallel
} = require('gulp');


const paths = {
  css: {
    src: ['./src/' + assets + '/css/**/*.css'],
    dest: './dist/' + assets + '/tmp/css/',
    srcone: ['./dist/' + assets + '/tmp/css/**/*.css'],
    destone: './dist/' + assets + '/css/',
  },
  fonts_ttf: {
    src: ['./src/' + assets + '/fonts/**/*'],
    dest: './dist/' + assets + '/fonts/',
  },
  fonts_web: {
    src: ['./src/' + assets + '/webfonts/**/*'],
    dest: './dist/' + assets + '/webfonts/',
  }
};

async function doAll() {
  series(copyFontsTTF, copyFontsWeb, cacheBust)();
}

function copyFontsTTF() {
  return src(paths.fonts_ttf.src)
    // .pipe(fontmin())
    .pipe(dest(paths.fonts_ttf.dest));
}

function copyFontsWeb() {
  return src(paths.fonts_web.src)
    // .pipe(fontmin())
    .pipe(dest(paths.fonts_web.dest));
}

function cacheBust() {
  return src(paths.cachebust.src)
    .pipe(replace(/cache_bust=\d+/g, 'cache_bust=' + new Date().getTime()))
    .pipe(dest(paths.cachebust.dest));
}

// Watch for file modification at specific paths and run respective tasks accordingly
function watcher() {
  watch(paths.html.src, series(copyHTML, cacheBust));
  watch(paths.images.src, series(startup, optimizeImages));
  watch(paths.styles.src, series(compileStyles, cacheBust));
  watch(paths.scripts.src, parallel(minifyScripts, cacheBust));
}
// Export tasks to make them public
exports.doAll = doAll;
exports.copyFontsTTF = copyFontsTTF;
exports.copyFontsWeb = copyFontsWeb;
exports.cacheBust = cacheBust;
exports.watcher = watcher;
exports.default = series(
doAll
);
