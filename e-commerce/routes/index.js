const express = require('express');
const router = express.Router();
const {
  catchErrors
} = require('../handlers/errorHandlers');
const authController = require('../controllers/authController');


//Import controllers
const productsController = require('../controllers/productsController');
const userController = require('../controllers/userController');
const paypalController = require('../controllers/paypalController');



router.get('/', productsController.homePage);



//renderizamos un .pug que extiende (completa) el testLayout.pug
router.get('/extendinglayout/', productsController.homePage);



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
router.post('/cart', catchErrors(productsController.deleteCart));

router.get('/checkout', authController.isLoggedIn, catchErrors(paypalController.doPayment));
router.get('/success', catchErrors(paypalController.executePayment));
router.get('/cancel', paypalController.isCanceled);



module.exports = router;