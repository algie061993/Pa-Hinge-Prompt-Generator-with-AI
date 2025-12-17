const express = require("express");
const { generatePromptAnswers } = require("../controllers/bioController");
const { csrfProtection, getCSRFToken } = require("../middleware/csrf");

const router = express.Router();
router.get("/csrf-token", getCSRFToken);
router.post("/generate-prompts", csrfProtection, generatePromptAnswers);

module.exports = router;