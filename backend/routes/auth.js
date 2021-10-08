const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

// registering a new user
router.post("/register", async (req, res) => {
  try {
    // generate salt for hashing password (encrypting password before storing in DB)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      contactNo: req.body.contactNo,
      avatar: req.body.avatar,
      isInvestor: req.body.isInvestor,
      location: req.body.location,
      bio: req.body.bio,
    });
    // saving new user in DB and returning response
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    !user && res.status(404).json("User Not Found!");

    //decrypt password and compare
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    !validPassword && res.status(500).json("Incorrect email or password!");
    // if correct password
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
