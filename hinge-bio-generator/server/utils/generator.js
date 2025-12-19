const axios = require("axios");
const { PROMPT_ANSWERS } = require("./prompts");

const tryAI = async (prompt, userParams) => {
  if (!process.env.HUGGINGFACE_API_KEY) return null;

  try {
    const { location, keyInterests, desiredVibe, tone, gender } = userParams;
    const aiPrompt = `Write a Hinge bio answer for: "${prompt}"
Profile: ${gender}, ${location}, loves ${keyInterests?.join(
      " & "
    )}, ${desiredVibe}, ${tone}
Rules: Natural, 1-2 sentences, show personality`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
      { inputs: aiPrompt },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
        timeout: 5000,
      }
    );

    if (response.data?.[0]?.generated_text) {
      const text = response.data[0].generated_text.replace(aiPrompt, "").trim();
      if (text.length > 20) {
        return { answer: text, source: "AI", model: "Phi-3" };
      }
    }
  } catch (error) {
    // AI failed, will use template
    console.error("AI generation error:", error.message);
    return null;
  }
  return null;
};

const generateTemplate = (prompt, userParams) => {
  const { location, keyInterests, desiredVibe } = userParams;
  const city = location?.split(",")[0] || "here";
  const i1 = keyInterests?.[0] || "new experiences";
  const i2 = keyInterests?.[1] || i1;
  const vibe = desiredVibe?.toLowerCase() || "default";

  const promptData = PROMPT_ANSWERS[prompt];
  const answers = promptData?.[vibe] ||
    promptData?.default || [
      `Something meaningful about ${i1}`,
      `Genuine connection through ${i2}`,
      `Authentic experiences with ${i1}`,
    ];

  // Randomly select from available answers
  const randomIndex = Math.floor(Math.random() * answers.length);
  const answer = answers[randomIndex]
    .replace(/{city}/g, city)
    .replace(/{i1}/g, i1)
    .replace(/{i2}/g, i2);

  return { answer, source: "Template", model: "Fast Template" };
};

const generateAnswers = async (userParams, selectedPrompts) => {
  const result = {};
  const metadata = {};

  for (const prompt of selectedPrompts) {
    // Try AI first, fallback to template
    const aiResult = await tryAI(prompt, userParams);
    const finalResult = aiResult || generateTemplate(prompt, userParams);

    result[prompt] = finalResult.answer;
    metadata[prompt] = { source: finalResult.source, model: finalResult.model };
  }

  return { promptAnswers: result, metadata };
};

module.exports = { generateAnswers };
