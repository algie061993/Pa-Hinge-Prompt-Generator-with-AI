const { generateAnswers } = require("../server/utils/generator");

(async () => {
  const userParams = {
    location: "Austin, TX",
    desiredVibe: "funny",
    keyInterests: ["music", "coffee"],
  };
  const selectedPrompts = [
    "Typical Sunday",
    "I go crazy for",
    "My simple pleasures",
  ];

  const r1 = await generateAnswers(userParams, selectedPrompts);
  const r2 = await generateAnswers(userParams, selectedPrompts);

  const answers1 = Object.values(r1.promptAnswers);
  const answers2 = Object.values(r2.promptAnswers);

  let anyDiff = false;
  for (let i = 0; i < answers1.length; i++) {
    if (answers1[i] !== answers2[i]) anyDiff = true;
  }

  if (anyDiff) console.log("PASS: Regeneration produced different answers");
  else {
    console.error("FAIL: Regeneration produced identical answers");
    console.log("r1", r1.promptAnswers);
    console.log("r2", r2.promptAnswers);
    process.exit(1);
  }
})();
