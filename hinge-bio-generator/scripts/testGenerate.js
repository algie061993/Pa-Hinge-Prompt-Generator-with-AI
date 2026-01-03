const { generateAnswers } = require("../server/utils/generator");

(async () => {
  try {
    const r = await generateAnswers(
      {
        location: "Seattle, WA",
        keyInterests: ["gaming", "sports"],
        desiredVibe: "funny",
        tone: "light",
        gender: "they",
      },
      [
        "This year, I really want to",
        "this year i really want to",
        "My Love Language is ", // trailing space
        "We're the same type of weird if",
      ]
    );

    console.log(JSON.stringify(r, null, 2));
  } catch (err) {
    console.error("Error running test:", err);
  }
})();
