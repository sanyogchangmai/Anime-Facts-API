const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");

const protect = asyncHandler(async(req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        if(token) {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Get user from token
            User.findById({_id: decoded.id}).select("-password")
            .then((response) => {
                req.user = response;
                next();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    message: "Failed to authorize."
                })
            })
        }
        else {
            res.status(401);
            throw new Error("Not authorized, cannot find token.");
        }
    }
    else {
        res.status(401).json({
            status: "error",
            message: "Not authorized, token is missing."
        })
    }
})

module.exports = { protect }