require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 3001;

// const client = require("init_redis");

// client.SET("foo", "bar");

//API security
//app.use(helmet());

//handle CORS error
app.use(cors());

//MongoDB Connection Setup
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
});

if (process.env.NODE_ENV !== "production") {
  const mDb = mongoose.connection;
  mDb.on("open", () => {
    console.log("MongoDB is connected");
  });

  mDb.on("error", (error) => {
    console.log(error);
  });

  //Logger
  app.use(morgan("tiny"));
}

//set bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Load routers
const userRouter = require("./src/routers/user.router");
const appointmentRouter = require("./src/routers/appointment.router");

//Use Routers
app.use("/v1/user", userRouter);
//every time we get this request(/v1/user) it redirects to user router file and handle everything there

app.use("/v1/appointment", appointmentRouter);

//Error handler
const handleError = require("./src/utils/errorHandler");

app.use("*", (req, res, next) => {
  const error = new Error("Resources are not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  //we can receive error from the previous router or system might be generated some error
  handleError(error, res);
});

app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
});
