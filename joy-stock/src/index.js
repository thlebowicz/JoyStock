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
import Header from './Header/Header.js';

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
          <RouteWrapper />
        </ContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function RouteWrapper() {
  const context = useContext(Context);

  return (
    <div>
      {context.username === '' ? null : <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/list" element={<ListTab />} />
        <Route path="/graph" element={<GraphTab />} />
        <Route path="/notifications" element={<NotificationTab />} />
      </Routes>
    </div>
  );
}

reportWebVitals();
