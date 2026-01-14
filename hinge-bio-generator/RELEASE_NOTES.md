Release: UI Modernization (2026-01-14)

Summary

- Implemented a modern side-by-side layout for Prompt Selector (selection left, answers right).
- Reworked `PromptSelector` styles and added a dark theme (accent: #f472b6).
- Added accessibility improvements (focus-visible outlines, aria-labels).
- Preserved and improved features: duplicate prompt selection, regenerate behavior, and copy-to-clipboard.

Files changed

- client/src/styles/PromptSelector.modern.css
- client/src/styles/PromptSelector.modern.css.bak (backup)
- client/src/components/PromptSelector.js
- Added accessibility focus styles and aria labels

Notes

- A quick UI screenshot capture script (`client/scripts/capture-screenshots.js`) was added and run; captured images are included for desktop and mobile previews.
- Dev server should be running (http://localhost:3000) when running the screenshot script.
