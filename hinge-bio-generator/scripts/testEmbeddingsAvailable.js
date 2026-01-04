const { getEmbedding, cosineSim } = require("../server/utils/generator");

(async () => {
  try {
    if (!process.env.OPENAI_API_KEY && !process.env.HUGGINGFACE_API_KEY) {
      console.log(
        "SKIP: No embedding API key present (set OPENAI_API_KEY or HUGGINGFACE_API_KEY to run)"
      );
      process.exit(0);
    }

    const a = await getEmbedding("hiking");
    const b = await getEmbedding("mountain trail");
    const c = await getEmbedding("sushi");

    if (!a || !b || !c) {
      throw new Error("Failed to fetch embeddings");
    }

    const simAB = cosineSim(a, b);
    const simAC = cosineSim(a, c);

    console.log("sim(hiking, mountain trail)=", simAB.toFixed(4));
    console.log("sim(hiking, sushi)=", simAC.toFixed(4));

    if (simAB <= simAC) {
      throw new Error(
        "Semantic similarity failed: hiking should be closer to mountain trail than to sushi"
      );
    }

    console.log("PASS: Embedding similarity sanity check");
    process.exit(0);
  } catch (err) {
    console.error("FAIL:", err && err.message ? err.message : err);
    process.exit(2);
  }
})();
