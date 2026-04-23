```
   _____ ___  __  __ __  _ _    __
  |_   _| _ \  V  |  \| | |   \ \
    | | | v / \_/ | | ' | |_   > >___
    |_| |_|_\_| |_|_|\__|___| /_/____|
```

Translate English into other languages from your terminal. Default target: Chinese.

## Why Chinese?

Chinese is more character-efficient than English. The same meaning in fewer tokens means you get more mileage per prompt when working with AI tools. Translate, auto-copy, paste into whatever you're using.

## Install

```bash
npm install -g trmnl
```

## Setup

You need a [DeepL API key](https://www.deepl.com/your-account/keys) (free tier: 500k characters/month). On first run, TRmnl will ask for it and save it to `~/.config/trmnl/config.json`.

## Usage

```
$ trmnl

  TRmnl >_ Analyze the performance bottleneck in this function
  分析此函数中的性能瓶颈
  ✓ copied to clipboard

  TRmnl >_ /lang ja
  ● Now translating to Japanese (ja)

  TRmnl >_ Thank you
  ありがとうございます
  ✓ copied to clipboard

  TRmnl >_ /quit
  再见 — Bye.
```

## Commands

| Command | What it does |
|---|---|
| `/lang <code>` | Switch target language (e.g. `/lang ja`) |
| `/langs` | List all supported languages |
| `/quit` | Exit |
| `trmnl --setup` | Reconfigure API key |
| `trmnl --help` | Show help |

## Claude Code plugin

TRmnl also ships as a Claude Code plugin. Write prompts in English, Claude receives Chinese — fewer input tokens, same result.

### Install

```
/plugin marketplace add github:vauugnn/TRmnl
/plugin install trmnl@trmnl
```

After installing, save your DeepL API key (free tier at [deepl.com/your-account/keys](https://www.deepl.com/your-account/keys)):

```
/tr-setup YOUR_DEEPL_API_KEY
```

If you already have `~/.config/trmnl/config.json` from the REPL, the plugin picks it up automatically — no setup needed.

### Slash commands

| Command | What it does |
|---|---|
| `/tr-setup <key>` | Save your DeepL API key. Run once after installing. |
| `/tr <text>` | Translate text and submit as prompt. Claude only sees the translation — true token savings. |
| `/trmnl <text>` | Same as `/tr`. |
| `/tr-lang <code>` | Set default target language (e.g. `/tr-lang ja`). |
| `/trmnl-lang <code>` | Same as `/tr-lang`. |

### Auto-translate hook

Prefix any prompt with `>>` to auto-translate before Claude processes it:

```
>> explain closures in JavaScript
```

The hook appends the Chinese translation as context. Claude reads the translation, responds in your configured `responseLang` (default: English).

> **Note:** Claude Code hooks can only append context, not replace the prompt. Both the original English and the translation reach the model. `/tr` is the only path where Claude sees *only* the translation.

### Plugin settings

Set via `/plugin config trmnl`:

| Key | Default | Description |
|---|---|---|
| `apiKey` | — | DeepL API key (stored in system keychain) |
| `targetLang` | `zh` | DeepL target code (`zh`, `ja`, `de`, …) |
| `responseLang` | `English` | Language Claude replies in |
| `autoPrefix` | `>>` | Hook trigger prefix. Empty string disables. |
| `hookTimeoutMs` | `2000` | Max ms to wait for DeepL before passing through untranslated |

### Failure handling

Missing key, DeepL error, or timeout → prompt passes through untouched. The hook never blocks.

### Optional keybinding

Plugins can't ship keybindings, but add one in `~/.claude/keybindings.json` to insert `/tr ` on a keypress.

## License

MIT
