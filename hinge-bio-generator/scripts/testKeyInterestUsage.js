const assert = require("assert");
const { generateAnswers } = require("../server/utils/generator");

(async () => {
  try {
    const selectedPrompts = [
      "This year, I really want to",
      "We're the same type of weird if",
      "My Love Language is ",
    ];

    const r = await generateAnswers(
      {
        desiredVibe: "funny",
      },
      selectedPrompts
    );

    const answers = Object.values(r.promptAnswers).map((a) =>
      (a || "").toLowerCase()
    );

    // Ensure answers are short and do not contain question marks
    answers.forEach((a) => {
      assert(
        !a.includes("?"),
        `Answer should not contain question marks: ${a}`
      );
      assert(a.split(" ").length <= 20, `Answer is too long: ${a}`);
    });

    console.log("PASS: Vibe-based generation test passed");
    process.exit(0);
  } catch (err) {
    console.error("FAIL:", err && err.message ? err.message : err);
    process.exit(2);
  }
})();
