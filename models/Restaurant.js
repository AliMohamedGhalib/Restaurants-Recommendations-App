const mongoose = require("mongoose")

const restaurantSchema = new mongoose.Schema({

    
       name: {
      type: String,
      required: true,
    },
    hasDineIn: Boolean,
    hasTakeAway: Boolean,
    hasDriveThrough: Boolean,
        priceLevel: {
        type: String,
        enum: ['2BD and below', 'Above 2BD-4BD', 'Above 4BD-6BD', 'Fine Dining']
    },

    locationLink: String,

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, {timestamps: true});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;