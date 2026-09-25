const express = require("express");
const router = express.Router();
const Category = require("../models/Category.js");
const isSignedIn = require("../middleware/is-signed-in.js");



router.get("/", async (req, res) => {
  const categories = await Category.find()
  res.render("categories/index.ejs", { categories })
})

router.get("/new", isSignedIn, (req, res) => {
  res.render("categories/new.ejs")
})

router.post("/", isSignedIn, async (req, res) => {
  await Category.create({ ...req.body, owner: req.session.user._id })
  res.redirect("/categories")
})


router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id)
  res.render("categories/show.ejs", { category })
})

router.get("/:id/edit", isSignedIn, async (req, res) => {
  const category = await Category.findById(req.params.id)
  res.render("categories/edit.ejs", { category })
})

router.put("/:id", isSignedIn, async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, req.body)
  res.redirect(`/categories/${req.params.id}`)
})

router.delete("/:id", isSignedIn, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id)
  res.redirect("/categories")
})


module.exports = router