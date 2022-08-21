require('dotenv').config();

const express = require('express');
// const mongoose = require('mongoose');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const secret = '13685c935eeabf0eaa10e00fadca1e730df9d58509ea0fd7961b7d968c8bcb82aca7462b8740f59278ba234e14921d7f16c3a4a45459c846eafcfa16384a0e55';
// mongoose.connect('');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const QUERY_1 = 'https://api.polygon.io/v2/aggs/ticker/';
const QUERY_2 = '/range/1/day/2021-07-22/2021-07-22?adjusted=true&sort=asc&limit=120&apiKey=chLY12wPaVGmzldoTfSROxsKOfJfS4GY';

// Instead of using this dummy DB, save data under User in mongo then draw from user on refresh
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
  // Replace db keys here with tickers from mongo database
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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (username, err) => {
      if (err) return res.sendStatus(403);
      req.username = username; 
      next();
    });
  }
}

app.get('/', authenticateToken, async (req, res) => {
  const newData = await refreshData();
  res.send(newData);
});

app.post('/add-stock', authenticateToken, jsonParser, async (req, res) => {
  const ticker = req.body.ticker,
    quantity = req.body.quantity;
  
  if (!db[ticker]) {
    db[ticker] = quantity;
  } else db[ticker] = parseInt(db[ticker]) + parseInt(quantity);

  const newData = await refreshData();
  res.send(newData);
});

app.post('/delete-stock', authenticateToken, jsonParser, async (req, res) => {
  const ticker = req.body.ticker;
  console.log('Ticker: ',ticker);
  delete db[ticker];
  console.log(db);
  const newData = await refreshData();
  res.send(newData);
});

app.post('/login', jsonParser, (req, res) => {
  const username = req.body.username, 
    password = req.body.password;
  const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});

app.post('/signup', jsonParser, async (req, res) => {
  const username = req.body.newUsername, 
    password = req.body.newPassword; 
      
  // Adding user to Mongo database
  // try {
  //   const user = await  User.create({
  //     userID,
  //     password,
  //     stockQuantities: {}
  //   }); 
  //   res.json({ status: 'ok' });
  // } catch (err) { 
  //   res.json({ status: 'error' });
  //  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});