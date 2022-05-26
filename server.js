const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

connectDB();

// ! Initialize express app
const app = express();

// ! Tmiddleware to grab request body
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors());

app.use("/api/v1/facts", require("./routes/factsRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));

// ! this will override express default handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})