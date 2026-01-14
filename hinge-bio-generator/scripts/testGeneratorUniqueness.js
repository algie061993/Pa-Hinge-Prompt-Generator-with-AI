const assert = require("assert");
const { generateAnswers } = require("../server/utils/generator");

function tokenize(s) {
  return (s || "").toLowerCase().match(/\w+/g) || [];
}

(async () => {
  try {
    const selectedPrompts = [
      "This year, I really want to",
      "We're the same type of weird if",
      "My Love Language is ",
    ];

    const r = await generateAnswers(
      {
        location: "London",
        keyInterests: ["hiking", "books"],
        desiredVibe: "funny",
        tone: "light",
      },
      selectedPrompts
    );

    const answers = Object.values(r.promptAnswers);

    // Uniqueness: all answers should be distinct
    const uniqueAnswers = new Set(answers);
    assert.strictEqual(
      uniqueAnswers.size,
      answers.length,
      "Expected all generated answers to be unique"
    );

    // Basic relevance: each answer should either share at least one token with its prompt
    // or match a small set of prompt-specific keywords (more forgiving, realistic heuristic)
    const promptKeywordHints = {
      "My Love Language is ": [
        "love",
        "language",
        "quality",
        "time",
        "words",
        "service",
        "touch",
        "gifts",
      ],
      "We're the same type of weird if": [
        "weird",
        "quirky",
        "same",
        "weirdness",
        "odd",
        "strange",
        "quirk",
        "quirks",
      ],
    };

    selectedPrompts.forEach((p) => {
      const promptTokens = new Set(tokenize(p));
      const answer = r.promptAnswers[p] || "";
      const answerTokens = new Set(tokenize(answer));
      const intersection = [...promptTokens].filter((t) => answerTokens.has(t));

      const hintKeywords = promptKeywordHints[p] || [];
      const matchesHint = hintKeywords.some((k) =>
        answer.toLowerCase().includes(k)
      );

      assert(
        intersection.length > 0 || matchesHint,
        `Answer for prompt "${p}" seems irrelevant (no token overlap or hint keyword)`
      );
    });

    console.log("PASS: Uniqueness and basic relevance checks passed");
    process.exit(0);
  } catch (err) {
    console.error("FAIL:", err && err.message ? err.message : err);
    process.exit(2);
  }
})();
