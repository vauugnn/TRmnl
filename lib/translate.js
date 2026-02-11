'use strict';

const deepl = require('deepl-node');

let _translator = null;

function getTranslator(apiKey) {
  if (!_translator) {
    _translator = new deepl.Translator(apiKey);
  }
  return _translator;
}

/**
 * Translate text using DeepL.
 * Source language is auto-detected (null).
 */
async function translate(apiKey, text, targetLang) {
  const translator = getTranslator(apiKey);
  const result = await translator.translateText(text, null, targetLang);
  return result.text;
}

module.exports = { translate };
