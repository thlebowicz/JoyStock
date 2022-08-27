import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login/Login';
import ListTab from './List/ListTab';
import GraphTab from './Graph/GraphTab.js';
import NotificationTab from './Notifications/NotificationTab.js';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContextProvider, Context } from './Context/Context.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme();

root.render(
  <React.StrictMode>
    <ContextWrapper />
  </React.StrictMode>
);

function ContextWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ContextProvider>
          <Wrapper />
        </ContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function Wrapper() {
  const [data, setData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const context = useContext(Context);
  const authToken = context.authToken;

  console.log('authToken in Wrapper:', authToken);
  console.log('username in Wrapper:', context.username);

  const readData = () => {
    fetch('http://localhost:3000/', {
      method: 'GET',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
      },
    })
      .then((response) => response.json())
      .then((json) => setData(json));
  };

  const addTickerToData = (tickerToAdd, quantity) => {
    fetch('http://localhost:3000/add-stock', {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
      },
      body: JSON.stringify({
        ticker: tickerToAdd,
        quantity: quantity,
      }),
      cache: 'default',
    })
      .then((response) => response.json())
      .then((json) => setData(json));
  };

  const deleteTickerFromData = (tickerToDelete) => {
    fetch('http://localhost:3000/delete-stock', {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
      },
      body: JSON.stringify({
        ticker: tickerToDelete,
      }),
      cache: 'default',
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((json) => setData(json));
  };

  const updateQuantity = (ticker, newQuantity) => {};

  return (
    <Routes>
      <Route path="/" element={<Login readData={readData} />} />
      <Route
        path="/list"
        element={
          <ListTab
            data={data}
            addTickerToData={addTickerToData}
            deleteTickerFromData={deleteTickerFromData}
            readData={readData}
          />
        }
      />
      <Route path="/graph" element={<GraphTab />} />
      <Route path="/notifications" element={<NotificationTab />} />
    </Routes>
  );
}

reportWebVitals();
