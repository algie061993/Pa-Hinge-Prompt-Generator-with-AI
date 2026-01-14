const fs = require("fs");
const path = require("path");

const PROMPTS_DIR = path.join(__dirname, "../server/utils/prompts");

const TARGET_VIBES = [
  "romantic",
  "adventurous",
  "quirky",
  "serious",
  "intellectual",
  "default",
];

// Template generators per vibe (short, flirty 20yo voice, no question marks, no emojis)
const baseTemplates = {
  romantic: [
    "I melt over thoughtful {i1}.",
    "Soft texts about {i2} make my day.",
    "Late-night cuddles and warm honesty are my vibe.",
    "I respond to steady attention, not games.",
    "Small surprises mean the most to me.",
    "I save my best for people who show up.",
    "Cozy nights and cute check-ins win me.",
    "I like slow flirts and real feelings.",
    "Sweet notes about {i1} make me smile.",
    "I keep it real and flirty.",
  ],
  adventurous: [
    "Spontaneous trips make my heart race.",
    "I pack snacks and a brave playlist.",
    "Little risks with kind people are my thing.",
    "Weekend road trips are my happy place.",
    "I’ll try {i1} if it’s respectful.",
    "Adventures with good vibes beat strict plans.",
    "I set boundaries but bring the energy.",
    "I trade time for wild memories.",
    "I love sharing maps and silly playlists.",
    "Brave stories and warm check-ins hook me.",
  ],
  quirky: [
    "I collect odd stories about {i1} and giggle.",
    "Please ask before touching my plants.",
    "Secret playlists and weird snacks are my love language.",
    "I keep my quirks and give big smiles.",
    "I trade jokes for cozy invites.",
    "I love tiny rituals and honest weirdness.",
    "My laugh is loud and a little dramatic.",
    "I guard my space and reward charm.",
    "I adore playful weirdness and kind folks.",
    "Small oddities make me curious.",
  ],
  serious: [
    "I value honesty and steady follow-through.",
    "I show up, no games, just real care.",
    "I set boundaries and respect yours.",
    "I give time to people who prove themselves.",
    "Kind consistency wins my attention.",
    "I prefer deep talks to small talk.",
    "I protect my time and share it wisely.",
    "I like partners who keep their promises.",
    "Real effort outshines fancy words.",
    "I treasure trust and thoughtful actions.",
  ],
  intellectual: [
    "I love late chats about {i1} and coffee.",
    "Clever ideas and playful debate light me up.",
    "Smart books and honest thoughts feel sexy.",
    "I trade curiosities and thoughtful notes.",
    "I like people who read and say interesting things.",
    "Curiosity about {i2} keeps me interested.",
    "Brainy banter and soft laughs work for me.",
    "I guard my focus but share it for good talks.",
    "Witty messages and honest curiosity win me.",
    "Thoughtful conversations feel like sparks.",
  ],
  default: [
    "I want honesty, sparks, and small kindnesses.",
    "Boundaries help me stay open and present.",
    "I prefer real connection over empty noise.",
    "Small gestures and steady check-ins are my thing.",
    "I share my space with people who show up.",
    "Warm messages and playful banter make my day.",
    "I protect my time but trade it for fun.",
    "Simple plans and sweet follow-through make me smile.",
    "Respect my limits and I’ll cheer you on.",
    "I like people who know how to show up.",
  ],
};

// Ensure arrays are concise and contain placeholders occasionally
const generateForVibe = (vibe, promptName) => {
  const arr = baseTemplates[vibe].slice(0, 10).map((s) => s);
  // Add slight prompt-awareness when promptName provides useful tokens
  if (promptName && promptName.length > 2) {
    // normalize camelCase or file-like names to spaced words first
    const pretty = promptName
      .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
      .replace(/[_\-\.]/g, " ")
      .replace(/[^a-zA-Z\s]/g, "")
      .trim();

    // extract a short meaningful token from the prompt (avoid short/common words)
    const stopWords = [
      "about",
      "the",
      "that",
      "this",
      "with",
      "your",
      "you",
      "we",
      "our",
      "i",
      "is",
      "are",
      "me",
      "my",
      "it",
      "and",
      "or",
      "if",
      "were",
      "same",
      "type",
    ];

    const tokens = pretty
      .split(/\s+/)
      .map((t) => t.toLowerCase())
      .filter((t) => t.length > 3 && !stopWords.includes(t));

    if (tokens.length > 0) {
      // prefer last meaningful token (often the most specific)
      const token = tokens[tokens.length - 1];
      // append a tiny phrase referencing the token to a couple of entries (keeps answers short)
      arr[0] = arr[0].replace(/\.$/, "") + ` about ${token}.`;
      if (arr[2]) arr[2] = arr[2].replace(/\.$/, "") + ` about ${token}.`;
    }
  }
  // sanitize: remove emojis, collapse whitespace, and dedupe (case-insensitive)
  const cleanEmoji = (s) =>
    (s || "")
      .replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\uFE0F}]/gu,
        ""
      )
      .replace(/\s+/g, " ")
      .trim();

  const seen = new Set();
  const cleaned = [];
  for (let s of arr) {
    s = cleanEmoji(s);
    if (!s) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cleaned.push(s);
  }

  // If dedupe trimmed too many entries, generate subtle variants to reach 10 unique lines
  const variants = ["so much.", "lowkey.", "and smiling."];
  let i = 0;
  while (cleaned.length < 10 && arr.length > 0) {
    const base = cleanEmoji(arr[i % arr.length]);
    const cand = (
      base.replace(/\.$/, "") +
      " " +
      variants[cleaned.length % variants.length]
    ).trim();
    const key = cand.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      cleaned.push(cand);
    }
    i++;
    if (i > 50) break; // safety
  }

  return cleaned.slice(0, 10);
};

const files = fs
  .readdirSync(PROMPTS_DIR)
  .filter((f) => f.endsWith(".js") && f !== "index.js");

files.forEach((file) => {
  if (file.endsWith(".bak")) return; // skip backups
  const full = path.join(PROMPTS_DIR, file);
  try {
    const mod = require(full);
    const varMatch = fs
      .readFileSync(full, "utf8")
      .match(/const\s+([a-zA-Z0-9_]+)\s*=\s*{\s*/);
    const varName = varMatch ? varMatch[1] : null;
    if (!varName) {
      console.warn("Skipping", file, "— could not detect var name");
      return;
    }

    // Build new object text
    const lines = [];
    lines.push(`const ${varName} = {`);

    // Keep existing keys but override target vibes
    const keys = Object.keys(mod);
    for (const k of keys) {
      if (TARGET_VIBES.includes(k)) {
        const arr = generateForVibe(k, file.replace(".js", ""));
        lines.push(`  ${k}: [`);
        for (const s of arr) {
          lines.push(`    "${s.replace(/"/g, '\\"')}",`);
        }
        lines.push("  ],");
      } else {
        // keep original array content as-is via serialization
        const orig = mod[k] || [];
        lines.push(`  ${k}: [`);
        for (const s of orig.slice(0, 50)) {
          lines.push(`    "${(s || "").replace(/"/g, '\\"')}",`);
        }
        lines.push("  ],");
      }
    }

    lines.push("};\n\nmodule.exports = " + varName + ";\n");

    fs.writeFileSync(full, lines.join("\n"));
    console.log("Updated", file);
  } catch (err) {
    console.error("Error updating", file, err.message);
  }
});

console.log("Done updating prompt files");
