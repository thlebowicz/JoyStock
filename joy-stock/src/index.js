import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login';
import ListTab from './ListTab';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

const data = [{ticker: "GOOG", price: 10}, {ticker: 'AAPL', price: 20}, {ticker: 'MSFT', price: 30}];

root.render(
  <React.StrictMode>
    {/* <Login /> */}
    <ListTab data={data} />
  </React.StrictMode>
);


reportWebVitals();
