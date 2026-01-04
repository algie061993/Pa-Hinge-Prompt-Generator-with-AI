const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "..", "server", "utils", "prompts");
const INDEX = path.join(BASE, "index.js");
const MIN_TEMPLATES = 3; // ensure at least this many templates per prompt
const VIBES = [
  "funny",
  "romantic",
  "adventurous",
  "quirky",
  "serious",
  "intellectual",
  "default",
];

if (!fs.existsSync(INDEX)) {
  console.error("prompts index not found");
  process.exit(1);
}

const indexJs = fs.readFileSync(INDEX, "utf8");

// parse mapping promptText -> filename
const mappingRegex = /"([\s\S]*?)"\s*:\s*(\w+)/g;
const promptMap = [];
let m;
while ((m = mappingRegex.exec(indexJs)) !== null) {
  promptMap.push({ prompt: m[1], varName: m[2] });
}

const normalize = (s) =>
  s
    .replace(/\{[^}]+\}/g, "")
    .replace(/[\W_]+/g, " ")
    .toLowerCase()
    .trim();

const hasHFKey = !!process.env.HUGGINGFACE_API_KEY;

const callHF = async (promptText, vibe, count) => {
  if (!hasHFKey) return null;
  try {
    const aiPrompt = `Generate ${count} short, punchy Hinge prompt templates for the prompt: "${promptText}". Use tone: ${vibe}. Use placeholders {i1}, {i2}, {city} where relevant. Return a JSON array of strings only.`;
    const resp = await axios.post(
      "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
      { inputs: aiPrompt },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
        timeout: 10000,
      }
    );
    const text =
      resp.data?.[0]?.generated_text || resp.data?.generated_text || "";
    // try to extract JSON array
    const jsonStart = text.indexOf("[");
    if (jsonStart >= 0) {
      const substr = text.slice(jsonStart);
      try {
        const arr = JSON.parse(substr);
        if (Array.isArray(arr))
          return arr.map((s) => String(s).trim()).filter(Boolean);
      } catch (err) {
        // fall through
      }
    }
    // fallback: take lines
    return text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, count);
  } catch (err) {
    console.error("HF call failed:", err.message || err);
    return null;
  }
};

const synthTemplate = (
  promptText,
  vibe,
  i1 = "new experiences",
  i2 = "new experiences",
  city = "here"
) => {
  // produce several natural-sounding templates
  const base = promptText.toLowerCase();
  const templates = [];
  if (vibe === "funny") {
    templates.push(
      `a slow morning with coffee and a ridiculous playlist — what's your go-to sound?`
    );
    templates.push(
      `trying to cook something ambitious and calling it art — you in?`
    );
    templates.push(
      `finding humor in awkward moments and laughing about them later — what's yours?`
    );
  } else if (vibe === "romantic") {
    templates.push(
      `sharing {i1} with someone who truly gets it ❤️ - what makes your heart skip a beat?`
    );
    templates.push(
      `creating beautiful {i2} moments together in {city} - does this sound like your love language too? ❤️`
    );
    templates.push(
      `finding deep connection through {i1} experiences - what's your idea of the perfect moment?`
    );
  } else if (vibe === "quirky") {
    templates.push(
      `{i1} in wonderfully weird ways 🤪 - too weird for you or just weird enough?`
    );
    templates.push(
      `appreciating the strange details of {i2} in {city} - embrace the weird with me?`
    );
    templates.push(
      `having unconventional {i1} experiences that make great stories - ready to be delightfully odd together?`
    );
  } else {
    templates.push(
      `enjoying {i1} authentically every day ✨ - what brings you joy?`
    );
    templates.push(
      `experiencing {i1} fully and mindfully - how do you make life meaningful?`
    );
    templates.push(
      `sharing my {i2} passion with others in {city} - what's your version of this?`
    );
  }
  return templates.slice(0, 3);
};

// Fetch-based HF helper (used if HF key exists and fetch is available)
const callHFNew = async (promptText, vibe, count) => {
  if (!hasHFKey) return null;
  try {
    const aiPrompt = `Generate ${count} short, punchy Hinge prompt templates for the prompt: "${promptText}". Use tone: ${vibe}. Use placeholders {i1}, {i2}, {city} where relevant. Return a JSON array of strings only.`;
    const resp = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: aiPrompt }),
      }
    );
    const data = await resp.json();
    const text = data?.[0]?.generated_text || data?.generated_text || "";
    const jsonStart = text.indexOf("[");
    if (jsonStart >= 0) {
      const substr = text.slice(jsonStart);
      try {
        const arr = JSON.parse(substr);
        if (Array.isArray(arr))
          return arr.map((s) => String(s).trim()).filter(Boolean);
      } catch (err) {}
    }
    return text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, count);
  } catch (err) {
    console.error("HF call failed (fetch helper):", err.message || err);
    return null;
  }
};

const readPromptFile = (varName) => {
  const filename = path.join(BASE, varToFile(varName));
  if (!fs.existsSync(filename)) return null;
  const obj = require(filename);
  return { filename, obj };
};

