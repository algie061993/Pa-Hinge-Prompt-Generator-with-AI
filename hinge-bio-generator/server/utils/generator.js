const axios = require("axios");
const { PROMPT_ANSWERS } = require("./prompts");

// Embedding cache to avoid repeated remote calls
const embeddingCache = new Map();

const tryAI = async (prompt, userParams) => {
  if (!process.env.HUGGINGFACE_API_KEY) return null;

  try {
    const { keyInterests, desiredVibe, gender } = userParams;
    const aiPrompt = `Write a Hinge bio answer for: "${prompt}"
Profile: ${gender}, loves ${keyInterests?.join(" & ")}, ${desiredVibe}
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

// Helper: cosine similarity
const cosineSim = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

// Get embedding for text using OpenAI (preferred) or Hugging Face (fallback). Caches results.
const getEmbedding = async (text) => {
  if (!text) return null;
  if (embeddingCache.has(text)) return embeddingCache.get(text);

  try {
    // OpenAI embeddings
    if (process.env.OPENAI_API_KEY) {
      const resp = await axios.post(
        "https://api.openai.com/v1/embeddings",
        { model: "text-embedding-3-small", input: text },
        {
          headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          timeout: 8000,
        }
      );
      const emb = resp.data?.data?.[0]?.embedding || null;
      if (emb) embeddingCache.set(text, emb);
      return emb;
    }

    // Hugging Face feature-extraction pipeline (sentence-transformers)
    if (process.env.HUGGINGFACE_API_KEY) {
      const model = "sentence-transformers/all-MiniLM-L6-v2";
      const resp = await axios.post(
        `https://api-inference.huggingface.co/pipeline/feature-extraction/${model}`,
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
          timeout: 8000,
        }
      );
      // Response is usually an array (or array of arrays)
      const data = resp.data;
      const emb =
        Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
      if (emb) embeddingCache.set(text, emb);
      return emb;
    }
  } catch (err) {
    // ignore and fall back to token-based scoring
    console.error(
      "Embedding fetch failed:",
      err && err.message ? err.message : err
    );
  }
  return null;
};
const relevanceScore = (prompt, candidate, extraTokens = []) => {
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

  // Boost score if candidate contains important extra tokens (e.g., keyInterests, city)
  for (const extra of extraTokens) {
    if (!extra) continue;
    const tok = extra.toLowerCase();
    if (candidate.toLowerCase().includes(tok)) score += 2;
  }

  return score;
};

// Compute a combined score using token overlap and optional embeddings (async)
const combinedScore = async (prompt, candidate, extraTokens = []) => {
  const tokenScore = relevanceScore(prompt, candidate, extraTokens);
  // If we have embedding capabilities available, compute semantic similarity
  const embPrompt = await getEmbedding(prompt).catch(() => null);
  const embCandidate = await getEmbedding(candidate).catch(() => null);
  if (embPrompt && embCandidate) {
    const sem = cosineSim(embPrompt, embCandidate);
    // Combine as tokenScore + weighted semantic (scale to make semantic influential)
    return tokenScore + sem * 4;
  }
  return tokenScore;
};

const getTemplateCandidates = (prompt, userParams) => {
  const { keyInterests, desiredVibe } = userParams;
  const city = "here"; // location removed from user input — default to 'here'
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

  // Prefer same-vibe templates, then default, then any non-empty vibe in the same prompt
  let answers = [];
  if (promptData) {
    if (Array.isArray(promptData[vibe]) && promptData[vibe].length)
      answers = promptData[vibe];
    else if (Array.isArray(promptData.default) && promptData.default.length)
      answers = promptData.default;
    else {
      for (const arr of Object.values(promptData)) {
        if (Array.isArray(arr) && arr.length) {
          answers = arr;
          break;
        }
      }
    }
  }

  // If no answers found in this prompt (can happen after dedupe), borrow from the best-matching prompt that has templates
  if (!answers || answers.length === 0) {
    let bestKey = null;
    let bestScore = -1;
    let bestAnswers = [];

    for (const [k, obj] of Object.entries(PROMPT_ANSWERS)) {
      for (const arr of Object.values(obj)) {
        if (!Array.isArray(arr) || arr.length === 0) continue;
        // compute best relevance between any candidate and the prompt text
        const score = Math.max(
          ...arr.map((a) => relevanceScore(prompt, a, [i1, i2, city]))
        );
        if (score > bestScore) {
          bestScore = score;
          bestKey = k;
          bestAnswers = arr;
        }
      }
    }

    if (bestAnswers.length) {
      answers = bestAnswers;
      promptKey = `${bestKey} (borrowed)`;
    }
  }

  // As a final fallback create small generic templates
  if (!answers || answers.length === 0) {
    answers = [
      `I love ${i1} and finding the humor in it`,
      `Making ${i2} more fun around ${city}`,
      `Sharing stories about ${i1} is my thing`,
    ];
    promptKey = `${promptKey || "fallback"} (generated)`;
  }

  // Return both the resolved prompt key (where we found the template) and processed candidates
  const candidates = answers.map((a) =>
    a
      .replace(/{city}/g, city)
      .replace(/{i1}/g, i1)
      .replace(/{i2}/g, i2)
  );

  return { promptKey, candidates };
};

