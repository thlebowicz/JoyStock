require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Notification = require('./models/notification.model');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const LRU = require('lru-cache');
const fs = require('fs');
const path = require('path');
const fetch = require("node-fetch");
const uri = process.env.MONGODB_URI;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend/build')));

mongoose.connect(uri);

// mongoose.connect('');

const QUERY_1 = 'https://api.polygon.io/v2/aggs/ticker/';
const QUERY_2 =
  '?adjusted=true&sort=desc&limit=120&apiKey=' +
  process.env.POLYGON_API_KEY;
const FUNDAMENTALS = {
  income_statement: [
    'revenues',
    'net_income_loss',
    'basic_earnings_per_share',
  ],
  balance_sheet: ['assets', 'equity', 'liabilities'],
  cash_flow_statement: [
    'net_cash_flow_from_operating_activities',
    'net_cash_flow_from_investing_activities',
    'net_cash_flow_from_financing_activities_continuing',
  ],
};
const MILLISECONDS_IN_DAY = 86400000;
const MILLISECONDS_PER_INTERVAL = {
  day: MILLISECONDS_IN_DAY,
  year: MILLISECONDS_IN_DAY * 365,
  week: MILLISECONDS_IN_DAY * 7,
  month: MILLISECONDS_IN_DAY * 30,
  hour: MILLISECONDS_IN_DAY / 24,
}

let allTickers;

fs.readFile('tickers.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  } else {
      allTickers = new Set(data.split(','));
  }
});

const options = {
  max: 500,
  ttl: 1000 * 60 * 2,
};

const cache = new LRU(options);

const fetchTickerPrice = (ticker) => {
  if (cache.get(ticker)) {
    return cache.get(ticker)[0];
  } else {
    const timeStr =
      '/range/1/day/' + (Date.now() - 304800000) + '/' + Date.now();
    return fetch(QUERY_1 + ticker + timeStr + QUERY_2)
      .then((data) => data.json())
      .then((json) => json?.results[0]?.vw);
  }
};

const sendAllNotifications = async () => {
  const allStocks = await Notification.distinct('ticker');
  await Promise.all(
    allStocks.map(async (stock) => {
      try {
        const stockPrice = await fetchTickerPrice(stock);
        sendNotificationsForStock(stock, stockPrice);
      } catch (err) {
        console.log(`Failed to fetch price for ${stock}`);
        console.error(err);
      }
    })
  );
};

// Notification worker
setInterval(sendAllNotifications, 1000 * 60 * 60);
const sendNotificationsForStock = async (stock, price) => {
  if (price) {
    const greaterThan = await Notification.find({
      ticker: stock,
      condition: '>=',
      price: { $lte: price },
    });
    const lessThan = await Notification.find({
      ticker: stock,
      condition: '<=',
      price: { $gte: price },
    });
    const notifsToSend = [...greaterThan, ...lessThan];
    notifsToSend.forEach((notif) => {
      if (Date.now() - notif.lastTriggered > MILLISECONDS_IN_DAY) {
        const { userID, ticker, condition, price } = notif;
        const msg = {
          to: userID, // Change to your recipient
          from: 'joystock.portfolio.official@gmail.com', // Change to your verified sender
          subject: 'JoyStock Notification Triggered',
          text:
            ticker +
            ' price is now ' +
            (condition === '>=' ? 'above ' : 'below ') +
            price +
            '!',
        };
        sgMail
          .send(msg)
          .then(() => {
            notif.lastTriggered = Date.now();
            notif.save();
          })
          .catch((error) => {
            console.log(`Email failed to send for ${userID}`);
            console.error(error);
          });
      }
    });
  }
};

const fetchTickers = async (tickers) => {
  const stockPrices = [];
  try {
    const tickerData = await Promise.all(tickers.map(fetchTicker));
    tickerData.forEach((tickerObj) => {
      const { ticker, priceData, historicalData } = tickerObj;
      const priceFeed = priceData.results;
      const stockDataToSend = priceFeed
        ? [ticker, priceFeed[0].vw, priceFeed[1].vw]
        : ['API Limit Reached', 0, 0];
      for (const statement in FUNDAMENTALS) {
        for (const field of FUNDAMENTALS[statement]) {
          const data = historicalData?.[statement]?.[field]?.value;
          stockDataToSend.push(data ? data : 'No data available');
        }
      }
      stockPrices.push(stockDataToSend);
    });
    return stockPrices;
  } catch (err) {
    console.log('Failed to fetch stock data');
    console.error(err);
    return [];
  }
};

const fetchTicker = async (ticker) => {
  const timeStr =
    '/range/1/day/' + (Date.now() - 304800000) + '/' + Date.now();
  let ret;
  if (cache.get(ticker)) {
    ret = cache.get(ticker);
  } else {
    try {
    const priceDataPromise = fetch(
      QUERY_1 + ticker + timeStr + QUERY_2
    ).then((data) => data.json());

    const historicalDataPromise = fetch(
      'https://api.polygon.io/vX/reference/financials?ticker=' +
        ticker +
        '&apiKey=' +
        process.env.POLYGON_API_KEY
    )
      .then((data) => data.json())
      .then((json) =>
        json && json.results && json.results[0]
          ? json.results[0].financials
          : null
      );
    const [priceData, historicalData] = await Promise.all([
      priceDataPromise,
      historicalDataPromise,
    ]);
    const tickerData = {
      ticker,
      priceData: priceData,
      historicalData: historicalData,
    };
    cache.set(ticker, tickerData);
    ret = tickerData;
  } catch (err) {
    console.log(`Failed to fetch data for ${ticker}`);
    console.error(err);
    return {};
  }
  }
  sendNotificationsForStock(ret.ticker, ret?.priceData?.results[0]?.vw);
  return ret;
};

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

