const { generateAnswers } = require("../server/utils/generator");

(async () => {
  try {
    console.log("Starting hiking repro");
    const r = await generateAnswers(
      {
        location: "United Kingdom",
        keyInterests: ["hiking", "gaming"],
        desiredVibe: "funny",
        tone: "light",
        gender: "they",
      },
      [
        "This year, I really want to",
        "My Love Language is",
        "We're the same type of weird if",
      ]
    );

    console.log("Result:", JSON.stringify(r, null, 2));
    console.log("Finished");
  } catch (err) {
    console.error("Error running test:", err);
  }
})();
