const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require('passport');
const connectDB = require("./config/db");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const booksRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");


require('dotenv').config({path: './config/.env'});
console.log("Mongo URI:", process.env.DB_STRING);

const app = express();

// connect to database
connectDB()

// Passport config
require("./middleware/passport");

// Middleware
app.set("view engine", "ejs"); // Set EJS as template engine
app.use(express.static("public")); // Serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
 

// Setup Sessions - stored in MongoDB
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),// Store session in mongoDB
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1-day session expiry
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());




// Routes
app.use("/", authRoutes);
app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/admin", adminRoutes);


app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
}) 