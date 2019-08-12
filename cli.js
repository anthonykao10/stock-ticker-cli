#! /usr/bin/env node

const stocks = require('./lib/stocks');

// Parse CLI input and store arguments in array 'args':
const [, , ...args] = process.argv;
const cmd = args[0];

// HANDLE INPUT ARGS...
if (!cmd || cmd === '-help' || cmd === 'help' || cmd === '-h') {
  // Display help on explicit cmd (note: strings w/o '-' may conflict with a stock symbol).
  stocks.showHelp();
} else {
  stocks.getStockQuote(cmd);
}
