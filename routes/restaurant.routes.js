const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant.js");
const isSignedIn = require("../middleware/is-signed-in.js");

router.get("/", async (req, res) => {
  const restaurants = await Restaurant.find()
  res.render("restaurants/index.ejs", { restaurants })
})

router.get("/new", isSignedIn, (req, res) => {
  res.render("restaurants/new.ejs")
})

router.post("/", isSignedIn, async (req, res) => {
  await Restaurant.create({ ...req.body, owner: req.session.user._id })
  res.redirect("/restaurants")
})

router.get("/:id", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
  res.render("restaurants/show.ejs", { restaurant })
})


router.get("/:id/edit", isSignedIn, async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
  if (restaurant.owner.toString() !== req.session.user._id.toString()) {
    return res.redirect("/restaurants")
  }
  res.render("restaurants/edit.ejs", { restaurant })
})

router.put("/:id", isSignedIn, async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
  if (restaurant.owner.toString() !== req.session.user._id.toString()) {
    return res.redirect("/restaurants")
  }
  await Restaurant.findByIdAndUpdate(req.params.id, req.body)
  res.redirect(`/restaurants/${req.params.id}`)
})

router.delete("/:id", isSignedIn, async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
  if (restaurant.owner.toString() !== req.session.user._id.toString()) {
    return res.redirect("/restaurants")
  }
  await Restaurant.findByIdAndDelete(req.params.id)
  res.redirect("/restaurants")
})

module.exports = router