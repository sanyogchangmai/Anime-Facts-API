const express = require("express");
const router = express.Router();
const { 
    getFacts,
    getRandomFact,
    getParticularFacts,
    addFacts,
    updateFacts,
    deleteFacts,
    deleteAllFacts } = require("../controllers/factsController");

router.get("/", getFacts);
router.get("/random", getRandomFact);
router.get("/:id", getParticularFacts);

// router.post("/", addFacts);

// router.put("/:id", updateFacts);

// router.delete("/:id", deleteFacts);

// router.delete("/", deleteAllFacts);

module.exports = router;