const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const cartSchema = new mongoose.Schema({
    idProduct: {
        type: String,
    },
    user: {
        type:String,
    }
    
});


module.exports = mongoose.model('Cart', cartSchema);