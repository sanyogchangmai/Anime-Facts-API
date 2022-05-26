const asyncHandler = require('express-async-handler')
const Facts = require("../models/animeFactsModel");
const User = require("../models/userModel");

// ! Get all views controller
const getFacts = (req,res) => {
    let animeNameQuery = req.query.anime;
    let topicNameQuery = req.query.topic;
    let apiKey = req.header("apiKey");
    let size = req.query.size;
    let page = req.query.page;
    let query;
    
    let animeName;
    let topicName;

    if(animeNameQuery) {
        animeName = animeNameQuery[0].toUpperCase() + animeNameQuery.substring(1, animeNameQuery.length);
    }

    if(topicNameQuery) {
        topicName = topicNameQuery[0].toUpperCase() + topicNameQuery.substring(1, topicNameQuery.length);
    }

    if(animeName && topicName){
        query={
            anime: animeName, 
            topic: topicName
        }
    }
    else if(animeName && !topicName){
        query={
            anime: animeName
        }
    }
    else if(topicName && !animeName){
        query={
            topic: topicName
        }
    }
    else{
        query={}
    }

    if(!size){
        size=10;
    }
    if(!page){
        page = 1;
    }

    const limit = parseInt(size);
    const skip = (page-1) * size;

    // ! check if api key exists

    User.find({apiKey: apiKey})
    .then((result) => {
        // console.log(result);
        if(result.length !== 0) {
            Facts.find(query).limit(limit).skip(skip)
            .then((response) => {
                // console.log(response);
                res.status(200).json({
                    status: "success",
                    page: page,
                    results: response.length,
                    data: response
                })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    message: "Failed to get data."
                })
            })
        }
        else {
            res.status(401).json({
                status: "error",
                message: "Unauthorized request. Missing or invalid API Key."
            })
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).jason({
            status: "error",
            message: "Failed to verify API Key."
        })
    })
}

// ! Get random view controller
const getRandomFact = (req,res) => {
    const id = req.params.id;
    let apiKey = req.header("apiKey");
    let randomIdx;

    // ! check if api key exists
    User.find({apiKey: apiKey})
    .then((result) => {
        if(result.length !== 0) {
            Facts.find({})
            .then((response) => {
                // console.log(response);
                randomIdx = Math.floor((Math.random() * response.length) + 1);
                console.log("index " + randomIdx);
                res.status(200).json({
                    status: "success",
                    message: "Fetched successfully.",
                    results: response.length,
                    data: response[randomIdx]
                })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    message: "Failed to get data."
                })
            })
        }
        else {
            res.status(401).json({
                status: "error",
                message: "Unauthorized request. Missing or invalid API Key."
            })
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).jason({
            status: "error",
            message: "Failed to verify API Key."
        })
    })
}


// ! Get particular view controller
const getParticularFacts = (req,res) => {
    const id = req.params.id;
    let apiKey = req.header("apiKey");

    // ! check if api key exists
    User.find({apiKey: apiKey})
    .then((result) => {
        if(result.length !== 0) {
            Facts.findById(id)
            .then((response) => {
                // console.log(response);
                res.status(200).json({
                    status: "success",
                    results: response.length,
                    data: response
                })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    message: "Failed to get data."
                })
            })
        }
        else {
            res.status(401).json({
                status: "error",
                message: "Unauthorized request. Missing or invalid API Key."
            })
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).jason({
            status: "error",
            message: "Failed to verify API Key."
        })
    })
}

// ! Post controller
const addFacts = (req,res) => {
    if(!req.body){
        res.status(400)
        throw new Error("Please add a text field");
    }

    const fact = new Facts({
        anime: req.body.anime,
        topic: req.body.topic,
        tags: req.body.tags,
        body: req.body.body
    });

    fact.save()
    .then((response) => {
        console.log(response);
        res.status(200).json({
            status: "success",
            message: "Saved successfully",
            data: response
        })
    })
    .catch((err) => {
        console.log(err);
        res.json({
            status: "error",
            message: "failed to save"
        })
    })
}

// ! Update controller
const updateFacts = (req,res) => {
    const id = req.params.id;
    Facts.findByIdAndUpdate(id, req.body, {new: true})
    .then((response) => {
        console.log(response);
        res.status(200).json({
            status: "success",
            message: "Updated successfully",
            data: response
        })
    })
    .catch((err) => {
        console.log(err);
        res.json({
            status: "error",
            message: "Failed to update"
        })
    })
}

// ! Delete controller
const deleteFacts = (req,res) => {
    const id = req.params.id;
    Facts.findByIdAndRemove(id)
    .then((response) => {
        console.log(response);
        res.status(200).json({
            status: "success",
            message: "Deleted successfully",
            data: response
        })
    })
    .catch((err) => {
        console.log(err);
        res.json({
            status: "error",
            message: "Failed to delete"
        })
    })
}


// ! Delete all views
const deleteAllFacts = (req,res) => {
    Facts.deleteMany()
    .then((response) => {
        console.log(response);
        res.status(200).json({
            status: "success",
            message: "All Deleted successfully",
            data: response
        })
    })
    .catch((err) => {
        console.log(err);
        res.json({
            status: "error",
            message: "Failed to delete"
        })
    })
}


// ! Export 
module.exports = {
    getFacts,
    getRandomFact,
    getParticularFacts,
    addFacts,
    updateFacts,
    deleteFacts,
    deleteAllFacts
}