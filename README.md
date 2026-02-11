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

## License

MIT
