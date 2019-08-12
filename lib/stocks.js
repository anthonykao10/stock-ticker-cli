require('dotenv').config();
const https = require('https');
const ora = require('ora');
const readline = require('readline');


/**
 * Sends API Request to retrieve stock data, logging price and change/percent changes.
 * @param {String} symbol  
 */
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
  
  // Start spinner
  const spinner = ora('requesting data...').start();

  const req = https.request(options, (res) => {
    var responseBody = '';

    res
      .on('data', function (chunk) {
        // Concat chunk to responseBody
        responseBody += chunk;
      })
      .on('end', function () {
        let globalQuote = JSON.parse(responseBody)['Global Quote'];

        // Check for valid response from api before parsing
        if (Object.keys(globalQuote).length === 0) {
          return console.log('invalid symbol...');
        }

        let symbol = globalQuote['01. symbol'],
          price = parseFloat(globalQuote['05. price']).toFixed(2),
          change = globalQuote['09. change'],
          percentChange = globalQuote['10. change percent'];

        spinner.stop();

        console.log(`\n${symbol}  ${price}  ${styleChangeValues(change, percentChange)}\n`);
      });
  });

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
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


/**
 * Logs help screen
 */
function showHelp() {
  console.log(`
    STOCK TICKER CLI: 
    shows current stock price (and price change) for a given symbol.

    usage: 
      stock-ticker <stock_symbol>
      eg: stock-ticker SPX

    displays help screen:
      stock-ticker [-help]
      stock-ticker [-h]
      stock-ticker 
  `);
}

module.exports = {
  getStockQuote: getStockQuote,
  showHelp: showHelp
}