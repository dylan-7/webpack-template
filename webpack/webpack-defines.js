const path = require('path')

const dirs = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  public: path.join(__dirname, '../public')
}

const subDirs = {
  // path to Output sub dir (js, css, fonts, etc.)
  // `dist/assets/css/` & dist/assets/js/
  assets: 'assets/',
  // path to Output sub dir (img, icons, etc.)
  // `dist/static/img/` & `dist/static/fonts/`
  static: 'static/'
}

module.exports = {
  ...dirs,
  ...subDirs
}
