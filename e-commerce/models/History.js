const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, // this normalizes names
        required: 'Please enter a product name!' //"name" is mandatory
    },
    slug: String, //this element will be autogenerated
    price: {
        type: Number,
        trim: true
    },
    photo: String,
    num: Number

});

const historySchema = new mongoose.Schema({
    productList: [productSchema],
    date: Date,
    precioTotal: Number,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'

    }


});

function autopopulate(next) {
    this.populate('productList');
    next();
}

historySchema.pre('find', autopopulate);
historySchema.pre('findOne', autopopulate);


module.exports = mongoose.model('History', historySchema);