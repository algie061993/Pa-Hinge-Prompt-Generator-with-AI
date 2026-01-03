const { PROMPT_ANSWERS } = require('../server/utils/prompts');

const normalize = (s) => s.replace(/\{[^}]+\}/g, '').replace(/[\W_]+/g, ' ').toLowerCase().trim();

const mapping = new Map();

for (const [prompt, obj] of Object.entries(PROMPT_ANSWERS)) {
  for (const [vibe, arr] of Object.entries(obj)) {
    if (!Array.isArray(arr)) continue;
    for (const template of arr) {
      const key = template.trim();
      const norm = normalize(template);
      if (!mapping.has(norm)) mapping.set(norm, new Map());
      const inner = mapping.get(norm);
      if (!inner.has(key)) inner.set(key, new Set());
      inner.get(key).add(prompt);
    }
  }
}

const duplicates = [];
for (const [norm, inner] of mapping.entries()) {
  // count total distinct prompts this normalized template appears in
  const prompts = new Set();
  for (const key of inner.keys()) {
    for (const p of inner.get(key)) prompts.add(p);
  }
  if (prompts.size > 1) {
    duplicates.push({ norm, prompts: Array.from(prompts).sort(), examples: Array.from(inner.keys()).slice(0,3) });
  }
}

if (duplicates.length === 0) {
  console.log('No duplicate templates found across prompts.');
} else {
  console.log(`Found ${duplicates.length} normalized templates shared across prompts:\n`);
  for (const d of duplicates) {
    console.log('-'.repeat(40));
    console.log('Shared across prompts:', d.prompts.join(' | '));
    console.log('Example templates:
', d.examples.join('\n'));
    console.log();
  }
}
