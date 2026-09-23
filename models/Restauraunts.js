const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    
    name: {
      type: String,
      required: true,
    },
    hasDineIn: Boolean,
    hasDriveThrough: Boolean,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    priceLevel: Number

}, {timestamps: true});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;