const paypal = require('paypal-rest-sdk');
const Cart = require('../models/Cart');

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

    carts.forEach((cart) => {
        precioFinal = precioFinal + (cart.idProduct.price * cart.num);

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


    //const payerId = req.query.PayerID;
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const carts = await Cart.find({
        user: req.user._id
    });
    let precioFinal = 0;

    carts.forEach((cart) => {
        precioFinal = precioFinal + (cart.idProduct.price * cart.num);

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
            req.flash('success', 'Compra realizada con exito')
            res.redirect('/products')

        }
    });

}

exports.isCanceled = (req, res) => res.send('Cancelled')