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
const LRU = require('lru-cache');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/joystock2');

const secret =
  '13685c935eeabf0eaa10e00fadca1e730df9d58509ea0fd7961b7d968c8bcb82aca7462b8740f59278ba234e14921d7f16c3a4a45459c846eafcfa16384a0e55';
// mongoose.connect('');

const QUERY_1 = 'https://api.polygon.io/v2/aggs/ticker/';
const QUERY_2 =
  '?adjusted=true&sort=desc&limit=120&apiKey=chLY12wPaVGmzldoTfSROxsKOfJfS4GY';
const FUNDAMENTALS = {
  income_statement: ['revenues', 'net_income_loss', 'basic_earnings_per_share'], 
  balance_sheet: ['assets', 'equity', 'liabilities'],
  cash_flow_statement: ['net_cash_flow_from_operating_activities', 'net_cash_flow_from_investing_activities', 
    'net_cash_flow_from_financing_activities_continuing'],
};

const options = {
  max: 500,
  ttl: 1000 * 60 * 24,
}

const cache = new LRU(options);

const fetchTickers = async (tickers) => {
  const stockPrices = [];
  
  const tickerData = await Promise.all(tickers.map(fetchTicker));
  tickerData.forEach((tickerObj) => {
      const { ticker, priceData, historicalData } = tickerObj;
      const priceFeed = priceData.results;
      const stockDataToSend = priceFeed ? [ticker, priceFeed[0].vw, priceFeed[1].vw] : ['API Limit Reached', 0, 0];
      for (const statement in FUNDAMENTALS) {
        for (const field of FUNDAMENTALS[statement]) {
          console.log(historicalData);
          const data = historicalData?.[statement]?.[field]?.value;
          stockDataToSend.push(data ? data : 'API Limit Reached');
        }
      }
      stockPrices.push(stockDataToSend);
  });
  
  return stockPrices;
} 

const fetchTicker = async (ticker) => {
   const timeStr = '/range/1/day/' + (Date.now() - 304800000) + '/' + Date.now();
   if (cache.get(ticker)) {
    return cache.get(ticker);
   } else {
    const priceDataPromise = fetch(QUERY_1 + ticker + timeStr + QUERY_2).then(data => data.json()); 
    const historicalDataPromise = fetch('https://api.polygon.io/vX/reference/financials?ticker=' + ticker + '&apiKey=chLY12wPaVGmzldoTfSROxsKOfJfS4GY')
                                    .then(data => data.json())
                                    .then(json => json && json.results && json.results[0] ? json.results[0].financials : null);
    const [priceData, historicalData] = await Promise.all([priceDataPromise, historicalDataPromise]);
    console.log('Historical data: ', historicalData);
    const tickerData = {
      ticker,
      priceData: priceData,
      historicalData: historicalData,
    };
    cache.set(ticker, tickerData)
    return tickerData;
  }
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, username) => {
      if (err) return res.sendStatus(403);
      req.username = username;
      next();
    });
  }
};

app.get('/', authenticateToken, async (req, res) => {
  const username = req.username;
  const user = await User.findOne({
    userID: username,
  });
  const newData = await refreshData(user);
  res.send(newData);
});

const refreshData = async (user) => {
  if (!user) {
    return null;
  };

  const stockQtys = user.stockQuantities;
  const tickers = [...user.stockQuantities.keys()];
  const newPrices = await fetchTickers(tickers);

  const newData = newPrices.map(arr => {
    return {
      ticker: arr[0],
      currPrice: arr[1],
      lastDayPrice: arr[2],
      revenue: arr[3],
      netIncome: arr[4],
      basicEPS: arr[5],
      assets: arr[6],
      equity: arr[7],
      liabilities: arr[8],
      cfo: arr[9],
      cfi: arr[10],
      cff: arr[11],
      quantity: stockQtys.get(arr[0]),
    }
  });
  return newData;
};

app.post('/add-stock', authenticateToken, jsonParser, async (req, res) => {
  const ticker = req.body.ticker,
    quantity = req.body.quantity,
    username = req.username;

  const user = await User.findOne({
    userID: username,
  });

  if (!user) {
    res.json({ status: 'error', error: 'invalid user' });
  } else {
    const curr = user.stockQuantities.get(ticker);
    const currVal = curr ? parseInt(curr) : 0;
    const newVal = parseInt(quantity) + currVal;
    user.stockQuantities.set(ticker, newVal);
    user.save();
    const newData = await refreshData(user); 
    res.send(newData);
  }
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
    const ticker = req.body.ticker,
      username = req.username,
      user = await User.findOne({
        userID: username,
       });
    if (!user) {
      res.json({ status: 'error', error: 'invalid user' });
    } else {
      user.stockQuantities.delete(ticker);
      user.save();
      const newData = await refreshData(user); 
      res.send(newData);
    }
  }
);

app.listen(port, () => {
  console.log(`Test app listening on port ${port}`);
});
