import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login/Login';
import ListTab from './List/ListTab';
import GraphTab from './Graph/GraphTab.js';
import NotificationTab from './Notifications/NotificationTab.js';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContextProvider } from './Context/Context.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme();

root.render(
  <React.StrictMode>
    <Wrapper />
  </React.StrictMode>
);

function Wrapper() {
  const [data, setData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('joystockToken');
    if (token) {
      setAuthToken(token);
    } else setAuthToken(null);
  }, []);

  const createToken = (tkn) => {
    if (authToken === tkn) return;
    sessionStorage.setItem('joystockToken', tkn);
    setAuthToken(tkn);    
  };

  const readData = () => {
    fetch('http://localhost:3000/', {
      method: 'GET',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
      },
    }).then((response) => response.json())
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

  const readNotifications = () => {
    fetch('http://localhost:3000/get-notifications', {
      method: 'GET',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
      },
    }).then((response) => response.json())
      .then((json) => setNotifications(json));
  }

  const deleteNotification = (notifID) => {
    fetch('http://localhost:3000/delete-notification', {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
      },
      body: JSON.stringify({
        notifID
      }),
      cache: 'default',
    })
      .then((response) => response.json())
      .then((json) => {
        setNotifications(json);
        console.log('New notifs: ', notifications);
      });
  }

  const updateQuantity = (ticker, newQuantity) => {};

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ContextProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Login readData={readData} createToken={createToken} />
              }
            />
            <Route
              path="/list"
              element={
                <ListTab
                  data={data}
                  addTickerToData={addTickerToData}
                  deleteTickerFromData={deleteTickerFromData}
                  readData={readData}
                  readNotifications={readNotifications}
                />
              }
            />
            <Route path="/graph" element={<GraphTab />} />
            <Route path="/notifications" element={
            <NotificationTab
              notifications={notifications}
              readNotifications={readNotifications}
              deleteNotification={deleteNotification}
             />
             } />
          </Routes>
        </ContextProvider>  
      </BrowserRouter>
    </ThemeProvider>
  );
}

reportWebVitals();
