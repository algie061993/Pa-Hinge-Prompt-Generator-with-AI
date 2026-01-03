const fs = require("fs");
const {
  generateAnswers,
  getTemplateCandidates,
  relevanceScore,
} = require("../server/utils/generator");

(async () => {
  try {
    const userParams = {
      location: "United Kingdom",
      keyInterests: ["hiking", "gaming"],
      desiredVibe: "funny",
      tone: "light",
      gender: "they",
    };

    const prompts = [
      "This year, I really want to",
      "My Love Language is",
      "We're the same type of weird if",
    ];

    const debug = { prompts: [] };

    for (const p of prompts) {
      const { promptKey: mappedPromptKey, candidates } = getTemplateCandidates(
        p,
        userParams
      );
      debug.prompts.push({
        prompt: p,
        mappedPromptKey,
        candidates: candidates
          .slice(0, 20)
          .map((c) => ({ text: c, relevance: relevanceScore(p, c) })),
      });
    }

    const r = await generateAnswers(userParams, prompts);
    debug.result = r;

    fs.writeFileSync("tmp/debugResult.json", JSON.stringify(debug, null, 2));
    console.log("Wrote tmp/debugResult.json");
  } catch (err) {
    console.error("Error writing debug file:", err);
  }
})();
