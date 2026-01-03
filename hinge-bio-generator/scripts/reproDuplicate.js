const { generateAnswers } = require("../server/utils/generator");

(async () => {
  console.log("Starting generateAnswers test");
  try {
    const r = await generateAnswers(
      {
        location: "United Kingdom",
        keyInterests: ["sports", "gaming"],
        desiredVibe: "funny",
        tone: "light",
        gender: "they",
      },
      [
        "We're the same type of weird if",
        "This year, I really want to",
        "My Love Language is",
      ]
    );

    console.log("Result:", JSON.stringify(r, null, 2));
    console.log("Finished");
  } catch (err) {
    console.error("Error running test:", err);
  }
})();
