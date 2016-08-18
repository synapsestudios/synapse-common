'use strict';

try {
  module.exports = window;
} catch (e) {
  // Trick Browserify into not ever trying to require jsdom; browers don't need it at all
  var req = require;
  module.exports = req('jsdom').jsdom().parentWindow;
}
