const del = require(`del`);
const gulp = require(`gulp`);
const sass = require(`gulp-sass`);
const plumber = require(`gulp-plumber`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const server = require(`browser-sync`).create();
const mqpacker = require(`css-mqpacker`);
const minify = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const imagemin = require(`gulp-imagemin`);
const rollup = require(`gulp-better-rollup`);
const sourcemaps = require(`gulp-sourcemaps`);
const mocha = require(`gulp-mocha`);
const commonjs = require(`rollup-plugin-commonjs`);

gulp.task(`style`, () => {
  return gulp.src(`sass/style.scss`).
    pipe(plumber()).
    pipe(sass()).
    pipe(postcss([
      autoprefixer({
        browsers: [
          `last 1 version`,
          `last 2 Chrome versions`,
          `last 2 Firefox versions`,
          `last 2 Opera versions`,
          `last 2 Edge versions`
        ]
      }),
      mqpacker({sort: true})
    ])).
    pipe(gulp.dest(`build/css`)).
    pipe(server.stream()).
    pipe(minify()).
    pipe(rename(`style.min.css`)).
    pipe(gulp.dest(`build/css`));
});

gulp.task(`scripts`, () => {
  return gulp.src(`js/main.js`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rollup({}, `iife`))
    .pipe(sourcemaps.write(``))
    .pipe(gulp.dest(`build/js`));
});

//  gulp.task(`scripts`, () => {
//    return gulp.src(`js/**/*.js`).
//      pipe(plumber()).
//      pipe(gulp.dest(`build/js/`));
//  });

gulp.task(`copy-html`, () => {
  return gulp.src(`*.{html,ico}`).
    pipe(gulp.dest(`build`)).
    pipe(server.stream());
});

gulp.task(`copy`, gulp.series(`copy-html`, `scripts`, `style`, () => {
  return gulp.src([
    `fonts/**/*.{woff,woff2}`,
    `img/*.*`
  ], {base: `.`}).
    pipe(gulp.dest(`build`));
}));

gulp.task(`imagemin`, gulp.series(`copy`, () => {
  return gulp.src(`build/img/**/*.{jpg,png,gif}`).
    pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ])).
    pipe(gulp.dest(`build/img`));
}));

gulp.task(`clean`, () => {
  return del(`build`);
});

gulp.task(`js-watch`, gulp.series(`scripts`, (done) => {
  server.reload();
  done();
}));

gulp.task(`assemble`, gulp.series(`clean`, `copy`, `style`));

gulp.task(`serve`, gulp.series(`assemble`, () => {
  server.init({
    server: `./build`,
    notify: false,
    open: true,
    port: 8000,
    ui: false
  });

  gulp.watch(`sass/**/*.{scss,sass}`, gulp.series(`style`));
  gulp.watch(`*.html`).on(`change`, (e) => {
    if (e.type !== `deleted`) {
      gulp.series(`copy-html`)();
    }
  });
  gulp.watch(`js/**/*.js`, gulp.series(`js-watch`));
}));

gulp.task(`build`, gulp.series(`assemble`, `imagemin`));

gulp.task(`test`, function () {
  return gulp
    .src([`js/**/*.test.js`])
    .pipe(rollup({
      plugins: [
        commonjs()// Сообщает Rollup, что модули можно загружать из node_modules
      ]
    }, `cjs`))// Выходной формат тестов — `CommonJS` модуль
    .pipe(gulp.dest(`build/test`))
    .pipe(mocha({
      reporter: `spec`// Вид в котором я хочу отображать результаты тестирования
    }));
});
