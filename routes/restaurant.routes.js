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

