const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoProduct = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
const passport = require('passport');
const cors = require('cors');
require('./handlers/passport');


// create our Express app
const app = express();

// usamos corse para el paypal
app.use(cors());

// serves up static files from the public folder. Anything in public/ will just be 
// served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// VIEWS: this is the folder where we keep our pug files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // we use the engine pug

//Express body-parser implementation -> access to req.body
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({
  extended: true
})); //Parse URL-encoded bodies

// populates req.cookies with any cookies that came along with the request
//app.use(cookieParser());

// use of express-session -> HTTP is stateless
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY, //name of the cookie
  resave: false,
  saveUninitialized: false,
  //the session is stored in the DB
  product: MongoProduct.create({
    mongoUrl: process.env.DATABASE
  })
}));

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
//MIDDLEWARE: there is a pipeline between the req and the res, this is a step in between
app.use((req, res, next) => {
  //res.locals -> response local variables scoped to the request

  res.locals.h = helpers;
  res.locals.flashes = req.flash();

  //aqui ponemos los flashes del REQ para que este disponibles en el LOCALS del RES
  //requiere uso de sesiones para la consistencia entre el REQ del ciclo anterior y el nuevo

  res.locals.currentPath = req.path;
  res.locals.user = req.user || null;

  next(); //Go to the next middleware in the REQ-RES CYCLE
});





//ROUTER: anytime someone goes to "/anything", we will handle it with the module "routes"
app.use('/', routes);

// If above routes didnt work -> error 404 and forward to error handler
app.use(errorHandlers.notFound);
//if errors are just BD validation errors -> show them in flashes
app.use(errorHandlers.flashValidationErrors);
// Otherwise this was a really bad error we didn't expect!
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}
/* production error handler */
app.use(errorHandlers.productionErrors);




module.exports = app;