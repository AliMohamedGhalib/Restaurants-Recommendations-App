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
