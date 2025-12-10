const { generateAnswers } = require("../utils/generator");

const generatePromptAnswers = async (req, res) => {
  try {
    const { selectedPrompts, ...userParams } = req.body;
    
    if (!selectedPrompts?.length) {
      return res.status(400).json({ error: "No prompts selected" });
    }

    const { promptAnswers, metadata } = await generateAnswers(userParams, selectedPrompts);

    res.json({
      success: true,
      data: { userParams, promptAnswers, metadata }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { generatePromptAnswers };