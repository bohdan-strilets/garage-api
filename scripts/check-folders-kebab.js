#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOTS = ['src'];
const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.husky',
  'dist',
  'coverage',
  '.next',
  'build',
  '.turbo',
  '.vscode',
  '.idea',
]);

const KEBAB_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let bad = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name;
    const full = path.join(dir, name);
    if (IGNORE_DIRS.has(name)) continue;
    if (entry.isDirectory()) {
      if (!KEBAB_RE.test(name)) bad.push(full);
      walk(full);
    }
  }
}

for (const root of ROOTS) walk(path.resolve(process.cwd(), root));

if (bad.length) {
  console.error('❌ Не-kebab-case каталоги знайдено:');
  for (const b of bad) console.error('  -', path.relative(process.cwd(), b));
  console.error('\nПравило: використовуйте kebab-case для папок (напр.: "user-profile").');
  process.exit(1);
} else {
  console.log('✅ Імена папок (kebab-case) — ОК');
}
