# Hinge Prompt Answers - Modular Structure

This directory contains individual files for each Hinge prompt question, organized for better maintainability and modularity.

## Structure

- Each prompt has its own `.js` file with answers organized by personality type
- `index.js` imports all prompts and exports the master `PROMPT_ANSWERS` object
- File names are in camelCase based on the prompt question

## Personality Types

Each prompt file contains answers for 7 personality types:

- `funny` - Humorous, light-hearted responses
- `romantic` - Love-focused, emotional responses
- `adventurous` - Action-oriented, spontaneous responses
- `quirky` - Unique, unconventional responses
- `serious` - Thoughtful, goal-oriented responses
- `intellectual` - Deep, analytical responses
- `default` - Balanced, general responses

## Dynamic Placeholders

Placeholders for user interests (`{i1}`, `{i2}`) and city have been removed. Answers are generated based only on the selected `desiredVibe` to keep prompts simple and privacy-preserving.

## Usage

```javascript
const { PROMPT_ANSWERS } = require("./utils/prompts");

// Access a specific prompt
const answers = PROMPT_ANSWERS["I'm looking for"];
console.log(answers.funny); // Array of funny answers
```

## Adding New Prompts

1. Create a new `.js` file in this directory
2. Export an object with personality type arrays
3. Add the import and export to `index.js`
4. Ensure each personality type has **20 answers** (short, punchy, flirty or matching the desired vibe)

## File Generation

The `generatePromptFiles.js` script can regenerate all files from a master object if needed.

## Total Stats

- **46 unique prompts**
- **5 answers per personality type**
- **7 personality types per prompt**
- **1,610+ total answer variations**
