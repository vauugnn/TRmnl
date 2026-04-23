#!/usr/bin/env node
'use strict';

const path = require('path');

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.resolve(__dirname, '..');
const { loadConfig, saveConfig, CONFIG_PATH } = require(path.join(PLUGIN_ROOT, 'lib', 'config'));

const key = process.argv.slice(2).join(' ').trim();
if (!key) {
  console.log(
    'Usage: /tr-setup <your-deepl-api-key>\n' +
    'Get a free key (500k chars/month) at https://www.deepl.com/your-account/keys'
  );
  process.exit(0);
}

const config = loadConfig();
config.apiKey = key;
if (!config.targetLang) config.targetLang = 'zh';

try {
  saveConfig(config);
  console.log(`DeepL API key saved to ${CONFIG_PATH}. TRmnl is ready — try /tr hello world`);
} catch (err) {
  console.log(`Failed to save config: ${err && err.message}`);
}
