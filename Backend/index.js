const express = require("express");
require("dotenv").config();
const dbConnect = require("./database/connection");
dbConnect();

const CategoryRouter = require("./routes/categoryRoute");
const BookingRouter = require("./routes/bookingRoutes");
const ArtistRouter = require("./routes/artistRoutes");
const AdminRouter = require("./routes/adminRoutes");
const AuthRouter = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 5002;

//middlewares
app.use(express.json());

//Routes
app.use(CategoryRouter);
app.use(BookingRouter);
app.use(ArtistRouter);
app.use(AdminRouter);
app.use(AuthRouter);

app.listen(port, () => {
  console.log("App started successfully");
});
