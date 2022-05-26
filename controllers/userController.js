const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler')
const User = require("../models/userModel");
const generateUniqueId = require('generate-unique-id');


const registerUser = (req, res) => {
    const {email, password} = req.body;

    // ! handle missing data, bad request
    if(!email || !password) {
        res.status(400).json({
            status: "error",
            message: "Email or password is missing."
        });
    }

    // ! check for already existing user
    User.findOne({email: email})
    .then((response) => {
        if(response !== null) {
            res.status(400).json({
                status: "error",
                message: "User already exists."
            })
        }
        else {
            // ! Hash password
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
            // ! Create user
            const userCredentials = new User({
                email: req.body.email,
                password: hash,
                apiKey: null
            });

            userCredentials.save()
            .then((response) => {
                // console.log(response);
                res.status(201).json({
                    status: "success",
                    message: "User created successfully.",
                    data: {
                        id: response._id,
                        email: response.email,
                        token: generateToken(response._id)
                    }
                })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    message: "Failed to create user.",
                    data: err
                })
            })  
        }
    })
}

// ! Post user login
const loginUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
    .then((response) => {
        // console.log(response);
        if(response === null) {
            res.status(400).json({
                status: "error",
                message: "No user exists with this email."
            }) 
        }
        else {
            if(bcrypt.compareSync(password, response.password) === true) {
                res.status(201).json({
                    status: "success",
                    message: "User authenticated successfully.",
                    data: {
                        id: response._id,
                        name: response.name,
                        email: response.email,
                        token: generateToken(response._id)
                    }
                })
            }
            else {
                res.status(403).json({
                    status: "error",
                    message: "Invalid password."
                })
            }
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            status: "success",
            message: "User authenticated successfully."
        })
    })
}

// ! Get user data
const getUserData = (req,res) => {
    User.find({_id: req.user.id})
    .then((response) => {
        // console.log(response);
        res.status(200).json({
            status: "success",
            message: "Data fetched successfully.",
            data: {
                email: response[0].email,
                apiKey: response[0].apiKey
            }
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            status: "error",
            message: "Failed to get data.",
        })
    })
}

// ! Generate API_KEY
const getUserAPIKEY = (req, res) => {
    const key = generateUniqueId();
    const API_KEY = key+req.user.id;

    User.findOneAndUpdate({ apiKey: req.user.apiKey }, { apiKey: API_KEY }, {new: true})
    .then((response) => {
        // console.log(response);
        res.status(200).json({
            status: "success",
            message: "API key generated successfully.",
            data: {
                apiKey: response.apiKey
            }
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            status: "error",
            message: "Failed to generate API key. Try again."
        })
    })
}

// ! Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUserData,
    getUserAPIKEY
}