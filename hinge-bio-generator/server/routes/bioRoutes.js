const express = require("express");
const { generatePromptAnswers } = require("../controllers/bioController");

const router = express.Router();
router.post("/generate-prompts", generatePromptAnswers);

module.exports = router;