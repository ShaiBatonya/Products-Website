var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");


const users_router = require("./routes/users_router");
const products_router = require("./routes/products_router");
const categories_router = require("./routes/categories_router");
const orders_router = require("./routes/orders_router");
const payments_router = require("./routes/payments_router");
const emails_router = require("./routes/emails_router");
const system_router = require("./routes/system_router");


var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    credentials: true,
    origin: "*",
    optionsSuccessStatus: 200,
  })
);


app.use('/users', users_router);
app.use('/products', products_router);
app.use('/categories', categories_router);
app.use('/orders', orders_router);
app.use('/payments', payments_router);
app.use('/emails', emails_router);
app.use('/system', system_router);


module.exports = app;
