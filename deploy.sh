#!/usr/bin/env bash
# Build dist/ with only the files the landing page uses, then deploy it to
# Cloudflare Pages (project "p-hook"). Requires: `npx wrangler login` once.
set -euo pipefail
cd "$(dirname "$0")"

rm -rf dist && mkdir dist
cp index.html styles.css theme-v2.css app.js simulator.js motion.js \
   favicon.ico favicon.png favicon-32.png apple-touch-icon.png _headers dist/
cp -R brand app cards-clean dist/
find dist -name '.DS_Store' -delete

npx -y wrangler@4 pages deploy dist --project-name p-hook --branch main --commit-dirty=true
