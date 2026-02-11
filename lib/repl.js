'use strict';

const readline = require('readline');
const chalk = require('chalk');
const clipboardy = require('clipboardy');
const { translate } = require('./translate');
const { resolveLang, listLanguages } = require('./languages');
const { saveConfig } = require('./config');

const b = chalk.hex('#3e8ede').bold;
const d = chalk.dim;

const BANNER = [
  '',
  b('   _____ ___  __  __ __  _ _    __'),
  b('  |_   _| _ \\  V  |  \\| | |   \\ \\'),
  b('    | | | v / \\_/ | | \' | |_   > >___'),
  b('    |_| |_|_\\_| |_|_|\\__|___| /_/____|'),
  '',
].join('\n');

function completer(line) {
  const commands = ['/lang ', '/langs', '/quit'];

  if (line.startsWith('/lang ') && line !== '/langs') {
    const partial = line.slice(6).toLowerCase();
    const langs = listLanguages();
    const hits = langs
      .filter(l => l.code.startsWith(partial) || l.name.toLowerCase().startsWith(partial))
      .map(l => `/lang ${l.code}`);
    return [hits.length ? hits : langs.map(l => `/lang ${l.code}`), line];
  }

  if (line.startsWith('/')) {
    const hits = commands.filter(c => c.startsWith(line));
    return [hits, line];
  }

  return [[], line];
}

async function startRepl(config) {
  const lang = resolveLang(config.targetLang) || { code: 'zh', name: 'Chinese (simplified)' };

  console.log(BANNER);
  console.log(chalk.dim(`  translating to ${chalk.white(lang.name)}`));
  console.log(chalk.dim('  Tab-complete commands: /lang <code>, /langs, /quit'));
  console.log();

  const PROMPT = chalk.hex('#3e8ede').bold('  TRmnl >_ ');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: PROMPT,
    completer,
  });

  let targetLang = lang.code;
  let targetName = lang.name;

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    // --- slash commands ---
    if (input === '/quit' || input === '/q') {
      console.log();
      console.log(chalk.dim('  再见 — Bye.'));
      console.log();
      rl.close();
      return;
    }

    if (input === '/langs') {
      console.log();
      console.log(chalk.dim('  Available languages:'));
      console.log();
      for (const { code, name } of listLanguages()) {
        const marker = code === targetLang ? chalk.green(' ●') : '  ';
        console.log(`${marker} ${chalk.cyan(code.padEnd(7))} ${chalk.white(name)}`);
      }
      console.log();
      rl.prompt();
      return;
    }

    if (input.startsWith('/lang ')) {
      const code = input.slice(6).trim();
      const resolved = resolveLang(code);
      if (!resolved) {
        console.log(chalk.red(`\n  Unknown language: ${code}`));
        console.log(chalk.dim('  Press Tab after /lang for options, or type /langs\n'));
      } else {
        targetLang = resolved.code;
        targetName = resolved.name;
        config.targetLang = targetLang;
        saveConfig(config);
        console.log(chalk.green(`\n  ● Now translating to ${chalk.bold(targetName)} (${targetLang})\n`));
      }
      rl.prompt();
      return;
    }

    if (input.startsWith('/')) {
      console.log(chalk.red(`\n  Unknown command: ${input}`));
      console.log(chalk.dim('  Commands: /lang <code>, /langs, /quit\n'));
      rl.prompt();
      return;
    }

    // --- translate ---
    process.stdout.write(chalk.dim('\n  translating...'));

    try {
      const result = await translate(config.apiKey, input, targetLang);

      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      console.log(`  ${chalk.green.bold(result)}`);

      try {
        clipboardy.writeSync(result);
        console.log(chalk.dim('  ✓ copied to clipboard'));
      } catch {
        // clipboard may not be available
      }
    } catch (err) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      console.log(chalk.red(`  Error: ${err.message}`));
    }

    console.log();
    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

module.exports = { startRepl };
