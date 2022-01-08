const express = require("express");
const { route, post } = require("./appointment.router");
const router = express.Router();

const { insertUser, getUserByEmail } = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { json } = require("body-parser");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");

router.all("/", (req, res, next) => {
  //res.json({ message: "return from user router" }); //sending the response back

  next();
});

//Create new user route
router.post("/", async (req, res) => {
  const { name, IDnumber, email, password, phone, gender, age } = req.body;

  try {
    //hash password
    const hashedPass = await hashPassword(password);

    const newUserObj = {
      name,
      IDnumber,
      email,
      password: hashedPass,
      phone,
      gender,
      age,
    };
    const result = await insertUser(newUserObj);
    console.log(result);

    res.json({ message: "New user created.", result });
  } catch (error) {
    console.log(error);
    res.json({ statux: "error", message: error.message });
  }
});

//user sign in router
router.post("/login", async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  ///hash our password and compaire with the db one

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid form submition!" });
  }

  ///get user with email from db

  const user = await getUserByEmail(email);

  const passFromDb = user && user._id ? user.password : null;

  if (!passFromDb)
    return res.json({
      status: "error",
      message: "Invalid form email or password!",
    });

  const result = await comparePassword(password, passFromDb);

  if (!result) {
    return res.json({
      status: "error",
      message: "Invalid form email or password!",
    });
  }

  const accessJWT = await createAccessJWT(user.email, `${user._id}`);
  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

  res.json({
    status: "success",
    message: "Login successfully!",
    accessJWT,
    refreshJWT,
  });
});
module.exports = router;
