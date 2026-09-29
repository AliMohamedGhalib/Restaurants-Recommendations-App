const express = require("express")
const router = express.Router()
const Restaurant = require("../models/Restaurant.js")
const isSignedIn = require("../middleware/is-signed-in.js")
const Category = require("../models/Category.js");


router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
    console.log(restaurants)
    res.render("restaurants/index.ejs", { restaurants })
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})

router.get("/new", isSignedIn, async (req, res) => {
  try {
    const categories = await Category.find()
    res.render("restaurants/new.ejs", { categories })
  } catch (error) {
    console.log(error)
    res.redirect("/restaurants")
  }
})

router.get("/mine", isSignedIn, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.session.user._id })
    console.log(restaurants)
    res.render("restaurants/mine.ejs", { restaurants })
  } catch (error) {
    console.log(error)
    res.redirect("/restaurants")
  }
})



router.post("/", isSignedIn, async (req, res) => {
  try {
    let categories = req.body.categories || []
    if (typeof categories === "string") {
      categories = [categories]
    }

    const restaurant = await Restaurant.create({
      name: req.body.name,
      hasDineIn: req.body.hasDineIn === "on",
      hasTakeAway: req.body.hasTakeAway === "on",
      hasDriveThrough: req.body.hasDriveThrough === "on",
      priceLevel: req.body.priceLevel,
      locationLink: req.body.locationLink,
      image: req.body.image,
      categories,
      owner: req.session.user._id
    })
    console.log(restaurant)
    res.redirect("/restaurants")
  } catch (error) {
    console.log(error)
    res.redirect("/restaurants/new")
  }
})

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate("categories")
    console.log(restaurant)
    res.render("restaurants/show.ejs", { restaurant })
  } catch (error) {
    console.log(error)
    res.redirect("/restaurants")
  }
})


router.get("/:id/edit", isSignedIn, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (restaurant.owner.toString() !== req.session.user._id.toString()) {
      return res.redirect("/restaurants")
    }
    const categories = await Category.find()
    res.render("restaurants/edit.ejs", { restaurant, categories })
  } catch (error) {
    console.log(error)
    res.redirect("/restaurants")
  }
})

router.get("/:id/delete", isSignedIn, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (restaurant.owner.toString() !== req.session.user._id.toString()) {
      return res.redirect("/restaurants")
    }
    res.render("restaurants/delete-confirm.ejs", { restaurant })
  } catch (error) {
    console.log(error)
    res.redirect("/restaurants")
  }
})

router.put("/:id", isSignedIn, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (restaurant.owner.toString() !== req.session.user._id.toString()) {
      return res.redirect("/restaurants")
    }
    let categories = req.body.categories || []
    if (typeof categories === "string") {
      categories = [categories]
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      hasDineIn: req.body.hasDineIn === "on",
      hasTakeAway: req.body.hasTakeAway === "on",
      hasDriveThrough: req.body.hasDriveThrough === "on",
      priceLevel: req.body.priceLevel,
      locationLink: req.body.locationLink,
      image: req.body.image,
      categories,
    })
    console.log(updatedRestaurant)
    res.redirect(`/restaurants/${req.params.id}`)
  } catch (error) {
    console.log(error)
    res.redirect("/restaurants")
  }
})

router.delete("/:id", isSignedIn, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (restaurant.owner.toString() !== req.session.user._id.toString()) {
      return res.redirect("/restaurants")
    }
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id)
    console.log(deletedRestaurant)
    res.redirect("/restaurants")
  } catch (error) {
    console.log(error)
    res.redirect("/restaurants")
  }
})

module.exports = router
