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

// Template generators per vibe (short, no question marks, include {i1}/{i2} sometimes)
const baseTemplates = {
  romantic: [
    "I protect my heart, but {i1} makes me melt",
    "Small {i1} gestures win me over quickly",
    "I keep my space sacred but I share it for real love",
    "I guard my time and trade it for sweet moments",
    "Soft texts about {i2} make my day",
    "I value steady affection, not drama",
    "I give my best to people who show up",
    "I’m all about cozy nights and warm honesty",
    "I love thoughtful surprises that show you noticed",
    "I prefer deep connections and slow flirts",
  ],
  adventurous: [
    "I need heads up for plans, but I love sudden trips",
    "Boundaries keep me safe while I chase {i1} adventures",
    "I’ll say yes to {i2} if it’s planned with respect",
    "I pack snacks and energy for spontaneous road trips",
    "I protect my time but trade it for epic memories",
    "I love wild ideas done with kindness and clarity",
    "No pressure, all adventure and honest check ins",
    "I bring the playlist and you bring the map",
    "I set limits but I’m always down for exploring",
    "I keep things safe so fun can be fearless",
  ],
  quirky: [
    "I name my plants and expect respect for them",
    "Please ask before borrowing my socks, it’s serious",
    "I love weird rituals and good snacks",
    "I’ll share my secret playlist if you respect my space",
    "I collect odd stories about {i1} and giggle about them",
    "I keep my quirks sacred and my hugs selective",
    "No surprise guests, only surprise pastries allowed",
    "I adore clever memes and thoughtful weirdness",
    "Respect my odd little rules and we get along great",
    "I guard my space and reward you with charm",
  ],
  serious: [
    "I value clarity and honesty above all else",
    "I won’t play games, I show up consistently",
    "I protect my time and expect the same",
    "No mixed signals, just steady, kind actions",
    "I need reliability and thoughtful follow through",
    "Boundaries keep things respectful and grown up",
    "I invest in people who invest back",
    "I won’t be rushed into emotional work",
    "I guard my standards and reward real effort",
    "I prefer meaningful action over empty promises",
  ],
  intellectual: [
    "I love deep chats about {i1} late into the night",
    "Thoughtful debate and curiosity are my weak spot",
    "I value ideas, wit, and honest opinions",
    "I guard my focus but share it for smart talks",
    "I prefer substance to surface level chatter",
    "Bring great questions and I’ll bring good answers",
    "I protect my curiosity and cherish new insights",
    "I like people who read and think about {i2}",
    "Intellectual honesty is sexy to me",
    "I adore thoughtful, playful mind games",
  ],
  default: [
    "I want honesty, respect, and a little sparkle",
    "Boundaries help me be kind and present",
    "I keep my space sacred and my heart open",
    "I like simple plans and warm check ins",
    "Respect my limits and I’ll be your biggest fan",
    "I prefer real connection over empty noise",
    "I protect my time but trade it for quality",
    "Small gestures mean a lot to me",
    "I enjoy steady kindness and playful energy",
    "I like people who know how to show up",
  ],
};

// Ensure arrays are concise and contain placeholders occasionally
const generateForVibe = (vibe, promptName) => {
  const arr = baseTemplates[vibe].slice(0, 10);
  // Add slight prompt-awareness when promptName provides useful tokens
  if (promptName && promptName.length > 2) {
    // for a few entries, append a tiny phrase referencing the prompt in a short way
    arr[1] = arr[1].replace(/\.$/, "");
  }
  return arr;
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
