'use strict';

const LANGUAGES = {
  'bg':    'Bulgarian',
  'cs':    'Czech',
  'da':    'Danish',
  'de':    'German',
  'el':    'Greek',
  'en-gb': 'English (British)',
  'en-us': 'English (American)',
  'es':    'Spanish',
  'et':    'Estonian',
  'fi':    'Finnish',
  'fr':    'French',
  'hu':    'Hungarian',
  'id':    'Indonesian',
  'it':    'Italian',
  'ja':    'Japanese',
  'ko':    'Korean',
  'lt':    'Lithuanian',
  'lv':    'Latvian',
  'nb':    'Norwegian (Bokmal)',
  'nl':    'Dutch',
  'pl':    'Polish',
  'pt-br': 'Portuguese (Brazilian)',
  'pt-pt': 'Portuguese (European)',
  'ro':    'Romanian',
  'ru':    'Russian',
  'sk':    'Slovak',
  'sl':    'Slovenian',
  'sv':    'Swedish',
  'tr':    'Turkish',
  'uk':    'Ukrainian',
  'zh':    'Chinese (simplified)',
  'zh-hans': 'Chinese (simplified)',
  'zh-hant': 'Chinese (traditional)',
};

// Aliases: shorthand codes that map to canonical DeepL target codes
const ALIASES = {
  'en':  'en-us',
  'pt':  'pt-br',
  'zh-hans': 'zh',
};

/**
 * Resolve a user-provided language code to a canonical DeepL target code.
 * Returns { code, name } or null if not recognized.
 */
function resolveLang(input) {
  const key = input.trim().toLowerCase();

  // Check alias first
  const canonical = ALIASES[key] || key;

  if (LANGUAGES[canonical]) {
    return { code: canonical, name: LANGUAGES[canonical] };
  }
  return null;
}

/**
 * Return all supported languages as an array of { code, name }.
 */
function listLanguages() {
  return Object.entries(LANGUAGES)
    .filter(([code]) => !ALIASES[code]) // exclude alias entries
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([code, name]) => ({ code, name }));
}

module.exports = { resolveLang, listLanguages, LANGUAGES };
