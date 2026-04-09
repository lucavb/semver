#!/bin/bash
set -euo pipefail

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Building package..."
pnpm exec nx build semver

echo "Moving built files to root..."
rm -rf src
mv dist/packages/semver/src .

echo "Moving JSON config files to root..."
mv dist/packages/semver/executors.json dist/packages/semver/generators.json dist/packages/semver/migrations.json .

echo "Copying package.json from dist..."
cp dist/packages/semver/package.json package.json

echo "Cleaning up unnecessary files and directories..."
rm -rf packages tools dist pnpm-lock.yaml pnpm-workspace.yaml jest.config.ts jest.preset.js nx.json tsconfig.base.json commitlint.config.js codecov.yml CONTRIBUTING.md README.md LICENSE tmp

echo "Done! The branch now contains only the built files."
echo "Remaining files:"
ls -1

