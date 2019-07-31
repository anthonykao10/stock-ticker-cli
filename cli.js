#! /usr/bin/env node

require('dotenv').config();
const https = require('https');
const readline = require('readline');

// Parse CLI input and store arguments in array 'args':
const [,, ...args] = process.argv;
const cmd = args[0];

// HANDLE INPUT ARGS...
if (!cmd || cmd === '-help' || cmd === 'help' || cmd === '-h') {
  // Display help on explicit cmd (note: strings w/o '-' may conflict with a stock symbol).
  // show help screen
  console.log('help screen');
} else {

  // DETERMINE IF VALID STOCK TICKER??
  getStockQuote(cmd);

  // DETERMINE TIME (IF AFTERHOURS THEN DON"T SEND REQ?)
}


function getStockQuote(symbol) {

  let host = 'www.alphavantage.co',
      apiFunction = 'GLOBAL_QUOTE',
      apiKey = process.env.API_KEY;

  const options = {
    hostname: host,
    port: 443,
    path: `/query?function=${apiFunction}&apikey=${apiKey}&symbol=${symbol}`,
    method: 'GET'
  }

  const req = https.request(options, (res) => {
    var responseBody = '';

    // Add a listener on response obj for any data event.
    res
      .on('data', function(chunk) {
        // Concat chunk to responseBody
        responseBody += chunk;
      })
      .on('end', function() {
        let globalQuote = JSON.parse(responseBody)['Global Quote'];

        // Check for valid response from api before parsing
        if (Object.keys(globalQuote).length === 0 ) {
          return console.log('invalid symbol...');
        }

        let symbol = globalQuote['01. symbol'],
            price = parseFloat(globalQuote['05. price']).toFixed(2),
            change = globalQuote['09. change'],
            percentChange = globalQuote['10. change percent'];

        console.log(`\n${symbol}  ${price}  ${styleChangeValues(change, percentChange)}\n`);
      });
  });

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
}


/* HELPERS */

// TESTS
// let change = args[0];
// let percentChange = args[1];
// console.log(typeof args);
// console.log(typeof args[0]);
// console.log(typeof args[1]);

// console.log(styleChangeValues(change, percentChange));

/**
 * Handle user input
 * @param {*}  
 * @param {*}  
 */
function handleInput() {

}

/**
 * Styles output by changing colors of 'change' and 'percentChange' depending on polarity.
 * @param {String} change
 * @param {String} percentChange
 * @return {String} Styled output string
 */
function styleChangeValues(change, percentChange) {
  if ((typeof change !== 'string') || (typeof percentChange !== 'string')) return;

  change = parseFloat(change).toFixed(2);
  percentChange = parseFloat(percentChange).toFixed(2);

  // Add color based on polarity.
  // (positive: green, negative: red)
  let outputString = '';
  if (Math.sign(change) < 0) outputString += `\x1b[41m${change}\x1b[0m  `;
  else outputString += `\x1b[42m${change}\x1b[0m  `;
  
  if (Math.sign(percentChange) < 0) outputString += `\x1b[41m${percentChange}%\x1b[0m`;
  else outputString += `\x1b[42m${percentChange}%\x1b[0m`;

  return outputString;
}
