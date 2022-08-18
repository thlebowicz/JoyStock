const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const QUERY_1 = 'https://api.polygon.io/v2/aggs/ticker/';
const QUERY_2 = '/range/1/day/2021-07-22/2021-07-22?adjusted=true&sort=asc&limit=120&apiKey=chLY12wPaVGmzldoTfSROxsKOfJfS4GY';

const db = {};

const fetchTickers = async (tickers = ['GS', 'AAPL', 'W', 'DDOG', 'XPO']) => {
  const stockPrices = [];
  for (const ticker of tickers) {
    await fetch(QUERY_1 + ticker + QUERY_2).then(data => data.json()).then(res => {
      stockPrices.push(res.results ? [res.ticker, res.results[0].vw] : ['Loading', 0]); 
    });
  }
  return stockPrices;
}

const refreshData = async () => {
  let data = await fetchTickers(Object.keys(db));
  data = data.map((arr) => {
    return {
      ticker: arr[0],
      price: arr[1],
      quantity: db[arr[0]],
    };
  });
  return data;
}

app.get('/', async (req, res) => {
  const newData = await refreshData();
  res.send(newData);
});

app.post('/stock', jsonParser, async (req, res) => {
  const ticker = req.body.ticker,
        quantity = req.body.quantity;
  
  if (!db[ticker]) {
    db[ticker] = quantity;
  } else db[ticker] = parseInt(db[ticker]) + parseInt(quantity);

  const newData=  await refreshData();
  res.send(newData);
});

app.post('/signup', jsonParser, async (req, res) => {
  const userID = req.body.newUserID, 
        password = req.body.newPassword; 
  console.log(userID, password);
  res.send('Got it!');
  // Add user to database
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});