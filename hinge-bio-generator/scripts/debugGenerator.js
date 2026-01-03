const {
  getTemplateCandidates,
  generateAnswers,
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

    for (const p of prompts) {
      try {
        const { promptKey: mappedPromptKey, candidates } =
          getTemplateCandidates(p, userParams);
        console.log("PROMPT:", p, "-> mapped to", mappedPromptKey);
        console.log("CANDIDATES:", candidates.slice(0, 10));
      } catch (err) {
        console.error("Error getting candidates for", p, err);
      }
    }

    const r = await generateAnswers(userParams, prompts);
    console.log("RESULT:", JSON.stringify(r, null, 2));
  } catch (err) {
    console.error("Error running debug:", err);
  }
})();
