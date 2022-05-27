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

app.get("/", function(req,res) {
    const docsLink = "https://anime-public-api.netlify.app/";
    res.write("<h1>Welcome to Anime Facts Public API.</h1>");
    res.write("<h2>View Documentation.</h2>");
    res.write(`<a href=${docsLink}>https://anime-public-api.netlify.app/</a>`);
    res.send();
})
app.use("/api/v1/facts", require("./routes/factsRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));

// ! this will override express default handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})