app.get('/get-username', authenticateToken, async (req, res) => {
  res.send({ username: req.username });
});

app.get('/get-stock-data', authenticateToken, async (req, res) => {
  try {
    const username = req.username;
    const user = await User.findOne({
      userID: username,
    });
    const newData = await refreshData(user);
    res.send(newData);
  } catch (err) {
    console.log('Couldnt fetch data');
    console.error(err);
    res.sendStatus(400);
  }
});

const refreshData = async (user) => {
  if (!user) {
    return null;
  }
  try {
    const stockQtys = user.stockQuantities;
    const tickers = [...user.stockQuantities.keys()];
    const newPrices = await fetchTickers(tickers);

    const newData = newPrices.map((arr) => {
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
      };
    });
    return newData;
  } catch (err) {
    console.log('Coudlnt refresh data');
    console.error(err);
    return [];
  }
};

const validateTicker = (tickerStr) => {
  return allTickers.has(tickerStr);
}

const validateQuantity = (quantity) => {
  const parsed = parseInt(quantity);
  return parsed && parsed > 0;
}

app.post('/add-stock', authenticateToken, jsonParser, async (req, res) => {
  const ticker = req.body.ticker,
    quantity = req.body.quantity,
    username = req.username;
  
  if (!validateTicker(ticker)) {
    res.json({ status: 'error', error: 'invalid ticker' });
    return;
  } else if (!validateQuantity(quantity)) {
    res.json({ status: 'error', error: 'invalid quantity' });
    return;
  }

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

  const user = await User.findOne({
    userID: username,
  });

  if (!user) {
    console.log('Bad user');
    res.json({ status: 'error', error: 'Invalid username' });
  } else {
    const isPasswordValid = password === user.password;
    if (isPasswordValid) {
      const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
      res.json({ status: 'ok', token: token });
    } else {
      res.json({ status: 'error', token: false });
    }
  }
});

app.post('/signup', jsonParser, async (req, res) => {
  // console.log('Sign Up API Call');
  // console.log(req.body);
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

app.get('/get-notifications', authenticateToken, async (req, res) => {
  const userNotifs = await Notification.find({ userID: req.username });
  res.send(userNotifs);
});

app.post(
  '/add-notification',
  authenticateToken,
  jsonParser,
  async (req, res) => {
    const notifPrice = req.body.notifPrice,
      notifCondition = req.body.notifCondition,
      notifTicker = req.body.notifTicker,
      notifUser = req.username,
      lastTriggered = 0;
    const notifID = notifPrice + notifCondition + notifTicker + notifUser;

    try {
      await Notification.create({
        notifID: notifID,
        ticker: notifTicker,
        userID: notifUser,
        price: notifPrice,
        condition: notifCondition,
        lastTriggered: lastTriggered,
      });
      res.json({ status: 'ok' });
    } catch (err) {
      res.json({
        status: 'error',
        error: 'error',
      });
    }
  }
);

app.post(
  '/delete-notification',
  authenticateToken,
  jsonParser,
  async (req, res) => {
    const notifID = req.body.notifID;
    try {
      const notif = await Notification.findOne({
        notifID: notifID,
      });
      if (!notif) {
        res.json({ status: 'error', error: 'invalid notification' });
      } else {
        await notif.remove();
        const newNotifs = await Notification.find({ userID: req.username });
        res.send(newNotifs);
      }
    } catch (err) {
    console.log('Couldnt delete notif');
    console.error(err);
    res.sendStatus(400);
  }
});

app.post('/fetch-graph-data', authenticateToken, jsonParser, async (req, res) => {
  const numDatapoints = req.body.numDatapoints, tickers = req.body.tickers, interval = req.body.interval;
  // Accounting for market holidays
  const totalQueries = 100;
  const timeStr =
      '/range/1/' + interval + '/' + (Date.now() - MILLISECONDS_PER_INTERVAL[interval] * totalQueries) + '/' + Date.now();
  const data = await(Promise.all(tickers.map(ticker => 
    fetch(QUERY_1 + ticker + timeStr + QUERY_2)
        .then((data) => data.json())
        .then((json) => json?.results)
        .then(priceData => priceData.slice(0, numDatapoints).map(res=>res.vw).reverse())
        .catch(err => console.error(err)))
  ));
  const ret = new Array(data[0]?.length ? data[0].length : 0).fill(0).map(() => new Object());
  for (let i = 0; i < ret.length; i++) {
    ret[i]['x'] = i; 
    for (let j = 0; j < tickers.length; j++) {
      ret[i][tickers[j]] = data[j][i];
    }
  }
  res.send(ret);
});

// const interval = 'day';
// const numDatapoints = 20;
// const totalQueries = 100 ;
// fetch(QUERY_1 + 'GOOG' + '/range/1/' + interval + '/' + (Date.now() - MILLISECONDS_PER_INTERVAL[interval] * totalQueries) + '/' + Date.now() + QUERY_2)
//       .then((data) => data.json())
//       .then((json) => json?.results)
//       .then(res => console.log('Data for graph: ', res ? res.slice(0, numDatapoints).length : null));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`JoyStock listening on port ${port}`);
});
