# DMV Happy Practice (Static GitHub Pages site)

This repo contains a small React + Vite website with three sections:

- Flashcards (Q/A + explanation)
- Practice Set (MCQ with 4 options auto-generated)
- Learning (browse/search everything)

## Run locally (VS Code)
1. Install Node.js (LTS)
2. In the project folder:

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages
Option A (simple, using gh-pages):
1. Create a GitHub repo (example: `dmv-happy-practice`)
2. Push this code
3. In `vite.config.js`, set `base` to `'/REPO_NAME/'` (or keep `./` if you use the gh-pages branch deploy)
4. Run:

```bash
npm run deploy
```

This publishes to the `gh-pages` branch.

## Data
`questions.json` contains the extracted "Top 150 Questions & Answers" from your PDF.
