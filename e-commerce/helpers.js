/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// moment.js is a handy library for displaying dates. We need this in our templates to 
//display things like "Posted 5 minutes ago"
exports.moment = require('moment');


// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

exports.menu = [{
  slug: '/products',
  title: 'Products',
}, ];