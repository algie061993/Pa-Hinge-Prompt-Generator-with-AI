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

const tokenize = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[\W_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const relevanceScore = (prompt, candidate) => {
  const stop = new Set([
    "the",
    "and",
    "or",
    "in",
    "of",
    "to",
    "a",
    "an",
    "is",
    "are",
    "that",
    "this",
    "it",
    "i",
    "my",
    "we",
    "you",
    "your",
    "me",
    "for",
    "with",
    "on",
    "at",
    "by",
    "from",
    "be",
  ]);
  const pTokens = tokenize(prompt).filter((t) => !stop.has(t));
  const cTokens = new Set(tokenize(candidate));
  let score = 0;
  for (const t of pTokens) if (cTokens.has(t)) score += 1;
  return score;
};

const getTemplateCandidates = (prompt, userParams) => {
  const { location, keyInterests, desiredVibe } = userParams;
  const city = location?.split(",")[0] || "here";
  const i1 = keyInterests?.[0] || "new experiences";
  const i2 = keyInterests?.[1] || i1;
  const vibe = desiredVibe?.toLowerCase() || "default";

  // Normalize lookup: allow slightly different prompt text (case/whitespace)
  let promptKey = Object.keys(PROMPT_ANSWERS).find(
    (k) => k.toLowerCase().trim() === (prompt || "").toLowerCase().trim()
  );

  // Fallback: find a prompt key that shares meaningful tokens with the provided prompt
  if (!promptKey) {
    const pTokens = tokenize(prompt);
    promptKey = Object.keys(PROMPT_ANSWERS).find((k) => {
      const kTokens = tokenize(k);
      const common = kTokens.filter((t) => pTokens.includes(t));
      return common.length >= 1; // at least one token matches
    });
  }

  const promptData = PROMPT_ANSWERS[promptKey];
  const answers = promptData?.[vibe] ||
    promptData?.default || [
      `Something meaningful about ${i1}`,
      `Genuine connection through ${i2}`,
      `Authentic experiences with ${i1}`,
    ];

  // Return both the resolved prompt key (where we found the template) and processed candidates
  const candidates = answers.map((a) =>
    a
      .replace(/{city}/g, city)
      .replace(/{i1}/g, i1)
      .replace(/{i2}/g, i2)
  );

  return { promptKey, candidates };
};

const chooseUniqueAnswer = (candidates, usedAnswers, userParams, prompt) => {
  // Rank unused candidates by relevance to the prompt
  const unused = candidates.filter((c) => !usedAnswers.has(c));
  if (unused.length > 0) {
    const ranked = unused
      .map((c) => ({ c, score: relevanceScore(prompt, c) }))
      .sort((a, b) => b.score - a.score || Math.random() - 0.5);
    // Prefer the most relevant candidate, but randomize among ties
    return ranked[0].c;
  }

  // If every candidate is already used elsewhere, pick the most relevant one and create a natural variant
  const rankedAll = candidates
    .map((c) => ({ c, score: relevanceScore(prompt, c) }))
    .sort((a, b) => b.score - a.score || Math.random() - 0.5);

  const base = rankedAll[0].c;
  const { location, keyInterests } = userParams;
  const city = location?.split(",")[0] || "here";
  const i1 = keyInterests?.[0] || "new experiences";

  const variant = `${base} • ${i1} in ${city}`;

  // Ensure the variant is truly unique by appending a counter if needed
  let candidate = variant;
  let counter = 1;
  while (usedAnswers.has(candidate)) {
    candidate = `${variant} (${counter})`;
    counter += 1;
  }

  return candidate;
};

const generateAnswers = async (userParams, selectedPrompts) => {
  const result = {};
  const metadata = {};
  const usedAnswers = new Set();

  for (const prompt of selectedPrompts) {
    // Try AI first (but avoid using the same AI answer twice), fallback to template
    const aiResult = await tryAI(prompt, userParams);
    let finalResult = null;

    if (aiResult && !usedAnswers.has(aiResult.answer)) {
      finalResult = aiResult;
    } else {
      const { promptKey: mappedPromptKey, candidates } = getTemplateCandidates(
        prompt,
        userParams
      );
      const answer = chooseUniqueAnswer(
        candidates,
        usedAnswers,
        userParams,
        prompt
      );
      finalResult = { answer, source: "Template", model: "Fast Template" };
      // store mapping for debugging / UI
      metadata[prompt] = {
        source: finalResult.source,
        model: finalResult.model,
        mappedPromptKey,
      };
    }

    // Ensure we mark the answer as used so subsequent prompts avoid duplication
    usedAnswers.add(finalResult.answer);

    result[prompt] = finalResult.answer;
    // If metadata wasn't set in the template branch, ensure it still exists (AI branch)
    if (!metadata[prompt])
      metadata[prompt] = {
        source: finalResult.source,
        model: finalResult.model,
      };
  }

  return { promptAnswers: result, metadata };
};

module.exports = { generateAnswers, getTemplateCandidates, relevanceScore };
