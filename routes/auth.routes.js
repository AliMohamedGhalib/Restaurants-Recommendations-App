const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");


// Sign up routes
router.get("/sign-up", (req, res) => {
  try {
    res.render("auth/sign-up.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.post("/sign-up", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send("Username already taken.");
    }

    if (req.body.password.length < 4) {
      return res.send("Password must be at least 4 characters long.");
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    console.log(user);
    res.redirect("/auth/sign-in");
  } catch (error) {
    console.log(error);
    res.redirect("/auth/sign-up");
  }
});



// Sign in routes
router.get("/sign-in", (req, res) => {
  try {
    res.render("auth/sign-in.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});



router.post("/sign-in", async (req, res) => {
  try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send("Login failed. Please try again.");
    }

    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send("Login failed. Please try again.");
    }

    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };

    console.log(req.session.user);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/auth/sign-in");
  }
});


router.get("/sign-out", (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});





module.exports = router;
