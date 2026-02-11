'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const CONFIG_DIR = path.join(os.homedir(), '.config', 'trmnl');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveConfig(config) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', {
    encoding: 'utf8',
    mode: 0o600,
  });
}

function runSetup() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const config = loadConfig();

    rl.question('DeepL API key: ', (key) => {
      key = key.trim();
      if (!key) {
        console.log('No key provided. Exiting.');
        rl.close();
        process.exit(1);
      }
      config.apiKey = key;
      if (!config.targetLang) config.targetLang = 'zh';
      saveConfig(config);
      console.log(`Saved to ${CONFIG_PATH}`);
      rl.close();
      resolve(config);
    });
  });
}

module.exports = { loadConfig, saveConfig, runSetup, CONFIG_PATH };