function varToFile(varName) {
  // map variable name like thisYearIReallyWantTo -> thisYearIReallyWantTo.js
  return `${varName}.js`;
}

(async () => {
  console.log(
    "Starting auto template generation. HF key:",
    !!process.env.HUGGINGFACE_API_KEY
  );

  // Build a set of normalized existing templates to avoid duplicates
  const allTemplates = new Map(); // norm -> [prompt1, prompt2]

  for (const { varName, prompt } of promptMap) {
    const p = readPromptFile(varName);
    if (!p) continue;
    const obj = p.obj;
    for (const arr of Object.values(obj)) {
      if (!Array.isArray(arr)) continue;
      for (const t of arr) {
        const n = normalize(t);
        if (!allTemplates.has(n)) allTemplates.set(n, new Set());
        allTemplates.get(n).add(prompt);
      }
    }
  }

  let changes = 0;

  for (const { prompt, varName } of promptMap) {
    const p = readPromptFile(varName);
    if (!p) continue;
    const { filename, obj } = p;

    // count total templates
    const total = Object.values(obj).reduce(
      (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
      0
    );
    if (total >= MIN_TEMPLATES) continue;

    console.log(
      `Filling prompt: "${prompt}" (file: ${filename}) — has ${total} templates`
    );

    // ensure file is writable: make a backup
    const backup = filename + ".bak";
    if (!fs.existsSync(backup)) fs.copyFileSync(filename, backup);

    // Attempt to fill per vibe until we reach MIN_TEMPLATES
    let added = 0;
    for (const vibe of VIBES) {
      if (
        added +
          Object.values(obj).reduce(
            (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
            0
          ) >=
        MIN_TEMPLATES
      )
        break;
      const existing = Array.isArray(obj[vibe]) ? obj[vibe] : [];
      const need = Math.max(
        0,
        MIN_TEMPLATES -
          Object.values(obj).reduce(
            (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
            0
          )
      );
      if (need <= 0) break;

      const toCreate = Math.min(need, 3);

      // Prefer HF generation if available
      let generated = null;
      if (hasHFKey) {
        // prefer new fetch-based HF helper when available
        if (typeof callHFNew === "function") {
          generated = await callHFNew(prompt, vibe, toCreate);
        } else {
          generated = await callHF(prompt, vibe, toCreate);
        }
      }
      if (!generated || !generated.length) {
        generated = synthTemplate(prompt, vibe);
      }

      let newItems = [];
      for (const g of generated) {
        let gCandidate = g;
        let n = normalize(gCandidate);
        // if this exact template exists elsewhere, make a prompt-specific variant
        if (allTemplates.has(n)) {
          const stop = new Set([
            "the",
            "and",
            "or",
            "in",
            "of",
            "to",
            "a",
            "an",
            "is",
            "are",
            "that",
            "this",
            "it",
            "i",
            "my",
            "we",
            "you",
            "your",
            "me",
            "for",
            "with",
            "on",
            "at",
            "by",
            "from",
            "be",
          ]);
          const pTokens = prompt
            .split(/\s+/)
            .map((s) => s.replace(/[\W_]+/g, "").toLowerCase())
            .filter(Boolean)
            .filter((t) => !stop.has(t));
          // pick the first meaningful token length >= 4, else the first non-stop token
          let keyword =
            pTokens.find((t) => t.length >= 4) || pTokens[0] || "this";
          if (keyword.length < 2) keyword = "this";
          let variant = `${gCandidate} (especially about ${keyword})`;
          let counter = 1;
          while (allTemplates.has(normalize(variant))) {
            variant = `${gCandidate} (especially about ${keyword} ${counter})`;
            counter += 1;
          }
          gCandidate = variant;
          n = normalize(gCandidate);
        }

        if (allTemplates.has(n)) continue; // still duplicate, skip
        newItems.push(gCandidate);
        allTemplates.set(n, new Set([prompt]));
        if (newItems.length >= toCreate) break;
      }

      if (newItems.length) {
        if (!Array.isArray(obj[vibe])) obj[vibe] = [];
        obj[vibe] = obj[vibe].concat(newItems);
        added += newItems.length;
      }
    }

    if (added > 0) {
      // write back file with simple serialization
      const out =
        "const " +
        varName +
        " = " +
        JSON.stringify(obj, null, 2).replace(
          /"(funny|romantic|adventurous|quirky|serious|intellectual|default)":/g,
          "$1:"
        ) +
        ";\n\nmodule.exports = " +
        varName +
        ";\n";
      fs.writeFileSync(path.join(BASE, varName + ".js"), out, "utf8");
      console.log(`Wrote ${added} templates to ${varName}.js`);
      changes += added;
    }
  }

  console.log("Done. Added templates:", changes);
  // regenerate duplicate report
  try {
    require("child_process").execSync(
      "node scripts/generateDuplicateReport.js",
      { cwd: path.join(__dirname, ".."), stdio: "inherit" }
    );
  } catch (err) {
    console.error("Failed to regenerate duplicate report:", err.message || err);
  }
})();