// Helper: pick randomly among the top N ranked candidates (adds variation between runs)
const pickFromTop = (ranked, n = 3) => {
  if (!ranked || ranked.length === 0) return null;
  const top = ranked.slice(0, Math.max(1, Math.min(n, ranked.length)));
  const choice = top[Math.floor(Math.random() * top.length)];
  return choice.c || choice;
};

// Helper: sanitize a candidate so it's short, declarative, and not a hook question
const sanitizeCandidate = (text, maxWords = 14) => {
  if (!text || typeof text !== "string") return text;

  let s = text.trim();

  // If there's an explicit question fragment after a dash or em-dash, remove that fragment
  s = s.replace(/\s*[—\-]\s*[^.?!]*\?/g, "");

  // Remove any remaining question marks and trailing question fragments
  s = s.replace(/\?/g, "");

  // Collapse multiple spaces and trim
  s = s.replace(/\s+/g, " ").trim();

  // Shorten to maxWords to keep answers concise
  const words = s.split(" ");
  if (words.length > maxWords) {
    s = words.slice(0, maxWords).join(" ") + "…";
  }

  // Ensure it doesn't end with incomplete punctuation
  s = s.replace(/[–—\-\s]+$/g, "");

  // Capitalize the first character for polish
  s = s.charAt(0).toUpperCase() + s.slice(1);

  return s;
};

// Small randomized variant helper to introduce harmless differences between runs
const randomVariant = (text, i1 = null, i2 = null) => {
  if (!text || Math.random() > 0.5) return text; // 50% of the time leave it unchanged

  const variants = [];
  // Simple synonym swaps
  variants.push(text.replace(/^I love/i, "I adore"));
  variants.push(text.replace(/^I love/i, "I’m into"));
  variants.push(text.replace(/\bI love\b/i, "I dig"));

  // Short appended flourishes (keeps it short)
  if (i1) variants.push(`${text} — especially ${i1}`);
  if (i2) variants.push(`${text} — low-key about ${i2}`);
  variants.push(`${text} — low-key`);
  variants.push(`${text} ✨`);

  // Filter out variants identical to original and sanitize
  const cleaned = variants
    .map((v) => sanitizeCandidate(v))
    .filter((v) => v && v !== sanitizeCandidate(text));

  if (!cleaned.length) return text;
  return cleaned[Math.floor(Math.random() * cleaned.length)];
};

