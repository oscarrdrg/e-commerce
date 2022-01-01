const paypal = require('paypal-rest-sdk');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');
const History = mongoose.model('History');
const Product = mongoose.model('Product');
const CLIENT = 'AQX9vJhSkyNrGasUCsyw4jyHB5QhIEY84f6qZw0qxUOYBF69EQfs5bU8l5HwgZc9lGnqwgbmuFezv8hX'
const SECRET = 'EOQ1eS7AeMqPBtvYhh0GfUFQwEYn_bJHbveTn3OLrEfV-qdppwH3nR-jdkGCaFZf8ygzjRVmTrk-dIBe'

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': CLIENT,
    'client_secret': SECRET
});

exports.doPayment = async (req, res) => {

    const carts = await Cart.find({
        user: req.user._id
    });
    let precioFinal = 0;
    let item_list = [];

    carts.forEach((cart) => {
        precioFinal = precioFinal + (cart.idProduct.price * cart.num);
        const item = {
            name: cart.idProduct.name,
            sku: cart.idProduct._id,
            price: cart.idProduct.price,
            currency: "EUR",
            quantity: cart.num
        }

        item_list.push(item);

    })




    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "application_context": {
            brand_name: "E-Commerce"
        },
        "redirect_urls": {
            "return_url": "http://localhost:7777/success",
            "cancel_url": "http://localhost:7777/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": item_list
            },

            "amount": {
                "currency": "EUR",
                "total": precioFinal
            },
            "description": "E-Commerce"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    req.flash('success', 'Compra realizada con exito')
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });


}

exports.executePayment = async (req, res) => {

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    let listProduct = [];

    const carts = await Cart.find({
        user: req.user._id
    });
    let precioFinal = 0;

    carts.forEach((cart) => {
        precioFinal = precioFinal + (cart.idProduct.price * cart.num);
        const newProduct = new Product({
            _id: cart.idProduct._id,
            name: cart.idProduct.name,
            price: cart.idProduct.price,
            photo: cart.idProduct.photo,
            slug: cart.idProduct.slug,
            num: cart.num
        })
        listProduct.push(newProduct);

    })

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": precioFinal
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            req.flash('success', 'Successful purchase')
            res.redirect('/products')
            const history = new History({
                idPaypal: paymentId,
                productList: listProduct,
                date: Date.now(),
                precioTotal: precioFinal,
                user: req.user._id

            });
            const savedHistory = history.save();

        }
    });

}

exports.isCanceled = (req, res) => {
    req.flash('error', 'Purchase canceled')
    res.redirect('/cart');
   

}