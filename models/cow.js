const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cowSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brandNumber: {
        type: Number,
        required: true
    },
    registration: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    sire: {
        type: String
    },
    dam: {
        type: String
    },
    image: {
        type: String
    },
    forSale: {
        type: Boolean
    }
})

module.exports = mongoose.model('Cow', cowSchema)