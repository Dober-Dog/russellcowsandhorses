const mongoose = require('mongoose')
const Schema = mongoose.Schema

const horseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    sire: {
        type: String,
        required: true
    },
    dam: {
        type: String,
        required: true
    },
    registration: {
        type: Number
    },
    earnings: {
        type: String
    },
    image: {
        type: String
    },
    forSale: {
        type: Boolean
    }
})

module.exports = mongoose.model('Horse', horseSchema)