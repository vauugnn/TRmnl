#!/usr/bin/env node
'use strict';

/*
 * UserPromptSubmit hook for the TRmnl Claude Code plugin.
 *
 * Behavior:
 *   - Reads the submitted prompt from stdin.
 *   - If the prompt begins with the configured auto-prefix (default ">>"),
 *     translates the stripped prompt via DeepL and emits the result as
 *     additionalContext, with a steering line asking Claude to treat the
 *     translation as authoritative.
 *   - On ANY failure (missing key, network error, timeout, parse error)
 *     exits 0 with no stdout, so the original prompt passes through.
 *
 * Note: Claude Code's UserPromptSubmit hook cannot replace the prompt text;
 * it can only append context or block. This hook only appends.
 */

const path = require('path');

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.resolve(__dirname, '..');
const { translate } = require(path.join(PLUGIN_ROOT, 'lib', 'translate'));
const { loadConfig } = require(path.join(PLUGIN_ROOT, 'lib', 'config'));
const { resolveLang } = require(path.join(PLUGIN_ROOT, 'lib', 'languages'));

function passthrough() {
  process.exit(0);
}

async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('trmnl hook timeout')), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}

(async () => {
  try {
    const raw = await readStdin();
    if (!raw) return passthrough();

    let event;
    try { event = JSON.parse(raw); } catch { return passthrough(); }
    const prompt = typeof event.prompt === 'string' ? event.prompt : '';
    if (!prompt) return passthrough();

    const prefix = (process.env.CLAUDE_PLUGIN_OPTION_AUTOPREFIX ?? '>>');
    if (!prefix) return passthrough();
    if (!prompt.startsWith(prefix)) return passthrough();

    const body = prompt.slice(prefix.length).trim();
    if (!body) return passthrough();

    const config = loadConfig();
    const apiKey = process.env.CLAUDE_PLUGIN_OPTION_APIKEY || config.apiKey;
    if (!apiKey) {
      console.error('trmnl: DeepL API key not configured. Set it via `/plugin config trmnl` or run `trmnl --setup`. Passing prompt through.');
      return passthrough();
    }

    const targetInput =
      process.env.CLAUDE_PLUGIN_OPTION_TARGETLANG ||
      config.targetLang ||
      'zh';
    const resolved = resolveLang(targetInput);
    const targetCode = resolved ? resolved.code : 'zh';
    const targetName = resolved ? resolved.name : 'Chinese (simplified)';

    const timeoutMs = parseInt(process.env.CLAUDE_PLUGIN_OPTION_HOOKTIMEOUTMS || '2000', 10) || 2000;

    let translated;
    try {
      translated = await withTimeout(translate(apiKey, body, targetCode), timeoutMs);
    } catch (err) {
      console.error(`trmnl: translate failed (${err && err.message}); passing prompt through.`);
      return passthrough();
    }

    if (!translated || typeof translated !== 'string') return passthrough();

    const responseLang = process.env.CLAUDE_PLUGIN_OPTION_RESPONSELANG || 'English';
    const context =
      `TRmnl translation (target=${targetCode} / ${targetName}):\n${translated}\n\n` +
      `Treat the translation above as the authoritative version of the user's prompt. ` +
      `Respond in ${responseLang} (the translation exists only to save input tokens; the user reads ${responseLang}).`;

    const out = {
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: context,
      },
    };
    process.stdout.write(JSON.stringify(out));
  } catch (err) {
    try { console.error(`trmnl hook error: ${err && err.message}`); } catch {}
  }
  process.exit(0);
})();
