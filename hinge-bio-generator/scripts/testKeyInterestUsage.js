const assert = require("assert");
const { generateAnswers } = require("../server/utils/generator");

(async () => {
  try {
    const selectedPrompts = [
      "This year, I really want to",
      "We're the same type of weird if",
      "My Love Language is ",
    ];

    const i1 = "hiking";
    const i2 = "gaming";

    const r = await generateAnswers(
      {
        location: "United Kingdom",
        keyInterests: [i1, i2],
        desiredVibe: "funny",
        tone: "light",
      },
      selectedPrompts
    );

    const answers = Object.values(r.promptAnswers).map((a) =>
      (a || "").toLowerCase()
    );

    // At least one answer should mention i1 or i2
    const found = answers.some((a) => a.includes(i1) || a.includes(i2));
    assert(
      found,
      `Expected at least one generated answer to mention '${i1}' or '${i2}'`
    );

    console.log("PASS: Key interest usage test passed");
    process.exit(0);
  } catch (err) {
    console.error("FAIL:", err && err.message ? err.message : err);
    process.exit(2);
  }
})();
