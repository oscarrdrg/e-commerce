const path = require('path');

module.exports = {
    entry: './public/javascripts/restaurant-app.js',
    devtool: 'source-map',
    output: {
      filename: 'app.bundle.js',
      path: path.resolve(__dirname, 'public', 'dist'),
    }
  };