const { name } = require("ejs");
const mongoose = require("mongoose");

const restaurauntsSchema = new mongoose.Schema({

    name: String,
    hasDineIn: Boolean,
    hasDriveThrough: Boolean,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    priceLevel: Number

}, {timestamps: true});

const Restaurant = mongoose.model("Restaurants", restaurauntsSchema);

module.exports = Restaurant;