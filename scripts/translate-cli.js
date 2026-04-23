#!/usr/bin/env node
'use strict';

/*
 * Body of the /trmnl slash command.
 * argv[2..] joined = user-supplied text. stdout becomes the prompt Claude sees.
 *
 * Failure policy: if translation fails for any reason, fall back to printing
 * the original text so the slash command still produces a usable prompt.
 */

const path = require('path');

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.resolve(__dirname, '..');
const { translate } = require(path.join(PLUGIN_ROOT, 'lib', 'translate'));
const { loadConfig } = require(path.join(PLUGIN_ROOT, 'lib', 'config'));
const { resolveLang } = require(path.join(PLUGIN_ROOT, 'lib', 'languages'));

(async () => {
  const text = process.argv.slice(2).join(' ').trim();
  if (!text) {
    console.log('Usage: /trmnl <text to translate>');
    return;
  }

  const config = loadConfig();
  const apiKey = process.env.CLAUDE_PLUGIN_OPTION_APIKEY || config.apiKey;
  if (!apiKey) {
    console.error('trmnl: DeepL API key missing. Set it via `/plugin config trmnl` or run `trmnl --setup` in a terminal.');
    console.log(text);
    return;
  }

  const targetInput =
    process.env.CLAUDE_PLUGIN_OPTION_TARGETLANG ||
    config.targetLang ||
    'zh';
  const resolved = resolveLang(targetInput);
  const targetCode = resolved ? resolved.code : 'zh';

  const responseLang = process.env.CLAUDE_PLUGIN_OPTION_RESPONSELANG || 'English';

  try {
    const out = await translate(apiKey, text, targetCode);
    console.log(out);
    console.log('');
    console.log(`(Prompt translated to ${targetCode} for token efficiency. Respond in ${responseLang}.)`);
  } catch (err) {
    console.error(`trmnl: translate failed (${err && err.message}). Falling back to original text.`);
    console.log(text);
  }
})();
