const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

const QUERY_1 = 'https://api.polygon.io/v2/aggs/ticker/';
const QUERY_2 = '/range/1/day/2021-07-22/2021-07-22?adjusted=true&sort=asc&limit=120&apiKey=chLY12wPaVGmzldoTfSROxsKOfJfS4GY';

const data1 = [{ticker: "GOOG", price: 10, quantity: 5}];


const fetchTickers = async (tickers = ['GS', 'AAPL', 'W']) => {
  const stockPrices = [];
  for (const ticker of tickers) {
    await fetch(QUERY_1 + ticker + QUERY_2).then(data => data.json()).then(res => {
      stockPrices.push(res.results ? [res.ticker, res.results[0].vw] : ''); 
    });
  }
  console.log(stockPrices);
  return stockPrices;
}


app.get('/', async (req, res) => {
  let data = await fetchTickers();
  data = data.map((arr) => {
    return {
      ticker: arr[0],
      price: arr[1],
      quantity: 1,
    };
  });
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});