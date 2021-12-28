const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const cartSchema = new mongoose.Schema({
    idProduct: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    num:{
        type: Number
    }

});

function autopopulate(next) {
    this.populate('user');
    this.populate('idProduct');
    next();
}

cartSchema.pre('find', autopopulate);
cartSchema.pre('findOne', autopopulate);



module.exports = mongoose.model('Cart', cartSchema);