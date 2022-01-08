const express = require("express");
const router = express.Router();

router.all("/", (req, res, next) => {
  res.json({ message: "return from appointment router" }); //sending the response back
});

module.exports = router;
