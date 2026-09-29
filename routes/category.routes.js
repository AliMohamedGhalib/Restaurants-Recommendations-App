const express = require("express");
const router = express.Router();
const Category = require("../models/Category.js");
const isSignedIn = require("../middleware/is-signed-in.js");



router.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
    console.log(categories)
    res.render("categories/index.ejs", { categories })
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})

router.get("/new", isSignedIn, (req, res) => {
  try {
    res.render("categories/new.ejs")
  } catch (error) {
    console.log(error)
    res.redirect("/categories")
  }
})

router.post("/", isSignedIn, async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      owner: req.session.user._id
    })
    console.log(category)
    res.redirect("/categories")
  } catch (error) {
    console.log(error)
    res.redirect("/categories/new")
  }
})


router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    console.log(category)
    res.render("categories/show.ejs", { category })
  } catch (error) {
    console.log(error)
    res.redirect("/categories")
  }
})

router.get("/:id/edit", isSignedIn, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    res.render("categories/edit.ejs", { category })
  } catch (error) {
    console.log(error)
    res.redirect("/categories")
  }
})

router.get("/:id/delete", isSignedIn, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    res.render("categories/delete-confirm.ejs", { category })
  } catch (error) {
    console.log(error)
    res.redirect("/categories")
  }
})

router.put("/:id", isSignedIn, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body)
    console.log(category)
    res.redirect(`/categories/${req.params.id}`)
  } catch (error) {
    console.log(error)
    res.redirect("/categories")
  }
})

router.delete("/:id", isSignedIn, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    console.log(category)
    res.redirect("/categories")
  } catch (error) {
    console.log(error)
    res.redirect("/categories")
  }
})


module.exports = router
