#!/usr/bin/env node
'use strict';

const { loadConfig, runSetup } = require('../lib/config');
const { startRepl } = require('../lib/repl');

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  trmnl — interactive terminal translator (DeepL)

  Usage:
    trmnl              Start interactive translation REPL
    trmnl --setup      Configure your DeepL API key
    trmnl --help       Show this help message

  REPL commands:
    /lang <code>       Switch target language (e.g. /lang ja)
    /langs             List all available target languages
    /quit              Exit
`);
  process.exit(0);
}

(async () => {
  if (args.includes('--setup')) {
    await runSetup();
    process.exit(0);
  }

  let config = loadConfig();

  if (!config.apiKey) {
    console.log('  No API key found. Let\'s set one up.\n');
    config = await runSetup();
  }

  startRepl(config);
})();
