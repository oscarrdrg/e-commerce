const express = require('express');
const router = express.Router();
const {
  catchErrors
} = require('../handlers/errorHandlers');
const authController = require('../controllers/authController');


//Import controllers
const productsController = require('../controllers/productsController');
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
  //le pasamos un objeto con el "title" de la página. Esta información se pone en
  //la estructura "LOCALS" de la RESPONSE. Otras variables
  //que necesita el layout las sacará de valores que podemos poner en el LOCALS
  //por defecto, se hace en el app.js, y que estaran en TODOS LOS OBJETOS RESPONSE que
  //HAGAMOS.

  menu = [{
      slug: '/products',
      title: 'Products',
    },
    {
      slug: '/cart',
      title: 'Shopping Cart',
    },
    {
      slug: '/add',
      title: 'Add',
    },
  ];

  res.render('extendingLayout', {
    title: 'E-Commerce',
    menu: menu
  });
});



//renderizamos un .pug que extiende (completa) el testLayout.pug
router.get('/extendinglayout/', (req, res) => {
  //le pasamos un objeto con el "title" de la página. Esta información se pone en
  //la estructura "LOCALS" de la RESPONSE. Otras variables
  //que necesita el layout las sacará de valores que podemos poner en el LOCALS
  //por defecto, se hace en el app.js, y que estaran en TODOS LOS OBJETOS RESPONSE que
  //HAGAMOS.

  menu = [{
      slug: '/products',
      title: 'Products',
    },
  ];

  res.render('extendingLayout', {
    title: 'E-Commerce',
    menu: menu
  });
});


//Router calls a Controller and its method to do the job
//objects req res are being passed to the controller
router.get('/index/', productsController.homePage);
router.get('/add/', productsController.addProduct);

router.post('/add/',
  productsController.verify, //verify type image
  catchErrors(productsController.upload), //resize and upload to filesystem
  catchErrors(productsController.createProduct) //save in DB
);

// SHOW a certain PRODUCT
router.get('/product/:slug', catchErrors(productsController.getProductBySlug));


//1st step SIGN-UP a USER -> show the form
router.get('/register', userController.registerForm);

//2nd step SIGN-UP a USER -> validate, register, login
router.post('/register',
  userController.validationRules(),
  userController.validationCustomRules(),
  userController.validateRegister,
  userController.register,
  authController.login
);

// SHOW all PRODUCTS
router.get('/products', catchErrors(productsController.getProducts));

//***API REST --> Functions offered to be consumed by the frontend via AJAX

//req.query -> /api/v1/search?q=hola
router.get('/api/v1/search', catchErrors(productsController.searchProducts));

//1st step LOG IN -> show the form
router.get('/login', authController.loginForm);

//2nd step LOG IN -> do the login
router.post('/login', authController.login);

//LOG OUT
router.get('/logout', authController.logout);

// SHOW ACCOUNT
router.get('/account',
  authController.isLoggedIn,
  userController.account
);

// EDIT ACCOUNT
router.post('/account',
  authController.isLoggedIn,
  catchErrors(userController.updateAccount)
);

router.get('/cart', productsController.cart);


router.post('/products', catchErrors(productsController.createCart));
router.post('/cart', catchErrors(productsController.deleteCart))
module.exports = router;