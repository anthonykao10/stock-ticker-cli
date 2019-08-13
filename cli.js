#! /usr/bin/env node

const stocks = require('./lib/stocks');

// Parse CLI input:
const [, , ...args] = process.argv;
const cmd = args[0];

// Handle input args
switch(cmd) {
  case undefined:
  case 'help':
  case '-help':
  case '-h':
    stocks.showHelp();
    break;
  default:
    stocks.getStockQuote(cmd);
}
