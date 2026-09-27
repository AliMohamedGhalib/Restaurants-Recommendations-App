const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant.js");
const Category = require("../models/Category.js");

router.get("/", (req, res) => {
  res.render("search/step1.ejs")
})
router.post("/service", (req, res) => {
  const hasDineIn = req.body.hasDineIn === "on"
  const hasTakeAway = req.body.hasTakeAway === "on"

  if (hasTakeAway) {
    res.render("search/drivethrough.ejs", { hasDineIn, hasTakeAway })
  } else {
    res.render("search/budget.ejs", { hasDineIn, hasTakeAway, hasDriveThrough: false })
  }
})
router.post("/drivethrough", (req, res) => {
  const hasDineIn = req.body.hasDineIn === "true"
  const hasTakeAway = req.body.hasTakeAway === "true"
  const hasDriveThrough = req.body.hasDriveThrough === "on"

  res.render("search/budget.ejs", { hasDineIn, hasTakeAway, hasDriveThrough })
})

router.post("/budget", async (req, res) => {
  const hasDineIn = req.body.hasDineIn === "true"
  const hasTakeAway = req.body.hasTakeAway === "true"
  const hasDriveThrough = req.body.hasDriveThrough === "true"
  
  let priceLevels = req.body.priceLevel || []
  if (typeof priceLevels === "string") {
    priceLevels = [priceLevels]
  }


  const categories = await Category.find()
  res.render("search/category.ejs", { hasDineIn, hasTakeAway, hasDriveThrough, priceLevels, categories })
})

router.post("/results", async (req, res) => {
  const hasDineIn = req.body.hasDineIn === "true"
  const hasTakeAway = req.body.hasTakeAway === "true"
  const hasDriveThrough = req.body.hasDriveThrough === "true"

  let priceLevels = req.body.priceLevel || []
  if (typeof priceLevels === "string") {
    priceLevels = [priceLevels]
  }

  let categoryIds = req.body.category || []
  if (typeof categoryIds === "string") {
    categoryIds = [categoryIds]
  }

  const allRestaurants = await Restaurant.find()

  const restaurants = allRestaurants.filter((restaurant) => {
    if (hasDineIn && !restaurant.hasDineIn) return false
    if (hasTakeAway && !restaurant.hasTakeAway) return false
    if (hasDriveThrough && !restaurant.hasDriveThrough) return false
    if (priceLevels.length > 0 && !priceLevels.includes(restaurant.priceLevel)) return false
    if (categoryIds.length > 0 && !categoryIds.includes(restaurant.category.toString())) return false
    return true
  })

  res.render("search/results.ejs", { restaurants })
})

module.exports = router
