const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

User = require("../db/User");

// API entry points

// Sign up
router.post("/api/signup", (req, res) => {
  let user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  user
    .save()
    .then(() => {
      // Token
      const token = jwt.sign({ id: user.id }, "jwt_secret");
      res.json({ token: token });
    })
    .catch((err) => {
      res.status().json({});
    });
});

// Log in
router.post(
  "/api/login",
  passport.authenticate("local", {
    session: false,
  }),

  function (req, res) {
    // Token
    const token = jwt.sign({ id: req.user.id }, "jwt_secret");
    res.json({ token: token });
  }
);

// Return user data
router.get(
  "/api/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        username: "nobody",
      });
    }

    console.log("get user hit");

    res.json({
      username: req.user.username,
    });
  }
);

module.exports = router;
