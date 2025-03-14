const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require('passport');
const connectDB = require("./config/db");
const MongoStore = require("connect-mongo");
const booksRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const flash = require("connect-flash");
const paymentRoutes = require("./routes/payment");


require('dotenv').config();
console.log("Cloudinary Config:");
console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("API Key:", process.env.API_KEY ? "Loaded ✅" : "Not Found ❌");
console.log("API Secret:", process.env.API_SECRET ? "Loaded ✅" : "Not Found ❌");


const app = express();

// connect to database
connectDB()

// Passport config
require("./middleware/passport");

// Middleware
app.set("view engine", "ejs"); // Set EJS as template engine
app.use(express.static("public")); // Serve static files
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
 

// Setup Sessions - stored in MongoDB
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),// Store session in mongoDB
      cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 1-day session expiry
        secure: false, // Set to `true` if using HTTPS
        httpOnly: true,
     }, 
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware for making `req.user` available in all views
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});



// Routes
app.use("/", authRoutes);
app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/admin", adminRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/", paymentRoutes);


app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
}) 