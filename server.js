const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const path = require("path");
// const fs = require('fs');

const mongoose = require("mongoose");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongouri = "mongodb://127.0.0.1:27017/sessions";
const app = express();

const UserModel = require("./models/user");
const { render } = require("ejs");

app.use(express.static(__dirname + "/Images"));

mongoose
  .connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("MonogoDB connected");
  });

const store = new MongoDBSession({
  uri: mongouri,
  collection: "mySessions",
});

// app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    console.log('isAuth is :',isAuth);
    next();
  } 
  else {
    res.redirect("/sign_up");
  }
};

app.use(
  session({
    secret: "For the Webtech DA",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// for the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/" + "front_mail.html"));
});

app.get("/Menu", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/" + "Menu.html"));
});

// for the  login page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/" + "login.html");
});

// logic for authentication in login
app.post("/login", async (req, res) => {
  console.log("entered the post method of the login page");
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    console.log("User not found");
    return res.redirect("/sign_up");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("invalid password");
    return res.redirect("/sign_up");
  }

  // SETS A SESSION FOR IS AUTHENTICATED AS TRUE
  req.session.isAuth = true;
  res.redirect("/Gallery");
});

// for the sign up process
app.get("/sign_up", (req, res) => {
  res.sendFile(__dirname + "/views/" + "sign_up.html");
});
// app.get("/Gallery", (req, res) => {
//   res.sendFile(__dirname + "/views/" + "Gallery.html");
// });
// for the signup logic
app.post("/sign_up", async (req, res) => {
  const { firstname, email, password, mobileno } = req.body;
  console.log("entered the post of sigup");
  console.log(firstname);
  let user = await UserModel.findOne({ email });

  if (user) {
    return res.redirect("/sign_up");
  }

  const hashedPsw = await bcrypt.hash(password, 12);

  user = new UserModel({
    firstname,
    email,
    password: hashedPsw,
    mobileno,
  });

  await user.save();
  res.redirect("/sign_up");
});

app.get("/Gallery", isAuth, (req, res) => {
  res.sendFile(__dirname + "/views/" + "Gallery.html");
});

app.get("/eng", isAuth, (req, res) => {
    res.sendFile(__dirname + "/views/" + "eng.html");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    console.log('Session destroyed')
    res.redirect("/");
  });
});

app.listen(5000);
