const psp = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { appKey } = require("../config/config");
const { errRespHandler } = require("../functions/error-rep");
const { userSanitization } = require("../functions/userFunction");
// Bring in the User's model
const User = require("../models/User");
const Blog = require("../models/Blog");

/**
 * @TYPE POST
 * @DESC To Register the User
 * @ROUTE '/api/users/register'
 * @Access public
 */
router.post("/register", async (req, res) => {
  try {
    let { body } = req;
    let userByUsername = await User.findOne({ username: body.username });
    if (userByUsername) {
      return res
        .status(403)
        .json({ message: "Username is already taken.", status: false });
    }
    let userByEmail = await User.findOne({ email: body.email });
    if (userByEmail) {
      return res.status(403).json({
        message:
          "Email is already registred with us. Did you forget your password.",
        status: false
      });
    }

    let newUser = new User({
      ...body
    });

    const hashedPassword = await bcrypt.hash(newUser.password, 12);
    newUser.password = hashedPassword;
    // Save the User to the Database
    await newUser.save();

    return res.status(201).json({
      message:
        "Hurray! Your account is created. Please go to the login page and authenticate with us.",
      status: true
    });
  } catch (err) {
    // User morgan logger in order to log the things for debugging
    errRespHandler(res);
  }
});

/**
 * @TYPE POST
 * @DESC To Authenticate the User
 * @ROUTE '/api/users/login'
 * @Access public
 */
router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    // Check if the user with the username exists
    let user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Username not found.", status: false });
    }
    // Check if the password is matching
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ message: "Incorrect password", status: false });
    }

    // Assign the json webtoken to the user
    let token = jwt.sign(
      {
        user_id: user._id,
        email: user.email,
        username: user.username
      },
      appKey,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      token: `Bearer ${token}`,
      tokenExpiration: 2,
      user: {
        user_id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    // User morgan logger in order to log the things for debugging
    errRespHandler(res);
  }
});

/**
 * @TYPE GET
 * @DESC To get the user's profile
 * @ROUTE '/api/users/profile?username={param}'
 * @Access public
 */
router.get("/profile", async (req, res) => {
  let { username } = req.query;
  try {
    let users = await User.find({ username });
    let results = users.map(user => userSanitization(user));
    return res.status(200).json(results);
  } catch (err) {
    errRespHandler(res);
  }
});

/**
 * @TYPE GET
 * @DESC To Get Authenticated the User's profile
 * @ROUTE '/api/users/auth-pofile'
 * @Access private
 */
router.get(
  "/auth-profile",
  psp.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let authUser = userSanitization(req.user);
      return res.status(200).json(authUser);
    } catch (err) {
      errRespHandler(res);
    }
  }
);

/**
 * @TYPE Get
 * @DESC To Get User's Blogs
 * @ROUTE '/api/users/blogs'
 * @Access public
 */

module.exports = router;