const chooseUniqueAnswer = async (
  candidates,
  usedAnswers,
  userParams,
  prompt
) => {
  // Extract user tokens for improved scoring
  const { keyInterests } = userParams || {};
  const city = "here"; // location removed — default to 'here'
  const i1 = keyInterests?.[0] || "new experiences";
  const i2 = keyInterests?.[1] || i1;

  // Rank unused candidates by relevance to the prompt (boost matches on i1/city and embeddings if available)
  const unused = candidates.filter((c) => !usedAnswers.has(c));
  if (unused.length > 0) {
    // Prefer candidates that explicitly mention the user's interests (i1 or i2)
    const prefer = unused.filter(
      (c) =>
        c.toLowerCase().includes((i1 || "").toLowerCase()) ||
        (i2 && c.toLowerCase().includes(i2.toLowerCase()))
    );

    const pool = prefer.length ? prefer : unused;

    // Compute combined async scores (semantic + token)
    const scored = await Promise.all(
      pool.map(async (c) => ({
        c,
        score: await combinedScore(prompt, c, [i1, city]),
      }))
    );

    const ranked = scored.sort(
      (a, b) => b.score - a.score || Math.random() - 0.5
    );

    // Prefer the most relevant candidate but randomly pick among top 3 to increase variation
    const top = pickFromTop(ranked, 3);
    const topLower = (top || "").toLowerCase();

    // Only append an interest clause when it feels contextually appropriate (heuristic)
    const interestTriggers = [
      "want",
      "looking",
      "tips",
      "travel",
      "this year",
      "recommend",
      "teach",
      "learn",
      "i want",
      "want to",
      "looking for",
      "give me",
    ];
    const promptLower = (prompt || "").toLowerCase();

    if (
      i1 &&
      i1 !== "new experiences" &&
      !topLower.includes(i1.toLowerCase()) &&
      !(i2 && topLower.includes(i2.toLowerCase())) &&
      interestTriggers.some((t) => promptLower.includes(t))
    ) {
      // Append a natural interest mention when none exists in the chosen candidate
      let candidate = `${top} — I especially love ${i1}.`;
      candidate = sanitizeCandidate(candidate);
      candidate = randomVariant(candidate, i1, i2);
      let ctr = 1;
      while (usedAnswers.has(candidate)) {
        candidate = randomVariant(
          sanitizeCandidate(`${top} — I especially love ${i1} (${ctr}).`),
          i1,
          i2
        );
        ctr += 1;
      }
      return candidate;
    }

    return randomVariant(sanitizeCandidate(top), i1, i2);
  }

  // If every candidate is already used elsewhere, pick the most relevant one and create a natural variant
  const scoredAll = await Promise.all(
    candidates.map(async (c) => ({
      c,
      score: await combinedScore(prompt, c, [i1, city]),
    }))
  );
  const rankedAll = scoredAll.sort(
    (a, b) => b.score - a.score || Math.random() - 0.5
  );

  // If there are no candidates at all, fall back to a small generated candidate
  if (!rankedAll || rankedAll.length === 0) {
    let candidate = `I love ${i1} in ${city}`;
    candidate = randomVariant(sanitizeCandidate(candidate), i1, i2);
    let counter = 1;
    while (usedAnswers.has(candidate)) {
      candidate = randomVariant(
        sanitizeCandidate(`I love ${i1} in ${city} (${counter})`),
        i1,
        i2
      );
      counter += 1;
    }
    return candidate;
  }

  const base = rankedAll[0].c;

  // If the best base already mentions the interest or the city, just return a unique variant of it
  const baseLower = base.toLowerCase();
  if (
    baseLower.includes(i1.toLowerCase()) ||
    baseLower.includes(city.toLowerCase())
  ) {
    let candidate = randomVariant(sanitizeCandidate(base), i1, i2);
    let counter = 1;
    while (usedAnswers.has(candidate)) {
      candidate = randomVariant(
        sanitizeCandidate(`${base} (${counter})`),
        i1,
        i2
      );
      counter += 1;
    }
    return candidate;
  }

  // Otherwise, produce a natural-sounding variant that incorporates the user's interests
  let variant = `${base} — especially when it comes to ${i1} in ${city}`;
  // If i2 differs, sometimes prefer mentioning both interests concisely
  if (i2 && i2 !== i1) {
    variant = `${base} — especially for ${i1} and ${i2}`;
  }

  // Ensure the variant is truly unique by appending a counter if needed
  let candidate = randomVariant(sanitizeCandidate(variant), i1, i2);
  let counter = 1;
  while (usedAnswers.has(candidate)) {
    candidate = randomVariant(
      sanitizeCandidate(`${variant} (${counter})`),
      i1,
      i2
    );
    counter += 1;
  }

  return candidate;
};

const generateAnswers = async (userParams, selectedPrompts) => {
  const result = {};
  const metadata = {};
  const usedAnswers = new Set();

  const promptCounts = {};
  for (const prompt of selectedPrompts) {
    promptCounts[prompt] = (promptCounts[prompt] || 0) + 1;

    // Try AI first (but avoid using the same AI answer twice), fallback to template
    const aiResult = await tryAI(prompt, userParams);
    let finalResult = null;

    // Randomly prefer templates some of the time to increase variety even when AI is available
    const preferTemplateThisRun = Math.random() < 0.35; // ~35% of the time prefer templates

    if (
      aiResult &&
      !preferTemplateThisRun &&
      !usedAnswers.has(sanitizeCandidate(aiResult.answer))
    ) {
      // Sanitize AI answer before returning
      finalResult = {
        answer: sanitizeCandidate(aiResult.answer),
        source: "AI",
        model: aiResult.model || "AI",
      };
    } else {
      const { promptKey: mappedPromptKey, candidates } = getTemplateCandidates(
        prompt,
        userParams
      );
      const answer = await chooseUniqueAnswer(
        candidates,
        usedAnswers,
        userParams,
        prompt
      );
      finalResult = { answer, source: "Template", model: "Fast Template" };
      // store mapping for debugging / UI --- stored under final key below
      // metadata mapping done after key resolution
    }

    // Ensure we mark the answer as used so subsequent prompts avoid duplication
    usedAnswers.add(finalResult.answer);

    // If same prompt was selected multiple times, create distinct keys
    const count = promptCounts[prompt];
    const resultKey = count > 1 ? `${prompt} (${count})` : prompt;

    result[resultKey] = finalResult.answer;

    // Store metadata using the same key
    metadata[resultKey] = {
      source: finalResult.source,
      model: finalResult.model,
    };

    // If we had a mappedPromptKey (from template branch), include it
    if (finalResult.source === "Template") {
      const { promptKey: mappedPromptKey } = getTemplateCandidates(
        prompt,
        userParams
      );
      metadata[resultKey].mappedPromptKey = mappedPromptKey;
    }
  }

  return { promptAnswers: result, metadata };
};

module.exports = {
  generateAnswers,
  getTemplateCandidates,
  relevanceScore,
  getEmbedding,
  cosineSim,
  combinedScore,
};
