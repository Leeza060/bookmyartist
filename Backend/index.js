const express = require("express");
require("dotenv").config();
const dbConnect = require("./database/connection");
dbConnect();

const CategoryRouter = require("./routes/categoryRoute");
const BookingRouter = require("./routes/bookingRoutes");
const ArtistRouter = require("./routes/artistRoutes");
const AdminRouter = require("./routes/adminRoutes");
const AuthRouter = require("./routes/authRoutes");
const ReccomendationRouter = require("./routes/recommendationRoutes");
const ReviewRouter = require("./routes/reviewRoutes");
const PaymentRouter = require("./routes/paymentRoutes");
const LocationRouter = require("./routes/locationRoutes");

const app = express();
const port = process.env.PORT || 5002;

//middlewares
app.use(express.json());

//Routes
app.use('/api/categories',CategoryRouter);
app.use(BookingRouter);
app.use(ArtistRouter);
app.use(AdminRouter);
app.use('/api/auth',AuthRouter);
app.use("/reccomendation", ReccomendationRouter);
app.use(ReviewRouter);
app.use(PaymentRouter);
app.use('/api/location',LocationRouter);


app.listen(port, () => {
  console.log("App started successfully");
});
