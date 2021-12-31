const mongoose = require('mongoose');
require('dotenv').config({
  path: 'variables.env'
});
require('./models/Product');
require('./models/User');
require('./models/Cart');
require('./models/History');

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log(`connection to database established`)
}).catch(err => {
  console.log(`db error ${err.message}`);
  process.exit(-1);
})

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running at PORT ${server.address().port} **`);
});