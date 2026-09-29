const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant.js");
const Category = require("../models/Category.js");

router.get("/", (req, res) => {
  try {
    res.render("search/step1.ejs")
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})
router.post("/service", (req, res) => {
  try {
    const hasDineIn = req.body.hasDineIn === "on"
    const hasTakeAway = req.body.hasTakeAway === "on"

    if (hasTakeAway) {
      res.render("search/drivethrough.ejs", { hasDineIn, hasTakeAway })
    } else {
      res.render("search/budget.ejs", { hasDineIn, hasTakeAway, hasDriveThrough: false })
    }
  } catch (error) {
    console.log(error)
    res.redirect("/search")
  }
})
router.post("/drivethrough", (req, res) => {
  try {
    const hasDineIn = req.body.hasDineIn === "true"
    const hasTakeAway = req.body.hasTakeAway === "true"
    const hasDriveThrough = req.body.hasDriveThrough === "on"

    res.render("search/budget.ejs", { hasDineIn, hasTakeAway, hasDriveThrough })
  } catch (error) {
    console.log(error)
    res.redirect("/search")
  }
})

router.post("/budget", async (req, res) => {
  try {
    const hasDineIn = req.body.hasDineIn === "true"
    const hasTakeAway = req.body.hasTakeAway === "true"
    const hasDriveThrough = req.body.hasDriveThrough === "true"

    let priceLevels = req.body.priceLevel || []
    if (typeof priceLevels === "string") {
      priceLevels = [priceLevels]
    }


    const categories = await Category.find()
    res.render("search/category.ejs", { hasDineIn, hasTakeAway, hasDriveThrough, priceLevels, categories })
  } catch (error) {
    console.log(error)
    res.redirect("/search")
  }
})

router.post("/results", async (req, res) => {
  try {
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
      const anyServiceSelected = hasDineIn || hasTakeAway || hasDriveThrough
      if (anyServiceSelected) {
        const matchesService =
          (hasDineIn && restaurant.hasDineIn) ||
          (hasTakeAway && restaurant.hasTakeAway) ||
          (hasDriveThrough && restaurant.hasDriveThrough)
        if (!matchesService) return false
      }
      if (priceLevels.length > 0 && !priceLevels.includes(restaurant.priceLevel)) return false
      if (categoryIds.length > 0) {
        const matchesCategory = restaurant.categories.some((c) => categoryIds.includes(c.toString()))
        if (!matchesCategory) return false
      }
      return true
    })

    console.log(restaurants)
    res.render("search/results.ejs", { restaurants })
  } catch (error) {
    console.log(error)
    res.redirect("/search")
  }
})

module.exports = router
