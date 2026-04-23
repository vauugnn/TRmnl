#!/usr/bin/env node
'use strict';

const path = require('path');

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.resolve(__dirname, '..');
const { loadConfig, saveConfig, CONFIG_PATH } = require(path.join(PLUGIN_ROOT, 'lib', 'config'));

const fs = require('fs');

const arg = process.argv.slice(2).join(' ').trim();
if (!arg) {
  console.log(
    'Usage: /tr-setup <path-to-key-file>\n\n' +
    'The key file keeps your DeepL API key out of the Claude Code transcript.\n\n' +
    'Steps:\n' +
    '  1. In a terminal (not Claude Code): echo "YOUR_KEY" > /tmp/deepl.key\n' +
    '  2. In Claude Code: /tr-setup /tmp/deepl.key\n\n' +
    'Get a free key (500k chars/month) at https://www.deepl.com/your-account/keys'
  );
  process.exit(0);
}

let key;
try {
  key = fs.readFileSync(arg, 'utf8').trim();
} catch {
  console.log(`Cannot read file "${arg}". Create it first:\n  echo "YOUR_KEY" > ${arg}`);
  process.exit(0);
}

if (!key) {
  console.log(`File "${arg}" is empty.`);
  process.exit(0);
}

const config = loadConfig();
config.apiKey = key;
if (!config.targetLang) config.targetLang = 'zh';

try {
  saveConfig(config);
  try { fs.unlinkSync(arg); } catch {}
  console.log(`DeepL API key saved to ${CONFIG_PATH}. Key file deleted. TRmnl ready — try /tr hello world`);
} catch (err) {
  console.log(`Failed to save config: ${err && err.message}`);
}
