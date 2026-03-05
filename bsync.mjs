import BrowserSync from 'browser-sync';
import chalk from 'chalk';
import 'dotenv/config';

const { PORT } = process.env;

if (!PORT) {
  console.log(chalk.red('PORT is missing from .env file'));
  process.exit(1);
}

const bs = BrowserSync.create();

bs.init({
  proxy: `localhost:${PORT}`,
  files: ['dist/**/*', 'public/**/*', '.env'],
  injectChanges: false,
  ignore: ['node_modules'],
  reloadOnRestart: true,
  ui: false,
  logLevel: 'silent',
  startDelay: 1000,
});

const uiPort = bs.getOption('port');
const uiHost = `http://localhost:${uiPort}`;
console.log(`Synced frontend available on ${chalk.underline.greenBright(uiHost)}`);
