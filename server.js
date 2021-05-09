const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");

const passportControl = require("./lib/passport-control");

var cors = require("cors");

// Set up express app
const express = require("express");
const app = express();
const port_no = process.env.PORT || 4000;

app.use(cors());

// Set up mongoose
db_url = "mongodb://localhost:27017/passport";

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

// Add middleware
app.use(cookieParser());
app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: db_url }),
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use(passportControl.initialize());
app.use(passportControl.session());

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Routes
app.use("/", require("./routes"));

// Start express server on port no.
app.listen(port_no, () => {
  console.log(`Server started on port ${port_no}`);
});
