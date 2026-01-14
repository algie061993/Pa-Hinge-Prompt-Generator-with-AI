# Changelog

## Unreleased - 2026-01-14

### Added

- Modern side-by-side Prompt Selector UI (desktop left: prompts, right: answers) — `client/src/components/PromptSelector.js` and `client/src/styles/PromptSelector.modern.css`
- Dark theme with pink accent (`#f472b6`) and rounded radii
- Accessibility improvements: `focus-visible` outlines and `aria-label` attributes
- `client/scripts/capture-screenshots.js` — Puppeteer script to capture desktop and mobile screenshots

### Fixed

- JSX syntax bug in `PromptSelector` that caused build failure

### Notes

- Screenshots are included in `client/public/screenshots/` as `screenshot-desktop.png` and `screenshot-mobile.png`.
