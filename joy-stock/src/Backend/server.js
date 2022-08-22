require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/joystock2');

const secret =
  '13685c935eeabf0eaa10e00fadca1e730df9d58509ea0fd7961b7d968c8bcb82aca7462b8740f59278ba234e14921d7f16c3a4a45459c846eafcfa16384a0e55';
// mongoose.connect('');

const QUERY_1 = 'https://api.polygon.io/v2/aggs/ticker/';
const QUERY_2 =
  '/range/1/day/2021-07-22/2021-07-22?adjusted=true&sort=asc&limit=120&apiKey=chLY12wPaVGmzldoTfSROxsKOfJfS4GY';

// Instead of using this dummy DB, save data under User in mongo then draw from user on refresh
const db = {};


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  } else {
    console.log(`token sent = ${token}`);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, username) => {
      if (err) return res.sendStatus(403);
      req.username = username;
      next();
    });
  }
};

app.get('/', authenticateToken, async (req, res) => {
  const newData = await refreshData();
  res.send(newData);
});

const fetchTickers = async (
  tickers = ['GS', 'AAPL', 'W', 'DDOG', 'XPO']
) => {
  const stockPrices = [];
  for (const ticker of tickers) {
    await fetch(QUERY_1 + ticker + QUERY_2)
      .then((data) => data.json())
      .then((res) => {
        stockPrices.push(
          res.results ? [res.ticker, res.results[0].vw] : ['Loading', 0]
        );
      });
  }
  return stockPrices;
};

const refreshData = async (user) => {
  // Replace db keys here with tickers from mongo database

  console.log(user.stockQuantities);

  // let data = await fetchTickers(Object.keys(db));
  // data = data.map((arr) => {
  //   return {
  //     ticker: arr[0],
  //     price: arr[1],
  //     quantity: db[arr[0]],
  //   };
  // });
  // return data;
};

app.post('/add-stock', authenticateToken, jsonParser, async (req, res) => {
  const ticker = req.body.ticker,
    quantity = req.body.quantity,
    username = req.username;
  console.log(ticker, quantity);

  const user = await User.findOne({
    userID: username,
  });

  if (!user) {
    res.json({ status: 'error', error: 'invalid user' });
  } else {
    const curr = user.stockQuantities.get(ticker);
    const currVal = curr ? parseInt(curr) : 0;
    const newVal = parseInt(quantity) + currVal;
    console.log(`currVal = ${currVal}, newVal = ${newVal}`);
    console.log(`ticker = ${ticker}`)
    user.stockQuantities.set(ticker, newVal);
    const newData = await refreshData(user); 
  }


  // console.log(`username = ${req.username}`);

  // if (!db[ticker]) {
  //   db[ticker] = quantity;
  // } else db[ticker] = parseInt(db[ticker]) + parseInt(quantity);

  // const newData = await refreshData();
  // res.send(newData);
});

app.post('/login', async (req, res) => {
  const username = req.body.username,
    password = req.body.password;
  console.log('Login API call');
  console.log(`Username: ${username}, password: ${password}`);

  const user = await User.findOne({
    userID: username,
  });

  if (!user) {
    console.log('Bad user');
    res.json({ status: 'error', error: 'Invalid username' });
  } else {
    const isPasswordValid = password === user.password;
    console.log(`Valid pass? ${isPasswordValid}`);
    if (isPasswordValid) {
      const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
      res.json({ status: 'ok', token: token });
    } else {
      res.json({ status: 'error', token: false });
    }
  }
});

app.post('/signup', jsonParser, async (req, res) => {
  console.log('Sign Up API Call');
  console.log(req.body);
  try {
    await User.create({
      userID: req.body.username,
      password: req.body.password,
      stockQuantities: {},
    });
    res.json({ status: 'ok' });
  } catch (err) {
    res.json({
      status: 'error',
      error: 'error',
    });
  }
});

app.post(
  '/delete-stock',
  authenticateToken,
  jsonParser,
  async (req, res) => {
    const ticker = req.body.ticker;
    console.log('Ticker: ', ticker);
    delete db[ticker];
    console.log(db);
    const newData = await refreshData();
    res.send(newData);
  }
);

app.listen(port, () => {
  console.log(`Test app listening on port ${port}`);
});
