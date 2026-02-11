#!/usr/bin/env node
const deepl = require('deepl-node');

const authKey = "INSERT DEEPL_API_KEY HERE"; 
const translator = new deepl.Translator(authKey);

async function run() {
    const text = process.argv.slice(2).join(' ');
    if (!text) return;

    try {
        // Translate to Chinese
        const result = await translator.translateText(text, null, 'zh');
        process.stdout.write(result.text);
    } catch (e) {
    }
}
run();