const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "..", "server", "utils", "prompts");
const REPORT = path.join(__dirname, "..", "tmp", "duplicateReport.json");

if (!fs.existsSync(REPORT)) {
  console.error(
    "Duplicate report not found. Run scripts/generateDuplicateReport.js first."
  );
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(REPORT, "utf8"));
const indexJs = fs.readFileSync(path.join(BASE, "index.js"), "utf8");

// Parse requires from index.js: const thisYearIReallyWantTo = require('./thisYearIReallyWantTo');
const requireRegex = /const\s+(\w+)\s*=\s*require\(\'\.\/(.+?)\'\);/g;
const varToFile = {};
let m;
while ((m = requireRegex.exec(indexJs)) !== null) {
  varToFile[m[1]] = m[2] + ".js";
}

// Parse PROMPT_ANSWERS mapping to get prompt text -> variable
const mappingRegex = /\"([\s\S]*?)\"\s*:\s*(\w+)/g;
const promptToVar = {};
while ((m = mappingRegex.exec(indexJs)) !== null) {
  const promptText = m[1];
  const varName = m[2];
  promptToVar[promptText] = varName;
}

const tokenize = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/\{[^}]+\}/g, "")
    .replace(/[\W_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const relevance = (prompt, template) => {
  const p = tokenize(prompt);
  const t = new Set(tokenize(template));
  let s = 0;
  for (const tok of p) if (t.has(tok)) s++;
  return s;
};

const changedFiles = new Set();
let removedCount = 0;

for (const entry of report) {
  const examples = entry.examples || [];
  const prompts = entry.prompts || [];
  if (prompts.length < 2) continue; // no duplicates

  for (const example of examples) {
    // choose canonical prompt by relevance
    let best = null;
    let bestScore = -1;
    for (const p of prompts) {
      const s = relevance(p, example);
      if (s > bestScore) {
        best = p;
        bestScore = s;
      }
    }
    if (!best) best = prompts[0];

    // remove example from all prompts except best
    for (const p of prompts) {
      if (p === best) continue;
      const varName = promptToVar[p];
      const filename = varToFile[varName];
      if (!filename) continue;
      const fullPath = path.join(BASE, filename);
      if (!fs.existsSync(fullPath)) continue;

      let content = fs.readFileSync(fullPath, "utf8");
      const escaped = example.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      // Remove occurrences of the exact string inside arrays (handles trailing comma or not)
      const pattern = new RegExp("([\"'])" + escaped + "\\1\\s*,?\\s*", "g");
      const newContent = content.replace(pattern, (matched) => {
        removedCount += 1;
        return "";
      });
      if (newContent !== content) {
        // tidy up possible leftover extra commas in arrays: replace " ,\s*]" -> "]" and "\[,\s*" -> "["
        let tidy = newContent.replace(/,\s*\]/g, "]");
        tidy = tidy.replace(/\[\s*,/g, "[");
        fs.writeFileSync(fullPath, tidy, "utf8");
        changedFiles.add(filename);
        console.log(`Removed template from ${filename} (kept in ${best})`);
      }
    }
  }
}

console.log(
  `Finished. Removed ${removedCount} duplicate template occurrences across ${changedFiles.size} files.`
);
// Re-run duplicate report to see updated state
require("child_process").execSync("node scripts/generateDuplicateReport.js", {
  cwd: path.join(__dirname, ".."),
  stdio: "inherit",
});
console.log("Wrote updated duplicate report to tmp/duplicateReport.json");
