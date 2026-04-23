#!/usr/bin/env node
'use strict';

/*
 * Body of the /trmnl-lang slash command.
 * Writes the resolved target language to ~/.config/trmnl/config.json so that
 * both the REPL and the plugin pick it up. Output goes to stdout as the prompt
 * Claude sees — kept to a single short confirmation sentence.
 */

const path = require('path');

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.resolve(__dirname, '..');
const { loadConfig, saveConfig, CONFIG_PATH } = require(path.join(PLUGIN_ROOT, 'lib', 'config'));
const { resolveLang, listLanguages } = require(path.join(PLUGIN_ROOT, 'lib', 'languages'));

const input = process.argv.slice(2).join(' ').trim();
if (!input) {
  const codes = listLanguages().map((l) => l.code).join(', ');
  console.log(`Usage: /trmnl-lang <code>\nSupported codes: ${codes}`);
  process.exit(0);
}

const resolved = resolveLang(input);
if (!resolved) {
  console.log(`trmnl: unknown language "${input}". Try one of: ${listLanguages().map((l) => l.code).join(', ')}`);
  process.exit(0);
}

const config = loadConfig();
config.targetLang = resolved.code;
try {
  saveConfig(config);
  console.log(`TRmnl target language set to ${resolved.name} (${resolved.code}). Saved to ${CONFIG_PATH}.`);
} catch (err) {
  console.log(`trmnl: could not save config (${err && err.message}).`);
}
