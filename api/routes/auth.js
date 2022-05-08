const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

/*
 * if creating something then use router.post
 * if updating existing model then use router.put
 * if deleting some model then suse router,delete
 * if fetching data then use router.get
*/

/*
 * req (request) -> is whatever we are sending to our server
 * res (response) -> after all process we are gonna get arespose i.e new user created, etc
*/

/*
  we are gonna add the user and it gonna go in the database then try to create a newone and then send
  us a response and all of this will take some time and this is done by -> async() fn <-
*/

//REGISTER -> for register request to server by user(creating new user)
router.post("/register", async (req, res) => {

  // try and catch method is used when used async funtion
  try {
    const salt = await bcrypt.genSalt(10);
    // used hashedPass so that in database no one can see password i.e hashing it
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // creating new user using UserSchema
    /* 
      remember we used user model with schemas i.e
      const newUser  = new model_name({schema format})
    */
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    // and now saving it to database (used await cz of async fn)
    const user = await newUser.save();
    res.status(200).json(user); // sending javascript object
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN -> for login request to server by user
router.post("/login", async (req, res) => {
  try {
    // userName comaparing
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");

    // Password comparing
    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");

    // not all details except password when successfully logged in
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;