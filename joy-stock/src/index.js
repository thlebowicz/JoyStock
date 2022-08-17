import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login/Login';
import ListTab from './List/ListTab';
import GraphTab from './Graph/GraphTab.js';
import NotificationTab from './Notifications/NotificationTab.js';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme();

root.render(
  <React.StrictMode>
    <Wrapper />
  </React.StrictMode>
);

function Wrapper() {

  const [data, setData] = useState([]);

  const readData = () => {
    fetch('http://localhost:3000/')
    .then(response => response.json()).then(json => setData(json));
  };

  const addTickerToData = (tickerToAdd, quantity) => {
    fetch('http://localhost:3000/stock', {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ticker: tickerToAdd,
        quantity: quantity,
      }),
      cache: 'default'
    }).then(response => response.json()).then(json => setData(json));
  };

  const updateQuantity = (ticker, newQuantity) => {};

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login readData={readData} />} />
          <Route path='/list' element={<ListTab 
            data={data} 
            addTickerToData={addTickerToData} 
            readData={readData} 
          />} />
          <Route path='/graph' element={<GraphTab />} />
          <Route path='/notifications' element={<NotificationTab />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

reportWebVitals();
