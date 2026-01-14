const { generateAnswers } = require("../server/utils/generator");

(async () => {
  const userParams = {
    location: "Seattle, WA",
    desiredVibe: "quirky",
    keyInterests: ["hiking", "coffee"],
  };

  const selectedPrompts = [
    "Try to guess this about me",
    "Typical Sunday",
    "I go crazy for",
    "My simple pleasures",
  ];

  const r = await generateAnswers(userParams, selectedPrompts);
  const answers = Object.values(r.promptAnswers);

  let ok = true;
  answers.forEach((a) => {
    if (a.includes("?")) {
      console.error("FAIL: Answer contains question mark:", a);
      ok = false;
    }
    const words = a.split(/\s+/).length;
    if (words > 20) {
      console.error("FAIL: Answer too long (words):", words, a);
      ok = false;
    }
  });

  if (ok) console.log("PASS: No question marks and answers are concise");
})();
